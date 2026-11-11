#!/usr/bin/env node
// Compatibility entry. Refuses to reset the bot branch and prepares a fast-forward instead.
import { prepareBotBranch } from "./lib/bot-branch.mjs";

function arg(name, fallback) {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
}

const result = prepareBotBranch({
  cwd: process.cwd(),
  branch: arg("--branch", ""),
  mainRef: arg("--from", "origin/main"),
  remoteRef: arg("--remote", ""),
  actor: process.env.GROWTH_ACTOR || "",
  state: process.env.GROWTH_STATE || "",
});
console.log(`reset-bot-branch: ${result.action} ${result.reason}`);
