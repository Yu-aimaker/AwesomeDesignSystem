#!/usr/bin/env node
// Drop weekly scratch edits under the DS, the site, and plugin skills.
// Knowledge, Reference, and the plugin Knowledge mirror are left in place.
import { execFileSync } from "node:child_process";

const PATHS = ["AwesomeDS", "web", "Plugin/awesome-ds/ds", "Plugin/awesome-ds/skills"];

function git(args) {
  execFileSync("git", args, { stdio: "pipe" });
}

for (const path of PATHS) {
  git(["checkout", "--", path]);
  git(["clean", "-fd", "--", path]);
}
console.log("restore-unpublished: DS, site, and plugin skills restored");
