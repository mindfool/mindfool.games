#!/bin/bash
# verify-build-before-push.sh
# Claude Code PreToolUse hook: Intercepts git push and runs TypeScript check first.
# If TypeScript errors exist, blocks the push and returns errors for Claude to fix.
#
# Install: Add to ~/.claude/settings.json under hooks.PreToolUse
# Works for any TypeScript project (auto-detects via tsconfig.json)

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Only intercept git push commands
if ! echo "$COMMAND" | grep -qE 'git\s+push'; then
  exit 0
fi

# Determine project root (use cwd from hook input)
CWD=$(echo "$INPUT" | jq -r '.cwd // empty')
if [ -z "$CWD" ]; then
  CWD="$(pwd)"
fi

# Check if this is a TypeScript project
if [ ! -f "$CWD/tsconfig.json" ]; then
  exit 0
fi

echo "Pre-push check: Running TypeScript validation..." >&2

# Run tsc --noEmit (fast type check, ~10-20s)
TSC_OUTPUT=$(cd "$CWD" && npx tsc --noEmit 2>&1)
TSC_EXIT=$?

if [ $TSC_EXIT -ne 0 ]; then
  # TypeScript errors found — block the push
  ERROR_COUNT=$(echo "$TSC_OUTPUT" | grep -c "error TS")
  ERRORS=$(echo "$TSC_OUTPUT" | grep "error TS" | head -20)

  echo "TypeScript check failed ($ERROR_COUNT errors). Fix these before pushing:" >&2
  echo "$ERRORS" >&2

  # Return structured denial so Claude knows what to fix
  cat <<DENIAL
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "TypeScript check failed with $ERROR_COUNT error(s). Fix these before pushing:\n$ERRORS"
  }
}
DENIAL
  exit 0
fi

echo "Pre-push check: TypeScript OK" >&2
exit 0
