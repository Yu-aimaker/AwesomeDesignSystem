// Reset the bot branch to a main ref. The weekly workflow calls this so a
// later main commit is the parent of the next data commit, not a merge.
import { execFileSync } from "node:child_process";

export function recreateBotBranch({ cwd, branch, mainRef }) {
  if (!branch || !branch.startsWith("bot/")) {
    throw new Error(`refusing to publish ${branch}`);
  }
  execFileSync("git", ["checkout", "-f", "-B", branch, mainRef], { cwd, stdio: "pipe" });
  const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd, encoding: "utf8" }).trim();
  const main = execFileSync("git", ["rev-parse", mainRef], { cwd, encoding: "utf8" }).trim();
  if (head !== main) throw new Error(`refusing to publish ${branch} from ${head}`);
  return { branch, head };
}
