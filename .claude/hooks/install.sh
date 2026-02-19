#!/bin/bash
# install.sh — Install deployment verification hooks for Claude Code
#
# Usage: bash .claude/hooks/install.sh
#
# This installs two global hooks:
# 1. Pre-push: Blocks git push if TypeScript errors exist
# 2. Post-push: Monitors Vercel deployment and reports failures
#
# Prerequisites: jq, npx, vercel CLI (npm i -g vercel)

set -e

HOOKS_DIR="$HOME/.claude/hooks"
SETTINGS_FILE="$HOME/.claude/settings.json"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Installing Claude Code deployment hooks..."

# Create hooks directory
mkdir -p "$HOOKS_DIR"

# Copy hook scripts
cp "$SCRIPT_DIR/verify-build-before-push.sh" "$HOOKS_DIR/"
cp "$SCRIPT_DIR/verify-deployment-after-push.sh" "$HOOKS_DIR/"
chmod +x "$HOOKS_DIR/verify-build-before-push.sh"
chmod +x "$HOOKS_DIR/verify-deployment-after-push.sh"

echo "Copied hook scripts to $HOOKS_DIR/"

# Check if settings.json exists
if [ ! -f "$SETTINGS_FILE" ]; then
  echo "Creating $SETTINGS_FILE..."
  echo '{}' > "$SETTINGS_FILE"
fi

# Check if hooks are already configured
if grep -q "verify-build-before-push" "$SETTINGS_FILE" 2>/dev/null; then
  echo "Hooks already configured in $SETTINGS_FILE"
else
  echo ""
  echo "Add the following to your ~/.claude/settings.json under \"hooks\":"
  echo ""
  cat <<'CONFIG'
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/verify-build-before-push.sh",
            "timeout": 120
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/verify-deployment-after-push.sh",
            "timeout": 600
          }
        ]
      }
    ]
CONFIG
  echo ""
  echo "Or run: claude /hooks  (in Claude Code) to add them via the interactive menu."
fi

echo ""
echo "Done! The hooks will:"
echo "  - Block git push if TypeScript errors exist (any project with tsconfig.json)"
echo "  - Monitor Vercel deployments after push (any project with .vercel/ directory)"
echo "  - Return errors to Claude for automatic fixing"
