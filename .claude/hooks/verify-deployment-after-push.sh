#!/bin/bash
# verify-deployment-after-push.sh
# Claude Code PostToolUse hook: After git push, monitors Vercel deployment.
# If deployment fails, returns build errors so Claude can fix and retry.
#
# Install: Add to ~/.claude/settings.json under hooks.PostToolUse
# Works for any Vercel project (auto-detects via .vercel/ directory)

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Only process git push commands
if ! echo "$COMMAND" | grep -qE 'git\s+push'; then
  exit 0
fi

# Check if the push actually succeeded
TOOL_OUTPUT=$(echo "$INPUT" | jq -r '.tool_output // empty')
if echo "$TOOL_OUTPUT" | grep -qiE 'error|rejected|failed|fatal'; then
  exit 0
fi

# Determine project root
CWD=$(echo "$INPUT" | jq -r '.cwd // empty')
if [ -z "$CWD" ]; then
  CWD="$(pwd)"
fi

# Check if this is a Vercel project
if [ ! -d "$CWD/.vercel" ]; then
  exit 0
fi

echo "Deployment monitor: Push detected. Waiting for Vercel deployment..." >&2

# Wait for Vercel to register the deployment
sleep 8

# Get the latest deployment URL
DEPLOY_INFO=$(cd "$CWD" && npx vercel ls 2>/dev/null | head -8)
DEPLOY_URL=$(echo "$DEPLOY_INFO" | grep -oE 'https://[^ ]+\.vercel\.app' | head -1)

if [ -z "$DEPLOY_URL" ]; then
  echo "Deployment monitor: Could not find deployment URL. Check Vercel dashboard." >&2
  exit 0
fi

echo "Deployment monitor: Found deployment $DEPLOY_URL" >&2
echo "Deployment monitor: Waiting for build to complete (up to 8 minutes)..." >&2

# Wait for deployment to complete
INSPECT_OUTPUT=$(cd "$CWD" && npx vercel inspect "$DEPLOY_URL" --wait --timeout=8m 2>&1)

# Check if deployment succeeded
if echo "$INSPECT_OUTPUT" | grep -q "status.*Ready"; then
  echo "Deployment monitor: Deployment succeeded!" >&2

  # Health check on the production alias (not the deployment-specific URL which may have SSO)
  PROD_ALIAS=$(echo "$INSPECT_OUTPUT" | grep -oE 'https://[a-zA-Z0-9-]+\.vercel\.app' | grep -v 'smaluhn' | head -1)
  if [ -z "$PROD_ALIAS" ]; then
    PROD_ALIAS="$DEPLOY_URL"
  fi
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_ALIAS" 2>/dev/null)
  echo "Deployment monitor: Health check $PROD_ALIAS -> HTTP $HTTP_STATUS" >&2

  cat <<SUCCESS
{
  "additionalContext": "Vercel deployment succeeded. URL: $DEPLOY_URL"
}
SUCCESS
  exit 0
fi

# Deployment failed — get build logs
echo "Deployment monitor: Deployment may have failed. Fetching build logs..." >&2

BUILD_LOGS=$(cd "$CWD" && npx vercel inspect "$DEPLOY_URL" --logs 2>&1 | tail -80)

# Extract the actual error
ERROR_LINES=$(echo "$BUILD_LOGS" | grep -A5 -iE 'error:|Error:|SIGKILL|exit code|failed' | head -30)

if [ -z "$ERROR_LINES" ]; then
  ERROR_LINES=$(echo "$BUILD_LOGS" | tail -20)
fi

echo "Deployment monitor: DEPLOYMENT FAILED. Errors:" >&2
echo "$ERROR_LINES" >&2

cat <<FAILURE
{
  "additionalContext": "VERCEL DEPLOYMENT FAILED for $DEPLOY_URL. Build errors:\n$(echo "$ERROR_LINES" | sed 's/"/\\"/g' | tr '\n' '\\' | sed 's/\\/\\n/g')\n\nYou MUST fix these errors, commit, and push again until deployment succeeds."
}
FAILURE
exit 0
