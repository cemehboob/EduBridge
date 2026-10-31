import React, { useState } from 'react';
import {
  Palette,
  Check,
  Sparkles,
  Sliders,
  Moon,
  Sun,
  Eye,
  RefreshCw,
  Droplets
} from 'lucide-react';
import { ColorSchemeConfig, ColorSchemePreset, CustomColorPalette } from '../../types';
import { THEME_PRESETS, DEFAULT_CUSTOM_PALETTE, applyThemeToDom } from '../../utils/themeManager';
import { sound } from '../../utils/audio';

interface ColorSchemeSelectorProps {
  currentScheme: ColorSchemeConfig;
  onChangeScheme: (newScheme: ColorSchemeConfig) => void;
}

export const ColorSchemeSelector: React.FC<ColorSchemeSelectorProps> = ({
  currentScheme,
  onChangeScheme
}) => {
  const [selectedPreset, setSelectedPreset] = useState<ColorSchemePreset>(
    currentScheme.preset || 'default-indigo'
  );
  const [customPalette, setCustomPalette] = useState<CustomColorPalette>(
    currentScheme.custom || DEFAULT_CUSTOM_PALETTE
  );
  const [showCustomBuilder, setShowCustomBuilder] = useState(
    currentScheme.preset === 'custom'
  );

  const handleSelectPreset = (presetId: ColorSchemePreset) => {
    sound.playClick();
    setSelectedPreset(presetId);
    setShowCustomBuilder(presetId === 'custom');

    const updatedConfig: ColorSchemeConfig = {
      preset: presetId,
      custom: presetId === 'custom' ? customPalette : undefined,
      appliedAt: new Date().toISOString()
    };

    // Apply live to DOM immediately
    applyThemeToDom(updatedConfig);
    onChangeScheme(updatedConfig);
  };

  const handleCustomColorChange = (field: keyof CustomColorPalette, val: string) => {
    const updatedPalette = {
      ...customPalette,
      [field]: val
    };
    setCustomPalette(updatedPalette);

    if (selectedPreset === 'custom') {
      const updatedConfig: ColorSchemeConfig = {
        preset: 'custom',
        custom: updatedPalette,
        appliedAt: new Date().toISOString()
      };
      applyThemeToDom(updatedConfig);
      onChangeScheme(updatedConfig);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Palette className="w-4 h-4 text-indigo-600" />
          <span>Personalized Color Scheme &amp; Theme Template</span>
        </div>
        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
          One-Time Saved Preference
        </span>
      </div>

      <p className="text-xs text-slate-500">
        Choose a curated study theme template or build your own custom color scheme. Changes apply instantly across all views and remain saved in your profile preferences.
      </p>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {THEME_PRESETS.map((preset) => {
          const isSelected = selectedPreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset.id)}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-2.5 cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 bg-white'
              }`}
            >
              {/* Color Swatch Pill */}
              <div className="flex items-center gap-1.5">
                <span
                  className="w-5 h-5 rounded-full shadow-2xs border border-white/40 shrink-0"
                  style={{ backgroundColor: preset.primary }}
                />
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-2xs border border-white/40 shrink-0"
                  style={{ backgroundColor: preset.accent }}
                />
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 ml-auto">
                  {preset.badge}
                </span>
              </div>

              <div>
                <span className="text-xs font-black text-slate-800 block line-clamp-1">
                  {preset.name}
                </span>
                <span className="text-[10px] text-slate-400 line-clamp-1 block">
                  {preset.tagline}
                </span>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Theme Card */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => handleSelectPreset('custom')}
          className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
            selectedPreset === 'custom'
              ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/30'
              : 'border-dashed border-slate-300 hover:border-indigo-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-2xs">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-800 block">
                Custom Color Scheme Builder
              </span>
              <span className="text-[11px] text-slate-500 block">
                Pick your exact primary branding, accent color, and surface tone.
              </span>
            </div>
          </div>

          <span className={`text-xs font-black px-2.5 py-1 rounded-xl border ${
            selectedPreset === 'custom'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-slate-600 border-slate-200'
          }`}>
            {selectedPreset === 'custom' ? 'Active' : 'Customize'}
          </span>
        </button>
      </div>

      {/* Custom Palette Controls (Revealed when Custom is Active) */}
      {(selectedPreset === 'custom' || showCustomBuilder) && (
        <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3.5 animate-in fade-in duration-150">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>Custom Palette Configuration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Primary Color Picker */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <label className="font-bold text-slate-700 block">Primary Brand Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customPalette.primaryColor}
                  onChange={(e) => handleCustomColorChange('primaryColor', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                />
                <input
                  type="text"
                  value={customPalette.primaryColor}
                  onChange={(e) => handleCustomColorChange('primaryColor', e.target.value)}
                  placeholder="#4F46E5"
                  className="font-mono text-xs px-2.5 py-1.5 bg-slate-50 rounded-lg border border-slate-200 flex-1 uppercase"
                />
              </div>
            </div>

            {/* Accent Color Picker */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <label className="font-bold text-slate-700 block">Secondary Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customPalette.accentColor}
                  onChange={(e) => handleCustomColorChange('accentColor', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                />
                <input
                  type="text"
                  value={customPalette.accentColor}
                  onChange={(e) => handleCustomColorChange('accentColor', e.target.value)}
                  placeholder="#0D9488"
                  className="font-mono text-xs px-2.5 py-1.5 bg-slate-50 rounded-lg border border-slate-200 flex-1 uppercase"
                />
              </div>
            </div>
          </div>

          {/* Surface Tone Selection */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 block">App Surface Tone</label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {[
                { id: 'light', label: 'Clean Crisp', desc: 'Standard slate-50' },
                { id: 'soft', label: 'Soft Mint', desc: 'Pale cyan/mint' },
                { id: 'warm', label: 'Warm Sepia', desc: 'Low blue light' },
                { id: 'dark', label: 'Dark Slate', desc: 'OLED dark surfaces' }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleCustomColorChange('surfaceTone', s.id)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    customPalette.surfaceTone === s.id
                      ? 'border-indigo-600 bg-white shadow-2xs font-bold text-slate-900'
                      : 'border-slate-200 bg-white/60 text-slate-500 hover:bg-white'
                  }`}
                >
                  <span className="block font-bold text-[11px]">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Strip */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-600">Theme Preview:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1 rounded-lg text-white font-bold text-xs shadow-2xs"
                style={{ backgroundColor: customPalette.primaryColor }}
              >
                Primary Button
              </button>
              <span
                className="px-2.5 py-1 rounded-lg text-xs font-bold border"
                style={{
                  color: customPalette.primaryColor,
                  borderColor: customPalette.accentColor,
                  backgroundColor: customPalette.surfaceTone === 'dark' ? '#1f2937' : '#f8fafc'
                }}
              >
                Accent Tag
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
