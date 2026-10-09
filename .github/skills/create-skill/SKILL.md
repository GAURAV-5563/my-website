---
name: create-skill
description: "Use when: creating a reusable SKILL.md from a workflow, review checklist, debugging method, or project process. Helps extract decision points, write clear frontmatter, place the file in the correct scope, and validate the result before finalizing."
---

# Create a Reusable Skill

## Goal

Turn a repeated workflow, method, or decision process into a reusable skill that can be invoked later with a focused prompt.

## Scope

Choose where the skill should live:

- Workspace-scoped: use .github/skills/<name>/SKILL.md for project-specific workflows
- User-scoped: save under the user's prompt folder for personal, cross-workspace workflows

## Workflow

### 1. Extract the workflow

Review the current conversation or problem-solving sequence and capture:

- The step-by-step process being followed
- Decision points and branching logic
- Quality criteria or completion checks
- Any inputs, outputs, or constraints

### 2. Clarify if needed

If the workflow is not yet clear, ask:

- What result should this skill produce?
- Is it for a single project or for general personal use?
- Is a short checklist enough, or is a full multi-step workflow needed?

### 3. Draft the skill

Create the file in the correct location and include:

- YAML frontmatter with a clear `name` and `description`
- A simple goal or purpose section
- A decision flow or process section
- Validation steps or completion criteria
- Good example prompts for reuse

### 4. Validate the result

Before finalizing, confirm:

- The file is in the correct folder and scope
- The frontmatter is valid YAML
- The description includes trigger keywords so the skill is discoverable
- The workflow is concise, actionable, and reusable
- The content matches the actual method being captured

### 5. Refine and finalize

Identify the weakest or most ambiguous part of the draft and improve it. Then summarize:

- What the skill produces
- When to use it
- Example prompts that work well
- Related customizations to create next

## Completion checklist

A strong skill is ready when it includes all of the following:

- Clear purpose and use case
- Defined step-by-step workflow
- Branching logic or decision points
- Validation or completion checks
- Correct location and naming
- Useful example prompts

## Example prompts

- Create a skill for debugging C programs in this workspace.
- Turn this code review checklist into a reusable skill.
- Create a personal skill for planning a feature from requirements to verification.
- Draft a workspace skill for handling bug reproduction and fixes.

## Good patterns

- Prefer specific trigger phrases in the `description`
- Keep the skill focused on a single workflow
- Separate decisions from execution steps
- Make the completion criteria easy to verify
- Prefer reusable, practical instructions over vague guidance
