<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:workflow-rules -->
# Atomic Commit Workflow

For this project, always follow an atomic commit workflow. Every time a change is made to a single file:
1. Immediately run `git add` for that file.
2. Run `git commit` with a specific, descriptive message about what was just changed in that exact file.
3. Run `git push`.
4. Wait for the push to succeed before moving on to edit the next file.
Do not edit multiple files at once without committing and pushing the previous file first.
<!-- END:workflow-rules -->
