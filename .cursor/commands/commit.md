# Commit All Changes

You are helping the user commit all changes in their working directory using conventional commit format with emoji. Your goal is to intelligently split changes into multiple atomic commits when appropriate.

## Workflow

1. **Pre-commit checks** (unless user includes `--no-verify` parameter):
   - Check for and run common pre-commit commands if they exist:
     - `npm run lint` or `pnpm lint` or `yarn lint`
     - `npm run build` or `pnpm build` or `yarn build`
     - `npm run test` or `pnpm test` or `yarn test` (if user wants)
     - Any other commands specified by user
   - If any check fails, ask user if they want to proceed anyway or fix issues first

2. **Stage all changes**:
   - Execute `git add -A` to stage everything

3. **Analyze changes**:
   - Run `git diff --staged` to see all changes
   - Carefully analyze the diff to identify distinct logical changes
   - Group related changes based on:
     - File paths and directories
     - Type of change (feat, fix, refactor, docs, test, chore, etc.)
     - Logical cohesion and purpose
     - Whether changes are independent or related

4. **Smart commit splitting**:
   - If changes represent multiple distinct features/fixes, split them into separate commits
   - Common split patterns:
     - Source code changes vs tests vs documentation
     - Different features or bug fixes
     - Business logic vs types vs configuration
     - Frontend vs backend changes
     - Core functionality vs tooling/dependencies
   
5. **Execute commits**:
   - For each group of related changes:
     - Run `git reset` to unstage everything
     - Run `git add <specific-files>` to stage only files for this commit
     - Generate an appropriate conventional commit message with emoji
     - Run `git commit -m "<message>"`
     - Continue to next group
   
6. **Report summary**:
   - Show user all commits that were created
   - Include commit messages and files in each commit
   - Confirm which branch they were committed to

## Conventional Commit Format

Use this format: `<emoji> <type>: <description>`

### Commit Types & Emojis

- ✨ `feat` - New feature
- 🐛 `fix` - Bug fix  
- 📝 `docs` - Documentation only
- 💄 `style` - Code style/formatting (not CSS)
- ♻️ `refactor` - Code refactoring
- ⚡️ `perf` - Performance improvement
- ✅ `test` - Adding/fixing tests
- 🔧 `chore` - Build process, tooling, config
- 🚀 `ci` - CI/CD changes
- 🏷️ `feat` - Type definitions
- 🔥 `fix` - Remove code or files
- 🚨 `fix` - Fix linter warnings
- 🔒️ `fix` - Security fixes
- 💚 `fix` - Fix CI build
- 🎨 `style` - Improve code structure/format
- 🚑️ `fix` - Critical hotfix
- 👔 `feat` - Business logic
- 🦺 `feat` - Validation code
- 🧵 `feat` - Concurrency/multithreading
- 📱 `feat` - Responsive design
- 🚸 `feat` - UX improvements
- 🩹 `fix` - Non-critical simple fix
- 🥅 `fix` - Error catching
- 👽️ `fix` - External API changes
- ➕ `chore` - Add dependency
- ➖ `chore` - Remove dependency
- 🧑‍💻 `chore` - Developer experience
- 📦️ `chore` - Update packages
- 🙈 `chore` - Update .gitignore
- 💥 `feat` - Breaking changes
- ♿️ `feat` - Accessibility improvements
- 💡 `docs` - Add/update code comments
- 🗃️ `db` - Database changes
- 📈 `feat` - Analytics/tracking
- ⏪️ `revert` - Revert changes
- 🚧 `wip` - Work in progress

### Message Guidelines

- Use present tense, imperative mood: "add feature" not "added feature"
- Be concise: keep first line under 72 characters
- Be specific: describe what changed and why when relevant
- Don't end with a period

## Example Outputs

### Single Commit (when changes are cohesive):
```
✓ All checks passed
✓ Staged all changes
✓ Analyzed diff - changes are cohesive

Creating commit...
✓ Committed: ✨ feat: add user authentication system

Successfully created 1 commit on branch 'feature/auth'
```

### Multiple Commits (when splitting is appropriate):
```
✓ All checks passed
✓ Staged all changes
✓ Analyzed diff - identified 3 distinct changes

Group 1: Feature - Payment processing
  - src/payment/processor.ts
  - src/payment/stripe.ts
  - src/types/payment.ts

Group 2: Tests for payment processing
  - tests/payment/processor.test.ts
  - tests/payment/fixtures.ts

Group 3: Documentation updates
  - README.md
  - docs/payment-api.md

Creating commits...
✓ Commit 1: ✨ feat: add payment processing with Stripe integration
✓ Commit 2: ✅ test: add comprehensive payment processor tests
✓ Commit 3: 📝 docs: document payment processing API

Successfully created 3 commits on branch 'feature/payments'
```

## Important Notes

- Always explain your grouping logic before committing
- Show the user what will be committed before executing
- If you're unsure whether to split, explain the trade-offs and ask
- Each commit should be independently deployable and revertable
- Related changes (e.g., a function and its test) can stay together if they're part of the same logical change
- Don't over-split - if changes are part of implementing a single feature, keep them together
- Do split when changes address different concerns, even if worked on simultaneously

## Special Cases

- **Only one type of change**: Commit as single commit with appropriate type
- **Mixed feature + bug fix**: Always split these
- **Tests for new feature**: Keep together unless tests are substantial
- **Documentation for new feature**: Can keep together for small docs, split for major docs
- **Dependency updates**: Always separate from feature/fix commits
- **Breaking changes**: Clearly mark with 💥 emoji and explain in message

## Error Handling

- If pre-commit checks fail, clearly show which failed and ask how to proceed
- If git commands fail, show the error and suggest fixes
- If unsure about grouping, explain uncertainty and suggest alternatives
- If nothing is changed, inform user clearly

Execute this workflow when the user runs `/commit-all` with any optional parameters they provide.