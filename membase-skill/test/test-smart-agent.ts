#!/usr/bin/env bun
/**
 * Smart Agent - Uses Membase Skill for decision-making
 * Simulates a real AI agent workflow
 */

import { spawn } from "child_process";
import { promisify } from "util";
import { readFileSync, writeFileSync } from "fs";

const sleep = promisify(setTimeout);

interface AgentMemory {
	lastBackupTime?: string;
	backupCount: number;
	decisions: string[];
}

class SmartAgent {
	private memory: AgentMemory;
	private workspace: string;
	private skillPath: string;

	constructor() {
		this.workspace = process.env.HOME + "/.openclaw/workspace";
		this.skillPath = "./skills/membase/membase.ts";
		this.memory = {
			backupCount: 0,
			decisions: [],
		};
	}

	private async executeSkill(
		command: string,
		args: string[] = [],
	): Promise<{ success: boolean; output: string; json?: any }> {
		return new Promise((resolve) => {
			const childProcess = spawn("bun", [this.skillPath, command, ...args], {
				cwd: process.cwd(),
				env: process.env,
			});

			let output = "";
			childProcess.stdout.on("data", (data) => (output += data.toString()));
			childProcess.stderr.on("data", (data) => (output += data.toString()));

			childProcess.on("close", (code) => {
				// Try to extract JSON output
				let json = undefined;
				const jsonMatch = output.match(/---JSON_OUTPUT---([\s\S]*?)---END_JSON---/);
				if (jsonMatch) {
					try {
						json = JSON.parse(jsonMatch[1].trim());
					} catch {}
				}

				resolve({ success: code === 0, output, json });
			});
		});
	}

	private log(emoji: string, message: string) {
		console.log(`${emoji} ${message}`);
	}

	private think(thought: string) {
		console.log(`💭 Agent thinking: ${thought}`);
		this.memory.decisions.push(thought);
	}

	private async analyzeStatus() {
		this.log("🔍", "Analyzing current status...");
		const result = await this.executeSkill("status");

		if (result.json) {
			const status = result.json.status;
			this.log(
				"📊",
				`Found: ${status.local.fileCount} local files, ${status.remote.backupCount} remote backups`,
			);

			// Decision logic
			if (status.remote.backupCount === 0) {
				this.think("No backups exist; need to create initial backup immediately");
				return "create_initial_backup";
			}

			if (status.local.fileCount > 0) {
				this.think("Local files detected; should create incremental backup");
				return "create_incremental_backup";
			}

			this.think("Status is good; continue monitoring");
			return "monitor";
		}

		return "error";
	}

	private async createBackup(incremental = false) {
		this.log("💾", incremental ? "Creating incremental backup..." : "Creating full backup...");

		const args = [
			"--password",
			process.env.MEMBASE_BACKUP_PASSWORD || "",
			"--workspace",
			this.workspace,
		];

		if (incremental) {
			args.push("--incremental");
		}

		const result = await this.executeSkill("backup", args);

		if (result.success && result.json) {
			const backupInfo = result.json;
			this.memory.lastBackupTime = backupInfo.timestamp;
			this.memory.backupCount++;

			this.log(
				"✅",
				`Backup successful: ${backupInfo.backupId} (${backupInfo.fileCount} files, ${Math.round(backupInfo.totalSize / 1024)} KB)`,
			);

			if (backupInfo.skippedFiles > 0) {
				this.log("ℹ️", `Skipped ${backupInfo.skippedFiles} unchanged files`);
			}

			return backupInfo.backupId;
		}

		this.log("❌", "Backup failed");
		return null;
	}

	private async listBackups() {
		this.log("📋", "Fetching backup list...");
		const result = await this.executeSkill("list");

		if (result.success && result.json) {
			const backups = result.json;
			this.log("📊", `Found ${backups.length} backups total`);

			// Analyze backup trend
			const totalFiles = backups.reduce(
				(sum: number, b: any) => sum + b.fileCount,
				0,
			);
			const avgFilesPerBackup = (totalFiles / backups.length).toFixed(1);

			this.think(
				`Backup stats: average ${avgFilesPerBackup} files per backup`,
			);

			return backups;
		}

		return [];
	}

	async run() {
		console.log("🤖 Smart Agent starting");
		console.log("=".repeat(50));
		console.log("");

		// Phase 1: Status analysis
		this.log("🎯", "Phase 1: Status analysis");
		const action = await this.analyzeStatus();
		await sleep(1000);

		// Phase 2: Execute decision
		console.log("");
		this.log("🎯", "Phase 2: Execute decision");
		if (action === "create_initial_backup" || action === "create_incremental_backup") {
			const backupId = await this.createBackup(
				action === "create_incremental_backup",
			);

			if (backupId) {
				this.log("✨", `New backup created: ${backupId}`);
			}
		}
		await sleep(1000);

		// Phase 3: Verify and report
		console.log("");
		this.log("🎯", "Phase 3: Verify and report");
		const backups = await this.listBackups();

		console.log("");
		this.log("📝", "Agent work summary");
		console.log("-".repeat(50));
		console.log(`  Decisions made: ${this.memory.decisions.length}`);
		console.log(`  Backups created: ${this.memory.backupCount}`);
		console.log(`  Total backups: ${backups.length}`);

		if (this.memory.decisions.length > 0) {
			console.log("\n  Decision history:");
			this.memory.decisions.forEach((d, i) => {
				console.log(`    ${i + 1}. ${d}`);
			});
		}

		console.log("");
		this.log("✅", "Smart Agent task complete!");
	}
}

// Run smart agent
const agent = new SmartAgent();
agent.run().catch((error) => {
	console.error("❌ Agent error:", error);
	process.exit(1);
});
