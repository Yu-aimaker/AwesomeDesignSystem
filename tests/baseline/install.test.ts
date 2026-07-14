import { access, lstat, mkdir, mkdtemp, readFile, readlink, rm, symlink, writeFile } from "node:fs/promises";
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
  }, 30_000);

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
  }, 30_000);

  test("preserves and warns about user-modified copy installs during uninstall", async () => {
    const home = await mkdtemp(path.join(tmpdir(), "awesome-ds-copy-drift-"));
    const target = path.join(home, "skills");
    const install = path.join(process.cwd(), "install.sh");
    await run("bash", [install, "--copy"], {
      env: { ...process.env, HOME: home, CLAUDE_SKILLS_DIR: target },
    });

    const modifiedSkill = path.join(target, "awesome-ds", "SKILL.md");
    await writeFile(modifiedSkill, "user-owned changes\n", "utf8");
    const result = await run("bash", [install, "--uninstall"], {
      env: { ...process.env, HOME: home, CLAUDE_SKILLS_DIR: target },
    });

    expect(await readFile(modifiedSkill, "utf8")).toBe("user-owned changes\n");
    expect(`${result.stdout}${result.stderr}`).toMatch(/preserv.*awesome-ds.*changed/i);
    await expect(access(path.join(target, "make-awesome-ds"))).rejects.toThrow();
  }, 30_000);

  test("does not delete a skill path replaced after installation", async () => {
    const home = await mkdtemp(path.join(tmpdir(), "awesome-ds-replaced-"));
    const target = path.join(home, "skills");
    const install = path.join(process.cwd(), "install.sh");
    await run("bash", [install], {
      env: { ...process.env, HOME: home, CLAUDE_SKILLS_DIR: target },
    });

    const replaced = path.join(target, "awesome-review");
    await rm(replaced);
    await mkdir(replaced);
    await writeFile(path.join(replaced, "KEEP.txt"), "replacement\n", "utf8");
    const result = await run("bash", [install, "--uninstall"], {
      env: { ...process.env, HOME: home, CLAUDE_SKILLS_DIR: target },
    });

    expect(await readFile(path.join(replaced, "KEEP.txt"), "utf8")).toBe("replacement\n");
    expect(`${result.stdout}${result.stderr}`).toMatch(/preserv.*awesome-review.*changed/i);
  }, 30_000);

  test("mode switches remove unchanged copy-bundle entries but preserve drift", async () => {
    const home = await mkdtemp(path.join(tmpdir(), "awesome-ds-mode-switch-"));
    const target = path.join(home, "skills");
    const install = path.join(process.cwd(), "install.sh");
    await run("bash", [install, "--copy"], {
      env: { ...process.env, HOME: home, CLAUDE_SKILLS_DIR: target },
    });
    await writeFile(path.join(home, "DESIGN.md"), "user contract\n", "utf8");

    const result = await run("bash", [install], {
      env: { ...process.env, HOME: home, CLAUDE_SKILLS_DIR: target },
    });

    expect(await readFile(path.join(home, "DESIGN.md"), "utf8")).toBe("user contract\n");
    await expect(access(path.join(home, "design-system"))).rejects.toThrow();
    expect((await lstat(path.join(target, "awesome-ds"))).isSymbolicLink()).toBe(true);
    expect(`${result.stdout}${result.stderr}`).toMatch(/preserv.*DESIGN\.md.*changed/i);
  }, 30_000);

  test("keeps legacy redirects isolated in copy mode and removes only installer-owned redirects", async () => {
    const install = path.join(process.cwd(), "install.sh");

    const copyHome = await mkdtemp(path.join(tmpdir(), "awesome-ds-legacy-copy-"));
    const copyTarget = path.join(copyHome, "skills");
    const legacyCopy = path.join(copyTarget, "awesome-design-skills");
    await mkdir(legacyCopy, { recursive: true });
    await writeFile(path.join(legacyCopy, "SKILL.md"), "legacy\n", "utf8");
    await run("bash", [install, "--copy"], {
      env: { ...process.env, HOME: copyHome, CLAUDE_SKILLS_DIR: copyTarget },
    });
    expect((await lstat(legacyCopy)).isDirectory()).toBe(true);
    expect(await readFile(path.join(legacyCopy, "SKILL.md"), "utf8")).toContain("name: awesome-ds");
    await run("bash", [install, "--uninstall"], {
      env: { ...process.env, HOME: copyHome, CLAUDE_SKILLS_DIR: copyTarget },
    });
    await expect(access(legacyCopy)).rejects.toThrow();

    const linkHome = await mkdtemp(path.join(tmpdir(), "awesome-ds-legacy-link-"));
    const linkTarget = path.join(linkHome, "skills");
    const legacyLink = path.join(linkTarget, "awesome-design-skills");
    await mkdir(legacyLink, { recursive: true });
    await writeFile(path.join(legacyLink, "SKILL.md"), "legacy\n", "utf8");
    await run("bash", [install], {
      env: { ...process.env, HOME: linkHome, CLAUDE_SKILLS_DIR: linkTarget },
    });
    expect((await lstat(legacyLink)).isSymbolicLink()).toBe(true);
    expect(path.isAbsolute(await readlink(legacyLink))).toBe(true);

    await rm(legacyLink);
    await symlink(path.join(linkHome, "some-user-skill"), legacyLink);
    const result = await run("bash", [install, "--uninstall"], {
      env: { ...process.env, HOME: linkHome, CLAUDE_SKILLS_DIR: linkTarget },
    });
    expect(await readlink(legacyLink)).toBe(path.join(linkHome, "some-user-skill"));
    expect(`${result.stdout}${result.stderr}`).toMatch(/preserv.*awesome-design-skills.*changed/i);
  }, 30_000);
});
