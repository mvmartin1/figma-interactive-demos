---
name: ship-flow
description: Ship the current flow. Commits any pending changes, pushes the feature branch to GitHub, and opens a pull request via `gh`. Use when the designer says "I'm done", "ship it", "push it up", "create a PR", "let's review this", or similar session-end phrasing. Runs on any branch other than main.
---

# /ship-flow — push changes and open a PR

Goal: get the designer's flow onto GitHub as a reviewable pull request with as little git ceremony as possible. Designers shouldn't need to understand commit/push/PR semantics — they just want to share the work.

## Steps

### 1. Verify state

- Current branch: `git rev-parse --abbrev-ref HEAD`.
  - If `main`, **stop**: tell the designer to run `/new-flow` first. Nothing ships directly from main.
- Remote: `git remote get-url origin`.
  - If missing, stop and tell them how to add it:
    ```
    gh repo create <name> --source=. --private --push
    ```
    or manually: `git remote add origin git@github.com:<user>/<repo>.git`.
- `gh` CLI: `command -v gh`.
  - If missing: point them to https://cli.github.com and stop.
  - If present but not authenticated: `gh auth status`. If not logged in, ask them to run `gh auth login`.

### 2. Commit pending work

- `git status --short`. If clean, skip to step 3.
- Otherwise:
  - Run `git diff --stat` to see the scope.
  - Run `git diff` (consider piping to a limited file range) to understand what changed.
  - **Sanity-check the diff scope.** If files outside `src/flows/<current-slug>/` are touched (e.g. `package.json`, `vite.config.ts`, `src/design/*`, another flow), flag it and ask before committing. Unintended cross-flow edits would trip the ESLint isolation rule and should be split.
  - Propose a concise commit message:
    - If this is the first non-scaffold commit on the branch: `"Build <slug> flow"` or similar.
    - For iteration commits: summarise the main change (e.g. `"Tweak <slug> error scenario"`).
  - Show the message and let the designer approve or edit it.
  - `git add -A` then `git commit -m "<message>"`.
  - If a commit hook fails: **do not** use `--no-verify`. Fix the underlying issue, re-stage, commit again.

### 3. Push the branch

- First push: `git push -u origin <branch>`.
- Subsequent pushes: `git push`.
- **If rejected** (remote ahead):
  - Do **not** force. Run `git fetch origin` and show the designer what's ahead.
  - Offer: (a) rebase onto the remote branch, or (b) ask a human. Default to (b) unless the designer clearly understands rebase.

### 4. Open or update the PR

- Check for an existing PR on this branch: `gh pr view --json url,state 2>/dev/null`.
  - If it exists: just report `"PR already open: <url>"`. The push you just did updated it.
- If no PR yet, gather PR body content:
  - Read `src/flows/<slug>/meta.ts` for the flow's `name` + `description`.
  - Read `src/flows/<slug>/scenarios.ts` to list the scenario keys + labels.
- Create the PR:
  ```
  gh pr create --base main --title "Add <slug> flow" --body "$(cat <<'EOF'
  ## Summary
  - <one-line summary from meta.description>

  ## Scenarios
  - `default` — <label>
  - `<key>` — <label>
  …

  ## Try it
  Run `npm run dev` and visit `/flows/<slug>`.
  EOF
  )"
  ```
- Title template: `"Add <slug> flow"` for first PR. If the branch has been around and this is an iteration, use something like `"Iterate on <slug>"` — base it on the commit message of the first commit on the branch (`git log main..HEAD --format=%s | tail -1`).

### 5. Report back

- Print the PR URL on its own line so it's easy to click.
- Summary: `"Pushed `<branch>` · opened PR: <url>"`.
- Ask: *"Anything else, or are you done for the day?"*

## Guardrails

- **Never** `git push --force` or `--force-with-lease` unless the designer explicitly asks and confirms they understand.
- **Never** skip commit hooks (`--no-verify`, `--no-gpg-sign`). If a hook fails, investigate the root cause.
- **Never** commit files that likely contain secrets: `.env*`, `*.pem`, `id_rsa`, files in `credentials/`, etc. Warn even if the designer specifically stages them.
- **Never** stage + commit files outside the current flow's folder + a small, expected set of support files (README.md, AUTHORING.md, tokens, shared primitives) without explicitly calling it out first. A diff in `src/flows/some-other-flow/` is always a mistake.
- Do **not** push to `main` — only feature branches. If the current branch is somehow `main`, stop immediately.
