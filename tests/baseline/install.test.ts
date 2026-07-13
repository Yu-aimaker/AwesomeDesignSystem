import { access, lstat, mkdtemp, readFile, readlink } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { describe, expect, test } from "vitest";

describe("compatibility baseline — installer contract", () => {
  const run = promisify(execFile);
  const skillNames = ["awesome-ds", "make-awesome-ds", "awesome-html", "awesome-review", "awesome-motion"];
  test("install.sh is executable shell and targets skills directory", async () => {
    const installPath = path.join(process.cwd(), "install.sh");
    await access(installPath);
    const script = await readFile(installPath, "utf8");

    expect(script.startsWith("#!")).toBe(true);
    expect(script).toMatch(/skills/);
    expect(script).toMatch(/awesome-ds|Awesome/);
  });

  test("skill packages remain outside monorepo package graph", async () => {
    const workspace = await readFile(
      path.join(process.cwd(), "pnpm-workspace.yaml"),
      "utf8",
    );
    expect(workspace).not.toMatch(/skills\/\*/);
  });

  test("installs readable copies into an isolated skill directory", async () => {
    const home = await mkdtemp(path.join(tmpdir(), "awesome-ds-copy-"));
    const target = path.join(home, "skills");
    await run("bash", [path.join(process.cwd(), "install.sh"), "--copy"], {
      env: { ...process.env, HOME: home, CLAUDE_SKILLS_DIR: target },
    });
    for (const name of skillNames) {
      expect((await lstat(path.join(target, name))).isDirectory()).toBe(true);
      expect(await readFile(path.join(target, name, "SKILL.md"), "utf8")).toContain(`name: ${name}`);

      // SKILL.md routes through these repository-relative paths. Copy mode must
      // install the knowledge they point at, not just leave readable entrypoints.
      const skillRoot = path.join(target, name);
      expect(await readFile(path.resolve(skillRoot, "../../DESIGN.md"), "utf8")).toContain("AwesomeDS");
      expect(await readFile(path.resolve(skillRoot, "../../design-system/INDEX.md"), "utf8")).toContain("Design System");
      expect(await readFile(path.resolve(skillRoot, "../../skills/shared/rule-contract.md"), "utf8")).toContain("rule.");
      expect(await readFile(path.resolve(skillRoot, "../../skills/shared/reference-atlas.md"), "utf8")).toContain("ref.");
    }

    await run("bash", [path.join(process.cwd(), "install.sh"), "--uninstall"], {
      env: { ...process.env, HOME: home, CLAUDE_SKILLS_DIR: target },
    });
    await expect(access(path.join(home, "DESIGN.md"))).rejects.toThrow();
    await expect(access(path.join(home, "design-system"))).rejects.toThrow();
    await expect(access(path.join(target, "shared", "rule-contract.md"))).rejects.toThrow();
  });

  test("installs absolute, readable symlinks and uninstalls them", async () => {
    const home = await mkdtemp(path.join(tmpdir(), "awesome-ds-link-"));
    const target = path.join(home, "skills");
    const install = path.join(process.cwd(), "install.sh");
    await run("bash", [install], { env: { ...process.env, HOME: home, CLAUDE_SKILLS_DIR: target } });
    for (const name of skillNames) {
      const link = path.join(target, name);
      expect((await lstat(link)).isSymbolicLink()).toBe(true);
      expect(path.isAbsolute(await readlink(link))).toBe(true);
      await access(path.join(link, "SKILL.md"));
    }
    await run("bash", [install, "--uninstall"], { env: { ...process.env, HOME: home, CLAUDE_SKILLS_DIR: target } });
    for (const name of skillNames) await expect(access(path.join(target, name))).rejects.toThrow();
  });
});
