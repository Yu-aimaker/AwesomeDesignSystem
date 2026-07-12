import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import {
  ArtifactClaimSchema,
  CanonRuleSchema,
  ReferenceRecordSchema,
  SignalRecordSchema,
  type ArtifactClaim,
  type CanonRule,
  type ReferenceRecord,
  type SignalRecord,
} from "./schema";

async function readJsonFiles<T>(
  dir: string,
  parse: (raw: unknown, file: string) => T,
): Promise<T[]> {
  let entries: string[] = [];
  try {
    entries = await readdir(dir);
  } catch {
    return [];
  }

  const parsed = await Promise.all(entries.filter((entry) => entry.endsWith(".json")).map(async (entry) => {
    const file = path.join(dir, entry);
    const raw = JSON.parse(await readFile(file, "utf8")) as unknown;
    if (Array.isArray(raw)) {
      return raw.map((item) => parse(item, file));
    }
    return [parse(raw, file)];
  }));
  return parsed.flat();
}

export async function loadReferenceRecords(
  contentRoot: string,
): Promise<ReferenceRecord[]> {
  return readJsonFiles(
    path.join(contentRoot, "references"),
    (raw, file) => {
      const result = ReferenceRecordSchema.safeParse(raw);
      if (!result.success) {
        throw new Error(
          `${file}: invalid reference — ${result.error.issues.map((i) => i.message).join("; ")}`,
        );
      }
      return result.data;
    },
  );
}

export async function loadCanonRules(
  contentRoot: string,
): Promise<CanonRule[]> {
  return readJsonFiles(path.join(contentRoot, "canon"), (raw, file) => {
    const result = CanonRuleSchema.safeParse(raw);
    if (!result.success) {
      throw new Error(
        `${file}: invalid canon rule — ${result.error.issues.map((i) => i.message).join("; ")}`,
      );
    }
    return result.data;
  });
}

export async function loadArtifactClaims(
  contentRoot: string,
): Promise<ArtifactClaim[]> {
  return readJsonFiles(path.join(contentRoot, "artifacts"), (raw, file) => {
    const result = ArtifactClaimSchema.safeParse(raw);
    if (!result.success) {
      throw new Error(
        `${file}: invalid artifact — ${result.error.issues.map((i) => i.message).join("; ")}`,
      );
    }
    return result.data;
  });
}

export async function loadSignals(
  contentRoot: string,
): Promise<SignalRecord[]> {
  return readJsonFiles(path.join(contentRoot, "signals"), (raw, file) => {
    const result = SignalRecordSchema.safeParse(raw);
    if (!result.success) {
      throw new Error(
        `${file}: invalid signal — ${result.error.issues.map((i) => i.message).join("; ")}`,
      );
    }
    return result.data;
  });
}
