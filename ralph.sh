#!/bin/bash
# ralph.sh — Ralph loop on top of an OpenSpec change
#
# Usage: bash ralph.sh <change-name> [max-iters] [model]
#   change-name  required, e.g. add-users-filter-pagination
#   max-iters    default: 20
#   model        default: opencode-go/qwen3.7-max

set -euo pipefail

CHANGE="${1:?'Usage: bash ralph.sh <change-name> [max-iters] [model]'}"
MAX_ITERS="${2:-20}"
COMPLETION="<promise>DONE</promise>"

export CHANGE

echo "[ralph] change=$CHANGE max-iters=$MAX_ITERS"

for iter in $(seq 1 "$MAX_ITERS"); do
  echo "[ralph] iter $iter/$MAX_ITERS"

  OUTPUT=$(opencode run \
    --agent spec-apply \
    "$(cat LOOP.md)" 2>&1)
  echo "$OUTPUT"

  if echo "$OUTPUT" | grep -qE "^[[:space:]]*${COMPLETION}[[:space:]]*$"; then
    echo "[ralph] DONE detected, exit at iter $iter"
    exit 0
  fi
done

echo "[ralph] max iterations reached without DONE sigil"
exit 1
