export function isRefId(id: string): boolean {
  return /^ref\.[a-z0-9-]+\.[a-z0-9-]+$/.test(id);
}

export function isRuleId(id: string): boolean {
  return /^rule\.[a-z0-9-]+\.[a-z0-9-]+$/.test(id);
}

export function isArtifactId(id: string): boolean {
  return /^artifact\.[a-z0-9-]+\.[a-z0-9-]+$/.test(id);
}

export function isSignalId(id: string): boolean {
  return /^signal\.[a-z0-9-]+\.[a-z0-9-]+$/.test(id);
}
