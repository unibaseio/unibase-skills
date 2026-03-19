# Membase Skill Optimization Strategy

> Based on Unibase official Membase documentation and Agent Skills best practices

---

## 1. Current State Analysis

### 1.1 File Structure

```
membase-skill/
├── skills/membase/
│   ├── SKILL.md              # Main instructions (~327 lines)
│   ├── membase.ts            # CLI entry
│   └── commands/             # backup, restore, list, diff, status, cleanup
├── src/                      # Compiled lib
├── README.md
├── package.json
└── openclaw.plugin.json
```

**Characteristics**: Both Agent Skill and OpenClaw plugin; dual form.

### 1.2 Alignment with Official Membase

| Official Content | This Skill | Gap |
|------------------|------------|-----|
| **Hub URL** | testnet.hub.membase.io | Official mainnet: hub.membase.unibase.com |
| **Integration** | Skill ✅ | Official lists: SDK, MCP, Skill |
| **Quick Start** | None | Official has Python 5-minute example |
| **MEMBASE_ID** | Not used | Official Python SDK uses MEMBASE_ID |
| **MEMBASE_ACCOUNT** | ✅ | Aligned with AIP |

### 1.3 Core Issues

| Issue | Severity | Notes |
|-------|----------|-------|
| **Execution method** | High | `node membase.ts` cannot run TypeScript directly; needs tsx/bun or build |
| **Path ambiguity** | High | `cd skills/membase` depends on install location; paths differ by platform |
| **SKILL too long** | Medium | ~327 lines; recommend main text <500 lines, move some to references |
| **Endpoint inconsistency** | Medium | testnet vs hub.membase.unibase.com |
| **allowed-tools** | Low | Only bash; actually needs node |
| **Missing official links** | Medium | Missing Membase Hub, Quick Start, Integration Options |

---

## 2. Optimization Strategy

### 2.1 Unified Execution (P1)

**Issue**: `node membase.ts` cannot run TypeScript in standard Node.

**Approach**: Choose by runtime:

| Environment | Recommended Command |
|-------------|---------------------|
| **OpenClaw** | `openclaw membase backup` (preferred; plugin configured) |
| **After npm install** | `npx membase backup` (if bin configured correctly) |
| **Direct in project** | `npx tsx skills/membase/membase.ts backup` or `bun skills/membase/membase.ts backup` |
| **After build** | `node <compiled-path>` (if project supports) |

**SKILL update**: Change main command to "prefer OpenClaw, else npx tsx/bun", and document "run from skill install directory".

### 2.2 Path Documentation (P1)

**Current**: `cd skills/membase` depends on install layout.

**Recommendation**:
- Add "run from skill install root" note
- Add typical path examples:
  - Cursor: `.cursor/skills/membase-skill/skills/membase`
  - OpenClaw: `~/.openclaw/workspace/skills/membase-skill/skills/membase`
  - Repo root: `skills/membase-skill/skills/membase`
- Or standardize: `cd <membase-skill-install-dir>/skills/membase`

### 2.3 Progressive Disclosure (P2)

**Move to references/**:

| Content | Target File |
|---------|-------------|
| Error Handling | references/errors.md |
| Troubleshooting | references/troubleshooting.md |
| Full Examples | references/examples.md |
| Password Requirements | Keep in main (security related), or simplify |

**Keep in main SKILL**: Command table, Quick Start, core flow, config summary, links.

### 2.4 Configuration and Endpoint (P2)

**Add references/config.md**:

| Variable | Purpose | Default |
|----------|---------|---------|
| MEMBASE_ACCOUNT | BNB address | Required |
| MEMBASE_SECRET_KEY | Signing key | Required |
| MEMBASE_BACKUP_PASSWORD | Backup encryption password | Required (for backup/restore) |
| MEMBASE_ENDPOINT | Hub URL | testnet.hub.membase.io |

Note: Mainnet Hub is `https://hub.membase.unibase.com`; clarify relationship with testnet.

### 2.5 Metadata and Links (P2)

- **allowed-tools**: Add `node` (if execution needs node)
- **description**: Add triggers `restore`, `list backups`, `diff backups`, `status`
- **Official links**:
  - [Membase Hub](https://hub.membase.unibase.com/)
  - [Membase Quick Start](https://openos-labs.gitbook.io/unibase-docs/get-started/membase-quickstart)
  - [Integration Options](https://openos-labs.gitbook.io/unibase-docs/membase/integration-options) — SDK, MCP, Skill
  - [Membase GitHub](https://github.com/unibaseio/membase)

### 2.6 Cross-Skill References (P3)

- **AIP**: AIP Agent uses same MEMBASE_ACCOUNT/SECRET_KEY
- **unibase-pay**: Get BNB address (MEMBASE_ACCOUNT needs BNB)

### 2.7 Line Count Control (P3)

Goal: Keep main SKILL.md under 500 lines; use references for progressive disclosure.

---

## 3. Execution Command Specification

**Unified entry recommendation**:

```markdown
## How to Run

**From skill install directory** (e.g. `membase-skill/skills/membase`):

\`\`\`bash
# Option 1: OpenClaw (if plugin installed)
openclaw membase backup [--incremental]

# Option 2: npx tsx (TypeScript)
npx tsx membase.ts backup [--incremental]

# Option 3: bun
bun membase.ts backup [--incremental]
\`\`\`

Ensure `npm install` and `npm run build` have been run at package root.
```

---

## 4. File Change List

| File | Action |
|------|--------|
| `skills/membase/SKILL.md` | Update: execution, paths, trim, links, references |
| `skills/membase/references/config.md` | Add |
| `skills/membase/references/errors.md` | Add (optional) |
| `skills/membase/references/troubleshooting.md` | Add (optional) |
| `README.md` | Update: execution notes, official links |

---

## 5. Implementation Priority

| Phase | Content | Estimate |
|-------|---------|----------|
| **1** | Execution method, path docs, official links | Core |
| **2** | config.md, progressive disclosure, metadata | Polish |
| **3** | Cross-skill references, line count control | Enhance |

---

## 6. Acceptance Criteria

- [ ] Execution commands runnable (tsx/bun/openclaw at least one clearly documented)
- [ ] Path docs cover Cursor / OpenClaw / repo root
- [ ] At least 3 official doc links
- [ ] Main SKILL line count < 500 (or clearly trimmed)
- [ ] allowed-tools includes node (if applicable)

---

## 7. Reference Resources

- [Membase Quick Start](https://openos-labs.gitbook.io/unibase-docs/get-started/membase-quickstart)
- [Membase Hub](https://hub.membase.unibase.com/)
- [Integration Options](https://openos-labs.gitbook.io/unibase-docs/membase/integration-options)
- [Membase GitHub](https://github.com/unibaseio/membase)

---

*Document version: v1.0 | Based on membase-skill current state and Unibase official docs*
