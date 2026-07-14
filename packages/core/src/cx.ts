type ClassValue =
  | string
  | false
  | null
  | undefined
  | Record<string, boolean | undefined | null>
  | ClassValue[];

export function cx(...values: ClassValue[]): string {
  const out: string[] = [];

  const walk = (value: ClassValue): void => {
    if (!value) return;
    if (typeof value === "string") {
      if (value.trim()) out.push(value);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) out.push(key);
    }
  };

  values.forEach(walk);
  return out.join(" ");
}
