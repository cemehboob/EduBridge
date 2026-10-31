import { ColorSchemeConfig, ColorSchemePreset, CustomColorPalette } from '../types';

export interface ThemePresetOption {
  id: ColorSchemePreset;
  name: string;
  tagline: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryBorder: string;
  accent: string;
  surfaceTone: 'light' | 'soft' | 'dark' | 'warm';
  badge: string;
}

export const THEME_PRESETS: ThemePresetOption[] = [
  {
    id: 'default-indigo',
    name: 'Oceanic Indigo',
    tagline: 'EduBridge classic deep indigo with teal accents and balanced contrast.',
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    primaryLight: '#eef2ff',
    primaryBorder: '#c7d2fe',
    accent: '#0d9488',
    surfaceTone: 'light',
    badge: 'Default Classic'
  },
  {
    id: 'emerald-growth',
    name: 'Emerald Forest',
    tagline: 'Calming, nature-inspired green that reduces eye strain during long study sessions.',
    primary: '#059669',
    primaryHover: '#047857',
    primaryLight: '#ecfdf5',
    primaryBorder: '#a7f3d0',
    accent: '#0284c7',
    surfaceTone: 'light',
    badge: 'Calm & Focus'
  },
  {
    id: 'royal-violet',
    name: 'Royal Amethyst',
    tagline: 'Regal violet and vivid magenta tailored for creative writing and academic humanities.',
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
    primaryLight: '#f5f3ff',
    primaryBorder: '#ddd6fe',
    accent: '#db2777',
    surfaceTone: 'light',
    badge: 'Creative & Arts'
  },
  {
    id: 'sunset-amber',
    name: 'Sunset Terracotta',
    tagline: 'Warm terracotta and amber hues engineered to minimize sleep-disrupting blue light.',
    primary: '#d97706',
    primaryHover: '#b45309',
    primaryLight: '#fffbeb',
    primaryBorder: '#fde68a',
    accent: '#ea580c',
    surfaceTone: 'warm',
    badge: 'Low Blue Light'
  },
  {
    id: 'rose-blossom',
    name: 'Rose Blossom',
    tagline: 'Energetic raspberry and coral accents to stimulate enthusiasm and active recall.',
    primary: '#e11d48',
    primaryHover: '#be123c',
    primaryLight: '#fff1f2',
    primaryBorder: '#fecdd3',
    accent: '#9333ea',
    surfaceTone: 'light',
    badge: 'High Energy'
  },
  {
    id: 'cyber-cyan',
    name: 'Cyberpunk Cyan',
    tagline: 'Modern electric cyan and tech slate for computer science, robotics, and math.',
    primary: '#0891b2',
    primaryHover: '#0e7490',
    primaryLight: '#ecfeff',
    primaryBorder: '#a5f3fc',
    accent: '#4f46e5',
    surfaceTone: 'soft',
    badge: 'Modern STEM'
  },
  {
    id: 'midnight-dark',
    name: 'Midnight OLED',
    tagline: 'Deep dark slate palette with luminous neon highlights for comfortable night study.',
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    primaryLight: '#1e1b4b',
    primaryBorder: '#312e81',
    accent: '#38bdf8',
    surfaceTone: 'dark',
    badge: 'True Dark Mode'
  },
  {
    id: 'high-contrast',
    name: 'High-Contrast Ink',
    tagline: 'Stark monochrome with bold borders for maximum visual accessibility and clarity.',
    primary: '#0f172a',
    primaryHover: '#1e293b',
    primaryLight: '#f1f5f9',
    primaryBorder: '#0f172a',
    accent: '#2563eb',
    surfaceTone: 'light',
    badge: 'Accessibility'
  }
];

export const DEFAULT_CUSTOM_PALETTE: CustomColorPalette = {
  primaryColor: '#6366f1',
  accentColor: '#06b6d4',
  surfaceTone: 'light'
};

export const DEFAULT_COLOR_SCHEME: ColorSchemeConfig = {
  preset: 'default-indigo',
  custom: DEFAULT_CUSTOM_PALETTE
};

/**
 * Apply the selected color scheme immediately to the document DOM
 */
export function applyThemeToDom(config: ColorSchemeConfig): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const preset = config.preset || 'default-indigo';

  // Set data attribute for CSS selectors
  root.setAttribute('data-color-scheme', preset);

  // Clean previous theme classes
  const classesToRemove = Array.from(root.classList).filter((c) => c.startsWith('theme-'));
  classesToRemove.forEach((c) => root.classList.remove(c));
  root.classList.add(`theme-${preset}`);

  if (preset === 'custom' && config.custom) {
    const { primaryColor, accentColor, surfaceTone } = config.custom;
    root.style.setProperty('--color-primary', primaryColor);
    root.style.setProperty('--color-primary-hover', adjustHexColor(primaryColor, -25));
    root.style.setProperty('--color-primary-light', hexToRgba(primaryColor, 0.12));
    root.style.setProperty('--color-primary-border', hexToRgba(primaryColor, 0.35));
    root.style.setProperty('--color-accent', accentColor);
    root.setAttribute('data-theme-surface', surfaceTone || 'light');
  } else {
    const matched = THEME_PRESETS.find((p) => p.id === preset) || THEME_PRESETS[0];
    root.style.setProperty('--color-primary', matched.primary);
    root.style.setProperty('--color-primary-hover', matched.primaryHover);
    root.style.setProperty('--color-primary-light', matched.primaryLight);
    root.style.setProperty('--color-primary-border', matched.primaryBorder);
    root.style.setProperty('--color-accent', matched.accent);
    root.setAttribute('data-theme-surface', matched.surfaceTone);
  }
}

/**
 * Simple hex brightness adjustment utility
 */
function adjustHexColor(hex: string, percent: number): string {
  try {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map((c) => c + c).join('');
    }
    const num = parseInt(cleanHex, 16);
    let r = (num >> 16) + Math.round(255 * (percent / 100));
    let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
    let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  } catch {
    return hex;
  }
}

/**
 * Convert Hex to RGBA string
 */
function hexToRgba(hex: string, alpha: number): string {
  try {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map((c) => c + c).join('');
    }
    const num = parseInt(cleanHex, 16);
    const r = num >> 16;
    const g = (num >> 8) & 0x00ff;
    const b = num & 0x0000ff;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch {
    return hex;
  }
}

