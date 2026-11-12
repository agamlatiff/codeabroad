# Minimal Git Diff & Code Modification Integrity Policy

## 1. Absolute Prohibition of Full-File Overwriting
- **NEVER use full-file overwrite (`write_file`) on existing codebase files.**
- `write_file` is strictly reserved for creating brand-new files from scratch.
- Overwriting existing files causes line-ending normalization discrepancies (`CRLF` vs `LF`) and triggers unnecessary mass churn in version control.

## 2. Mandatory Use of Surgical Edits (`edit_file`)
- **ALWAYS use targeted replacement (`edit_file`)** for any code additions, modifications, or deletions in existing files.
- The `Target` must be kept as small and contiguous as possible (ideally 1–3 anchor lines).
- When inserting new code (struct fields, functions, import lines, variables):
  - Anchor to an existing line and append/prepend the new lines.
  - Do NOT reformat, reorder, or touch untouched neighboring lines.
  - In Go structs, be mindful of `gofmt` column alignments to prevent pushing whitespace shifts onto unmodified lines.

## 3. Zero Git Diff Churn (No Redundant Delete-Add Loops)
- Code reviews must remain crystal clear: additions must only appear as additions (`+`), without marking identical or unchanged lines as deleted (`-`).
- Any diff that deletes and re-adds unchanged lines just for indentation or whitespace churn is considered an anti-pattern.

## 4. User Permission Precedence
- Under all circumstances, obtain explicit user confirmation before writing, modifying, or deleting any code.

