#!/bin/bash
# ralph-once.sh — run a single Ralph iteration on an OpenSpec change
#
# Usage: bash ralph-once.sh <change-name> [model]
#   change-name  required, e.g. add-users-filter-pagination
#   model        default: opencode/deepseek-v4-flash-free
#
# Use this to learn the harness and to tune LOOP.md before letting
# the full loop run unattended.

set -euo pipefail

CHANGE="${1:?'Usage: bash ralph-once.sh <change-name> [model]'}"
MODEL="${2:-opencode/deepseek-v4-flash-free}"

export CHANGE

echo "[ralph-once] change=$CHANGE model=$MODEL"

# TODO: Replace agent with spec-apply once adapted
opencode run \
  --agent build \
  --model "$MODEL" \
  "$(cat LOOP.md)"
