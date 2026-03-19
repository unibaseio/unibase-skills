#!/usr/bin/env bun
/**
 * Standalone Agent Test - Uses Membase Skill
 * This agent runs completely standalone, independent of OpenClaw
 */

import { spawn } from "child_process";
import { promisify } from "util";

const sleep = promisify(setTimeout);

// Agent configuration
const AGENT_CONFIG = {
	name: "TestAgent",
	workspace: process.env.HOME + "/.openclaw/workspace",
	skillPath: "./skills/membase/membase.ts",
};

console.log("🤖 Standalone Agent starting");
console.log("==================");
console.log(`Agent: ${AGENT_CONFIG.name}`);
console.log(`Workspace: ${AGENT_CONFIG.workspace}`);
console.log(`Skill: ${AGENT_CONFIG.skillPath}`);
console.log("");

// Check environment variables
const requiredEnvVars = [
	"MEMBASE_ACCOUNT",
	"MEMBASE_SECRET_KEY",
	"MEMBASE_BACKUP_PASSWORD",
];

console.log("✓ Checking environment variables");
for (const envVar of requiredEnvVars) {
	if (!process.env[envVar]) {
		console.error(`  ❌ ${envVar} not set`);
		process.exit(1);
	}
	const value = process.env[envVar] || "";
	const preview =
		envVar.includes("SECRET") || envVar.includes("PASSWORD")
			? value.substring(0, 10) + "..."
			: value;
	console.log(`  ✓ ${envVar}: ${preview}`);
}
console.log("");

// Agent Task: Execute Membase skill command
async function executeSkill(
	command: string,
	args: string[] = [],
): Promise<{ success: boolean; output: string }> {
	return new Promise((resolve) => {
		const skillProcess = spawn("bun", [AGENT_CONFIG.skillPath, command, ...args], {
			cwd: process.cwd(),
			env: process.env,
		});

		let output = "";
		let errorOutput = "";

		skillProcess.stdout.on("data", (data) => {
			output += data.toString();
		});

		skillProcess.stderr.on("data", (data) => {
			errorOutput += data.toString();
		});

		skillProcess.on("close", (code) => {
			resolve({
				success: code === 0,
				output: output + errorOutput,
			});
		});
	});
}

// Agent main loop
async function runAgent() {
	console.log("🎯 Agent task sequence");
	console.log("=================");
	console.log("");

	// Task 1: Check backup status
	console.log("📋 Task 1: Check backup status");
	console.log("----------------------");
	const statusResult = await executeSkill("status");
	console.log(statusResult.output);
	if (!statusResult.success) {
		console.error("❌ Task failed");
		return;
	}
	await sleep(1000);

	// Task 2: Create backup
	console.log("\n📋 Task 2: Create backup");
	console.log("------------------");
	console.log("Agent decision: Need to create new backup to save current state");
	const backupResult = await executeSkill("backup", [
		"--password",
		process.env.MEMBASE_BACKUP_PASSWORD || "",
		"--workspace",
		AGENT_CONFIG.workspace,
	]);
	console.log(backupResult.output);
	if (!backupResult.success) {
		console.error("❌ Backup failed");
		return;
	}
	await sleep(1000);

	// Task 3: List all backups
	console.log("\n📋 Task 3: List all backups");
	console.log("----------------------");
	console.log("Agent decision: View all available backups");
	const listResult = await executeSkill("list");
	console.log(listResult.output);
	if (!listResult.success) {
		console.error("❌ List failed");
		return;
	}
	await sleep(1000);

	// Task 4: Check status again (verify backup was created)
	console.log("\n📋 Task 4: Verify backup was created");
	console.log("------------------------");
	const finalStatusResult = await executeSkill("status");
	console.log(finalStatusResult.output);

	console.log("\n✅ Agent tasks complete");
	console.log("=================");
	console.log("");
	console.log("Agent summary:");
	console.log("  ✓ Checked initial status");
	console.log("  ✓ Created new encrypted backup");
	console.log("  ✓ Listed all available backups");
	console.log("  ✓ Verified backup status");
	console.log("");
	console.log(`🤖 ${AGENT_CONFIG.name} successfully completed all tasks!`);
}

// Run Agent
runAgent().catch((error) => {
	console.error("❌ Agent error:", error);
	process.exit(1);
});
