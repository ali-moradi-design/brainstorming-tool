export const TEMPLATE_KEYS = [
  'blank',
  'swot',
  'sixHats',
  'prosCons',
  'fiveW1H',
  'projectPlan',
] as const;
export type TemplateKey = (typeof TEMPLATE_KEYS)[number];

/** Template content (translated) comes from the locale files under `templates.<key>`. */
export type TemplateBranch = { label: string; items?: string[] };
