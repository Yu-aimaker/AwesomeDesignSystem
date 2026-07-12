export type ComponentMetadata = {
  name: string;
  ruleIds: string[];
  states: string[];
};

export function defineMetadata(meta: ComponentMetadata): ComponentMetadata {
  return meta;
}
