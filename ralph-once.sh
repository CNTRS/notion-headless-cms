#!/bin/bash
# ralph-once.sh — run a single Ralph iteration on an OpenSpec change
#
# Usage: bash ralph-once.sh <change-name> [model]
#   change-name  required, e.g. add-users-filter-pagination
#   model        default: opencode-go/qwen3.7-max
#
# Use this to learn the harness and to tune LOOP.md before letting
# the full loop run unattended.

set -euo pipefail

CHANGE="${1:?'Usage: bash ralph-once.sh <change-name> [model]'}"
MODEL="${2:-opencode-go/qwen3.7-max}"

export CHANGE

echo "[ralph-once] change=$CHANGE model=$MODEL"

opencode run \
  --agent spec-apply \
  --model "$MODEL" \
  "$(cat LOOP.md)"
