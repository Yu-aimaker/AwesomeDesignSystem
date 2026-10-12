#!/usr/bin/env node
// Point bot/<name> at a main ref. Refuses any other destination.
import { recreateBotBranch } from "./lib/bot-branch.mjs";

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i === -1 ? fallback : process.argv[i + 1];
}

recreateBotBranch({
  cwd: process.cwd(),
  branch: arg("--branch", ""),
  mainRef: arg("--from", "origin/main"),
});
