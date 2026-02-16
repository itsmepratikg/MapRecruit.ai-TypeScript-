---
description: Automatically detects and moves temporary test scripts and log files to the .trash directory.
---

# Workspace Cleanup Skill

## Purpose
This skill ensures the workspace remains clean by automatically identifying and archiving temporary files, test scripts, and debug logs into a `.trash` directory. This prevents clutter in the project root and backend folders.

## Rules

### 1. Target Files
The following file patterns are considered "temporary" and should be moved to `.trash`:
- **Test Scripts:** `test_*.js`, `test_*.cjs`, `test_*.ts` (unless inside a `__tests__` or `tests` directory)
- **Debug Logs:** `*.log`, `error.txt`, `debug_*.txt`
- **Temp Files:** `temp_*`, `tmp_*`

### 2. Execution Logic
When this skill is triggered (or via Orchestrator):
1.  **Check for Existence:** Look for files matching the patterns in the Project Root and `backend/` directory.
2.  **Create Trash:** Ensure a `.trash` directory exists in the Project Root.
3.  **Move Files:** Move identified files to `.trash`. 
    - *Note:* Do not overwrite existing files in `.trash` if possible, or append a timestamp if collision occurs (optional). For simplicity, overwrite is acceptable for temp files.
4.  **Notify (Optional):** If files were moved, briefly mention it in the final response (e.g., "Archived 3 test scripts to .trash").

## Usage
Run this cleanup routine:
- After creating and running verification scripts.
- At the end of a task (Verification Phase).
- When the user explicitly requests "cleanup".
