#!/usr/bin/env bash
# Idempotent local author and committer. Does not change global git config.
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
git -C "$root" config --local user.name "Yu-aimaker"
git -C "$root" config --local user.email "200000358+Yu-aimaker@users.noreply.github.com"
git -C "$root" config --local --get user.name >/dev/null
git -C "$root" config --local --get user.email >/dev/null
echo "setup-git-identity: local user.name and user.email set"
