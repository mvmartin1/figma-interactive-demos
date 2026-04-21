---
name: new-flow
description: Start a new flow or scenario session. Creates a feature branch (flow/<slug>) off an up-to-date main and optionally scaffolds a new flow folder from src/flows/example-checkout. Use when the designer says "I want to build a new flow", "let's start a new demo", "new flow for X", or similar session-start phrasing.
---

# /new-flow — start a new flow session

Goal: get the designer onto a clean feature branch so their work stays isolated and easy to ship later. Designers won't usually care about git — your job is to make the ceremony invisible and safe.

## Steps

### 1. Sanity-check git state

- Run `git status --short`.
  - **Uncommitted changes**: ask the designer which they'd prefer:
    1. **Stash** for later (`git stash push -m "pre-new-flow stash"`) — recommended if the changes are unrelated.
    2. **Commit** to the current branch first (useful if they were mid-work on a previous flow).
    3. **Abort** the skill.
    Do not proceed with changes in the working tree.
- Run `git rev-parse --abbrev-ref HEAD`.
  - If **already on a `flow/*` branch**: ask "You're on `<branch>`. Start a fresh branch from main, or keep working here?" If they keep the branch, jump to the scaffold step (5).

### 2. Sync main

- `git fetch origin main`
- `git checkout main`
- `git pull --ff-only origin main`
- If the fast-forward fails (local commits on main, non-linear history): **stop and report**. Do not force-pull, rebase, or reset main without asking. Something unexpected happened and the designer should pull in a human.

### 3. Get the flow slug

- If the user's prompt already hints at a name ("new flow for account recovery"), slugify it: lowercase, kebab-case, only `a-z0-9-`.
- Otherwise ask: *"What are you building? Give me a short slug — kebab-case, e.g. `account-recovery` or `onboarding-v2`."*
- Validate before using it:
  - Must match `^[a-z][a-z0-9-]*$`.
  - Must not already exist as a folder under `src/flows/`.
  - Reserved words to reject: `example`, `test`, `lib`, `ui`, `components`.

### 4. Create the branch

- `git checkout -b flow/<slug>`
- Confirm to the designer: *"You're on branch `flow/<slug>`."*

### 5. Offer a scaffold

Ask: *"Want me to copy the example flow as a starting point? (recommended unless you already know the contract in `AUTHORING.md`)"*

**If yes:**

- `cp -r src/flows/example-checkout src/flows/<slug>`
- Open `src/flows/<slug>/meta.ts` and replace the `name` + `description`:
  - `name`: a human title derived from the slug (e.g. `account-recovery` → `Account recovery`).
  - `description`: `"TODO: describe this demo."`
- Leave the seed scenarios in place for now — the designer will rewrite them.
- Stage and commit so their next changes show a clean diff:
  - `git add src/flows/<slug>`
  - `git commit -m "Scaffold <slug> flow from example-checkout"`

**If no:** leave the branch empty.

### 6. Wrap up

Tell the designer, concisely:

- Which branch they're on (`flow/<slug>`)
- Where to edit (`src/flows/<slug>/`)
- Pointer: `AUTHORING.md` has the flow contract.
- Next step: run `/ship-flow` when ready to open a PR.

## Guardrails

- **Never** force-push, `git reset --hard`, `git clean -fd`, or anything else that can lose uncommitted work without the designer explicitly confirming.
- **Never** operate on `main` beyond a fast-forward pull — if `main` has local commits ahead of `origin/main`, stop and ask.
- **Never** create a branch whose name would shadow an existing remote branch without warning. If `git ls-remote origin flow/<slug>` returns a hit, ask before proceeding.
- If `gh` CLI or `origin` aren't set up, this skill still works (branch creation is local). Only `/ship-flow` needs them.
