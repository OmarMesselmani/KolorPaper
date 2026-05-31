export const COLORS = {
  primary: '#0F0728',
  secondary: '#F97316',
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  text: '#1F2937',
} as const;

export type AppColor = keyof typeof COLORS;
