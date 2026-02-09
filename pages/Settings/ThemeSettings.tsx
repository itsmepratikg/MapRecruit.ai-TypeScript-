
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Palette, CheckCircle, Upload, Save, RotateCcw,
  Image as ImageIcon, Globe, User, Edit3, X, AlertTriangle, Check
} from '../../components/Icons';
import { useToast } from '../../components/Toast';
import { hexToRgb, rgbToHex, mixColors, applyTheme } from '../../utils/themeUtils';
import { clientService, companyService, authService } from '../../services/api';

// --- Accessibility Helpers ---

const getLuminance = (r: number, g: number, b: number) => {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

const getContrast = (l1: number, l2: number) => {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

// Suggest a better color by adjusting brightness/saturation if contrast is low
const suggestBetterColor = (r: number, g: number, b: number) => {
  const lum = getLuminance(r, g, b);
  const whiteContrast = getContrast(lum, 1);
  const darkContrast = getContrast(lum, 0.05);

  // If contrast is already good (WCAG AA 3:1 for large text/UI components), return null
  if (whiteContrast >= 3 && darkContrast >= 3) return null;

  // Deterministic adjustment: if too light, darken significantly; if too dark, lighten significantly.
  // This prevents the "ping-pong" effect by moving the color into a safe mid-range.
  if (whiteContrast < 3) {
    return { r: Math.floor(r * 0.6), g: Math.floor(g * 0.6), b: Math.floor(b * 0.6) };
  } else if (darkContrast < 3) {
    return {
      r: Math.min(255, Math.floor(r + (255 - r) * 0.5)),
      g: Math.min(255, Math.floor(g + (255 - g) * 0.5)),
      b: Math.min(255, Math.floor(b + (255 - b) * 0.5))
    };
  }
  return null;
};

// --- Sub-components ---

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  type?: 'danger' | 'primary';
  brandColor?: string;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel, type = 'primary', brandColor = '#0d6efd' }: ConfirmationModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="flex justify-end gap-3 p-4 bg-slate-50 dark:bg-slate-900/50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">Cancel</button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`px-6 py-2 text-sm font-bold text-white rounded-xl transition-all shadow-lg active:scale-95`}
            style={{
              backgroundColor: type === 'danger' ? '#ef4444' : brandColor,
              boxShadow: type === 'danger' ? '0 10px 15px -3px rgba(239, 68, 68, 0.2)' : `0 10px 15px -3px ${brandColor}40`
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ImageUploaderProps {
  label: string;
  value?: string;
  pathValue?: string;
  onImageChange: (value: string) => void;
  onPathChange?: (value: string) => void;
  aspectRatio?: 'square' | 'video';
  shape?: 'circle' | 'rect';
  showPathInput?: boolean;
  disabled?: boolean;
}

const ImageUploader = ({ label, value, pathValue, onImageChange, onPathChange, aspectRatio = 'square', shape = 'rect', showPathInput = false, disabled = false }: ImageUploaderProps) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.match('image.*')) {
      addToast(t('Only image files (JPG, PNG, GIF) are supported.'), 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageChange(e.target?.result as string);
      if (onPathChange) onPathChange(file.name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`space-y-4 ${disabled ? 'opacity-60 grayscale-[0.5]' : ''}`}>
      <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 capitalize">{t(label)}</label>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div
          className={`shrink-0 border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center
            ${shape === 'circle' ? 'rounded-full' : 'rounded-2xl'}
            ${aspectRatio === 'video' ? 'w-full md:w-72 aspect-video' : 'w-32 h-32'}
          `}
        >
          {value ? (
            <img src={value} alt={label} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={32} className="text-slate-400" />
          )}
        </div>

        <div className="flex-1 w-full space-y-4">
          <div
            className={`border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-8 text-center transition-all group ${disabled ? 'cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer'}`}
            onDragOver={(e) => !disabled && e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={disabled}
            />
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform ${!disabled ? 'bg-slate-50 dark:bg-slate-800 group-hover:scale-110' : 'bg-slate-200 dark:bg-slate-800'}`}>
              <Upload size={20} className={`text-slate-400 ${!disabled && 'group-hover:text-emerald-500'}`} />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-bold mb-1">
              {disabled ? t("Editing Disabled") : t("Click here or drag and drop to upload")}
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t("JPG, PNG, GIF up to 5MB")}</p>
          </div>

          {showPathInput && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t("Image Resource Path")}</label>
              <div className="relative">
                <Globe size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder={t("Enter image URL or resource path...")}
                  value={pathValue || ''}
                  onChange={(e) => !disabled && onPathChange && onPathChange(e.target.value)}
                  disabled={disabled}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:bg-slate-100 dark:disabled:bg-slate-800/50"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export const ThemeSettings = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();

  // Tabs State
  const [activeTab, setActiveTab] = useState<'COMPANY' | 'PAGE'>('COMPANY');
  const [isEditing, setIsEditing] = useState(false);

  // Modal State
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; title: string; message: string; onConfirm: () => void; type?: 'danger' | 'primary'; confirmLabel?: string }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });

  const [hasAppliedSuggestion, setHasAppliedSuggestion] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  // Company Theme State - DEFAULT: Blue (#0d6efd)
  const [color, setColor] = useState('#0d6efd');
  const [rgb, setRgb] = useState({ r: 13, g: 110, b: 253 });

  // Page Customization State
  const [loginBg, setLoginBg] = useState('');
  const [loginBgPath, setLoginBgPath] = useState('');

  const [recruiterFavicon, setRecruiterFavicon] = useState('');
  const [recruiterFaviconPath, setRecruiterFaviconPath] = useState('');

  const [jobSeekerFavicon, setJobSeekerFavicon] = useState('');
  const [jobSeekerFaviconPath, setJobSeekerFaviconPath] = useState('');

  const [userProfile, setUserProfile] = useState<any>(null);
  const [loadingContext, setLoadingContext] = useState(true);

  const [accessibilityWarning, setAccessibilityWarning] = useState<string | null>(null);

  const PREDEFINED_COLORS = [
    { name: 'Blue', hex: '#0d6efd' },
    { name: 'Sunset', hex: '#ff671c' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Purple', hex: '#B384FF' },
    { name: 'Orange', hex: '#D14B00' },
    { name: 'Pink', hex: '#FF70C1' },
    { name: 'Indigo', hex: '#8B8EFF' },
  ];

  // Load configuration from current active client
  useEffect(() => {
    const initPage = async () => {
      setLoadingContext(true);
      try {
        // 1. Fetch current profile from backend (No local storage reliance for state)
        const profile = await authService.getMe();
        setUserProfile(profile);

        const clientId = profile.activeClientID;

        if (clientId) {
          // 2. Fetch client-specific theme
          const clientData = await clientService.getById(clientId);
          const savedColor = clientData.themesdata?.themeVariables?.mainColor;

          if (savedColor && validateHex(savedColor)) {
            setColor(savedColor);
            const newRgb = hexToRgb(savedColor);
            if (newRgb) setRgb(newRgb);
            applyTheme(savedColor);
          }

          // Load page customization
          if (clientData.themesdata?.pageCustomization) {
            const pc = clientData.themesdata.pageCustomization;
            if (pc.loginBg) setLoginBg(pc.loginBg);
            if (pc.loginBgPath) setLoginBgPath(pc.loginBgPath);
            if (pc.recruiterFavicon) setRecruiterFavicon(pc.recruiterFavicon);
            if (pc.recruiterFaviconPath) setRecruiterFaviconPath(pc.recruiterFaviconPath);
            if (pc.jobSeekerFavicon) setJobSeekerFavicon(pc.jobSeekerFavicon);
            if (pc.jobSeekerFaviconPath) setJobSeekerFaviconPath(pc.jobSeekerFaviconPath);
          }
        } else {
          // Fallback to company settings if no active client
          const companyData = await companyService.get();
          const companyColor = companyData.themesdata?.themeVariables?.mainColor;
          if (companyColor && validateHex(companyColor)) {
            setColor(companyColor);
            const newRgb = hexToRgb(companyColor);
            if (newRgb) setRgb(newRgb);
            applyTheme(companyColor);
          }
        }
      } catch (error) {
        console.error("Failed to load theme settings context:", error);
        addToast(t("Failed to load branding context from server."), "error");
      } finally {
        setLoadingContext(false);
      }
    };
    initPage();
  }, [t, addToast]);

  // Logic for contrast recommendation
  useEffect(() => {
    const better = suggestBetterColor(rgb.r, rgb.g, rgb.b);

    // Only show alert if user has actively interacted with colors in this session
    // and hasn't already applied the suggestion.
    if (better && hasInteracted && !hasAppliedSuggestion) {
      setAccessibilityWarning(t("Warning: This color combination might have poor readability in either Light or Dark mode. Check contrast ratios."));
    } else {
      setAccessibilityWarning(null);
    }
  }, [rgb, t, hasAppliedSuggestion, hasInteracted]);

  const handleApplySuggestion = () => {
    const better = suggestBetterColor(rgb.r, rgb.g, rgb.b);
    if (better) {
      setRgb(better);
      setColor(rgbToHex(better.r, better.g, better.b));
      setHasAppliedSuggestion(true);
      addToast(t("Applied suggested color for better contrast."), "success");
    }
  };

  const validateHex = (hex: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  const validateRgb = (n: number) => !isNaN(n) && n >= 0 && n <= 255;

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;
    const val = e.target.value;
    setColor(val);
    setHasInteracted(true);
    setHasAppliedSuggestion(false);
    if (validateHex(val)) {
      const newRgb = hexToRgb(val);
      if (newRgb) setRgb(newRgb);
    }
  };

  const handleRgbChange = (key: 'r' | 'g' | 'b', val: string) => {
    if (!isEditing) return;
    const num = parseInt(val);
    setHasInteracted(true);
    setHasAppliedSuggestion(false);
    if (validateRgb(num)) {
      const newRgb = { ...rgb, [key]: num };
      setRgb(newRgb);
      setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    } else if (val === '') {
      setRgb({ ...rgb, [key]: 0 });
    }
  };

  const handleSaveCompanyTheme = async () => {
    if (!validateHex(color)) {
      addToast(t("Invalid HEX code. Please enter a valid color."), "error");
      return;
    }

    try {
      const clientId = userProfile?.activeClientID;
      const themePayload = {
        'themesdata.themeVariables.mainColor': color
      };

      // 1. Save to Client if available
      if (clientId) {
        console.log(`[DEBUG] Updating color for Client: ${clientId}`);
        await clientService.update(clientId, themePayload);
      }

      // 2. Save to Company as default (This uses the user's current company context on the backend)
      console.log(`[DEBUG] Updating color for Company`);
      await companyService.update(themePayload);

      applyTheme(color);
      setIsEditing(false);
      setHasInteracted(false);
      setHasAppliedSuggestion(false);
      addToast(t('Company theme updated successfully!'), 'success');
    } catch (error: any) {
      console.error("Save Theme Error:", error);
      const msg = error.response?.data?.message || error.message;
      addToast(`${t("Failed to save theme settings")}: ${msg}`, "error");
    }
  };

  const handleResetCompanyTheme = async () => {
    const defaultColor = '#0d6efd';
    try {
      const clientId = userProfile?.activeClientID;
      const themePayload = {
        'themesdata.themeVariables.mainColor': defaultColor
      };

      if (clientId) await clientService.update(clientId, themePayload);
      await companyService.update(themePayload);

      setColor(defaultColor);
      setRgb(hexToRgb(defaultColor)!);
      applyTheme(defaultColor);
      setIsEditing(false);
      setHasInteracted(false);
      setHasAppliedSuggestion(false);
      addToast(t('Company theme reset to default.'), 'info');
    } catch (error) {
      addToast(t("Failed to reset theme."), "error");
    }
  };

  const handleSavePageCustomization = async () => {
    try {
      const clientId = userProfile?.activeClientID;
      const pcPayload = {
        'themesdata.pageCustomization': {
          loginBg,
          loginBgPath,
          recruiterFavicon,
          recruiterFaviconPath,
          jobSeekerFavicon,
          jobSeekerFaviconPath
        }
      };

      if (clientId) await clientService.update(clientId, pcPayload);
      await companyService.update(pcPayload);

      setIsEditing(false);
      setHasInteracted(false);
      setHasAppliedSuggestion(false);
      addToast(t('Page customization settings saved successfully!'), 'success');
    } catch (error) {
      addToast(t("Failed to save customization."), "error");
    }
  };

  const handleResetPageCustomization = () => {
    setLoginBg('');
    setLoginBgPath('');
    setRecruiterFavicon('');
    setRecruiterFaviconPath('');
    setJobSeekerFavicon('');
    setJobSeekerFaviconPath('');
    setIsEditing(false);
    addToast(t('Page customization settings reset.'), 'info');
  };

  const openConfirmation = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'primary' = 'primary', confirmLabel?: string) => {
    setConfirmModal({
      open: true,
      title,
      message,
      onConfirm,
      type,
      confirmLabel
    });
  };

  // Generate preview color for active state
  const activeBgPreview = rgbToHex(
    mixColors(hexToRgb(color) || { r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }, 85).r,
    mixColors(hexToRgb(color) || { r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }, 85).g,
    mixColors(hexToRgb(color) || { r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }, 85).b
  );
  const activeTextPreview = rgbToHex(
    mixColors(hexToRgb(color) || { r: 0, g: 0, b: 0 }, { r: 0, g: 0, b: 0 }, 50).r,
    mixColors(hexToRgb(color) || { r: 0, g: 0, b: 0 }, { r: 0, g: 0, b: 0 }, 50).g,
    mixColors(hexToRgb(color) || { r: 0, g: 0, b: 0 }, { r: 0, g: 0, b: 0 }, 50).b
  );

  if (loadingContext) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-slate-500 dark:text-slate-400 font-bold animate-pulse">{t("Initializing Branding Engine...")}</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">{t("Branding & Appearance")}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">{t("Manage your company's visual identity across all platforms.")}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 overflow-hidden relative">

            {/* Confirmation Modal */}
            <ConfirmationModal
              isOpen={confirmModal.open}
              onClose={() => setConfirmModal({ ...confirmModal, open: false })}
              onConfirm={confirmModal.onConfirm}
              title={confirmModal.title}
              message={confirmModal.message}
              confirmLabel={confirmModal.confirmLabel || (confirmModal.type === 'danger' ? "Confirm Reset" : "Proceed")}
              type={confirmModal.type}
              brandColor={color}
            />

            {/* Tabs Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/40 p-2 gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (isEditing) {
                      openConfirmation(
                        "Discard Changes?",
                        "You are currently in edit mode. Switching tabs will discard unsaved changes.",
                        () => { setActiveTab('COMPANY'); setIsEditing(false); setHasInteracted(false); },
                        'danger',
                        "Discard Changes"
                      );
                    } else {
                      setActiveTab('COMPANY');
                    }
                  }}
                  className={`flex-1 md:flex-none px-10 py-4 text-sm font-bold transition-all rounded-2xl flex items-center justify-center gap-3 ${activeTab === 'COMPANY' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
                >
                  <Palette size={18} />
                  {t("Company Theme")}
                </button>
                <button
                  onClick={() => {
                    if (isEditing) {
                      openConfirmation(
                        "Discard Changes?",
                        "You are currently in edit mode. Switching tabs will discard unsaved changes.",
                        () => { setActiveTab('PAGE'); setIsEditing(false); setHasInteracted(false); },
                        'danger',
                        "Discard Changes"
                      );
                    } else {
                      setActiveTab('PAGE');
                    }
                  }}
                  className={`flex-1 md:flex-none px-10 py-4 text-sm font-bold transition-all rounded-2xl flex items-center justify-center gap-3 ${activeTab === 'PAGE' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
                >
                  <ImageIcon size={18} />
                  {t("Page Customization")}
                </button>
              </div>

              {/* Top Actions */}
              <div className="flex items-center gap-2 pr-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-8 py-3 text-white font-extrabold rounded-xl transition-all text-sm shadow-xl active:scale-95"
                    style={{ backgroundColor: color, boxShadow: `0 10px 20px -5px ${color}33` }}
                  >
                    <Edit3 size={18} /> {t("Edit Settings")}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-300">
                    <button
                      onClick={() => openConfirmation(
                        "Discard Changes?",
                        "Any unsaved modifications will be lost.",
                        () => { setIsEditing(false); setHasInteracted(false); },
                        'danger',
                        "Discard Changes"
                      )}
                      className="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all text-sm flex items-center gap-2"
                    >
                      <X size={16} /> {t("Cancel")}
                    </button>

                    <button
                      onClick={() => {
                        const action = activeTab === 'COMPANY' ? handleResetCompanyTheme : handleResetPageCustomization;
                        openConfirmation(
                          "Reset to Defaults?",
                          "This will revert all fields in this section to their system default values.",
                          action,
                          'danger'
                        );
                      }}
                      className="flex items-center gap-2 px-6 py-3 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all text-sm"
                    >
                      <RotateCcw size={16} /> {t("Reset Defaults")}
                    </button>

                    <button
                      onClick={() => {
                        const action = activeTab === 'COMPANY' ? handleSaveCompanyTheme : handleSavePageCustomization;
                        openConfirmation(
                          "Save Changes?",
                          "Are you sure you want to apply these branding updates across the platform?",
                          action
                        );
                      }}
                      className="flex items-center gap-3 px-10 py-3 text-white font-extrabold rounded-xl hover:opacity-90 transition-all text-sm shadow-xl active:scale-95"
                      style={{ backgroundColor: color, boxShadow: `0 10px 20px -5px ${color}40` }}
                    >
                      <Save size={18} /> {t("Save & Finish")}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tab Content */}
            <div className={`p-10 transition-all duration-300 ${!isEditing ? 'pointer-events-none' : ''}`}>
              {activeTab === 'COMPANY' ? (
                <div className="space-y-10 max-w-5xl animate-in fade-in zoom-in-95 duration-300">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <div className="w-6 h-1 bg-emerald-500 rounded-full"></div>
                        {t("Primary Brand Identity")}
                      </h4>
                      {/* Color Preview & Picker */}
                      <div className="flex flex-col md:flex-row gap-10 items-start bg-slate-50/50 dark:bg-slate-900/30 p-8 rounded-3xl border border-slate-100 dark:border-slate-700/50">
                        <div className="relative w-32 h-32 rounded-3xl shadow-2xl overflow-hidden border-4 border-white dark:border-slate-800 shrink-0">
                          <input
                            type="color"
                            value={color}
                            onChange={handleHexChange}
                            disabled={!isEditing}
                            className={`absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                          />
                        </div>
                        <div className="flex-1 w-full space-y-6">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">{t("Brand HEX Color")}</label>
                            <div className={`flex items-center bg-white dark:bg-slate-900 border rounded-2xl shadow-sm transition-all overflow-hidden ${!validateHex(color) ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} ${isEditing && 'focus-within:ring-2 focus-within:ring-emerald-500'}`}>
                              <span className="pl-4 text-slate-400 font-mono text-lg">#</span>
                              <input
                                type="text"
                                value={color.replace('#', '')}
                                onChange={(e) => handleHexChange({ target: { value: '#' + e.target.value } } as any)}
                                disabled={!isEditing}
                                className="w-full px-3 py-3.5 text-lg font-mono text-slate-700 dark:text-slate-100 outline-none bg-transparent"
                                maxLength={7}
                              />
                              {validateHex(color) && <Check size={18} className="mr-4 text-emerald-500 shrink-0" />}
                            </div>
                            {!validateHex(color) && <p className="text-[10px] text-red-500 mt-1 font-bold pl-1">{t("Please enter a valid HEX code (e.g., #FFFFFF)")}</p>}
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">{t("RGB Balance")}</label>
                            <div className="flex gap-4">
                              {['r', 'g', 'b'].map((k) => (
                                <div key={k} className="flex-1 relative">
                                  <input
                                    type="number"
                                    value={(rgb as any)[k]}
                                    onChange={(e) => handleRgbChange(k as any, e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full pl-8 pr-3 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-base text-center font-mono dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm transition-all disabled:opacity-80"
                                  />
                                  <span className="absolute left-3 top-[15px] text-[10px] font-bold text-slate-400 uppercase">{k}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Accessibility Warning */}
                    {accessibilityWarning && (
                      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-amber-800 dark:text-amber-200 mb-1">{t("Visual Accessibility Alert")}</p>
                          <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">{accessibilityWarning}</p>
                          {isEditing && (
                            <button
                              onClick={handleApplySuggestion}
                              className="mt-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 underline hover:no-underline"
                            >
                              {t("Apply recommended adjustment for better visibility")}
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Palette Selection */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">{t("System Recommended & Custom Palettes")}</label>
                      <div className="flex flex-wrap gap-4 items-center">
                        {PREDEFINED_COLORS.map(c => (
                          <button
                            key={c.name}
                            onClick={() => { if (isEditing) { setColor(c.hex); setRgb(hexToRgb(c.hex)!); setHasInteracted(true); setHasAppliedSuggestion(false); } }}
                            className={`w-12 h-12 rounded-2xl shadow-md border-2 transition-all relative ${!isEditing ? 'cursor-default' : 'hover:scale-110 active:scale-90'} ${color.toLowerCase() === c.hex.toLowerCase() ? 'border-white dark:border-slate-100 ring-4 ring-emerald-500/30' : 'border-transparent'}`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          >
                            {color.toLowerCase() === c.hex.toLowerCase() && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-2xl">
                                <CheckCircle size={18} className="text-white drop-shadow-md" />
                              </div>
                            )}
                          </button>
                        ))}

                        {/* Custom Dynamic Slot */}
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-100 dark:border-slate-700 ml-2">
                          <div
                            className={`w-12 h-12 rounded-2xl transition-all relative flex items-center justify-center border-2
                                ${!PREDEFINED_COLORS.some(c => c.hex.toLowerCase() === color.toLowerCase())
                                ? 'border-white dark:border-slate-100 ring-4 ring-emerald-500/30 shadow-lg'
                                : 'border-slate-200 dark:border-slate-700 shadow-sm opacity-80'}`}
                            style={{ backgroundColor: color }}
                            title={t("Custom Color")}
                          >
                            {!PREDEFINED_COLORS.some(c => c.hex.toLowerCase() === color.toLowerCase()) ? (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-2xl">
                                <CheckCircle size={18} className="text-white drop-shadow-md" />
                              </div>
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-2xl">
                                <span className="text-white/60 font-bold text-lg drop-shadow-md">+</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{t("Custom")}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{t("Active")}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preview Block - DUAL MODE LAB */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900 text-white">
                          <ImageIcon size={16} />
                        </div>
                        <h5 className="font-bold text-slate-700 dark:text-slate-200 text-sm tracking-wide uppercase">{t("Cross-Theme Component Lab")}</h5>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Light Mode Preview */}
                        <div className="p-8 rounded-3xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/50 space-y-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{t("Light Theme Environment")}</span>
                            <div className="flex gap-1">
                              {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-slate-200"></div>)}
                            </div>
                          </div>

                          <div className="bg-white p-10 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-6">
                            <button
                              className="w-full min-w-[180px] px-10 py-4 rounded-2xl text-white text-sm font-extrabold transition-all"
                              style={{ backgroundColor: color, boxShadow: `0 12px 24px -10px ${color}` }}
                            >
                              {t("Primary Action")}
                            </button>
                            <div
                              className="w-full min-w-[180px] flex items-center justify-center gap-3 px-10 py-4 rounded-2xl text-sm font-extrabold shadow-inner transition-all border border-slate-50"
                              style={{ backgroundColor: activeBgPreview, color: activeTextPreview }}
                            >
                              <CheckCircle size={20} /> {t("Active State")}
                            </div>
                            <button
                              className="w-full min-w-[180px] px-10 py-4 rounded-2xl border-2 text-sm font-extrabold transition-all"
                              style={{ borderColor: color, color: color }}
                            >
                              {t("Outline Style")}
                            </button>
                          </div>
                        </div>

                        {/* Dark Mode Preview */}
                        <div className="p-8 rounded-3xl bg-slate-800 dark:bg-slate-900/80 border border-slate-700 dark:border-slate-950 space-y-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{t("Dark Theme Environment")}</span>
                            <div className="flex gap-1">
                              {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>)}
                            </div>
                          </div>

                          <div className="bg-slate-950/40 p-10 rounded-2xl border border-slate-800/50 flex flex-col gap-6 backdrop-blur-sm transition-all duration-300">
                            <button
                              className="w-full min-w-[180px] px-10 py-4 rounded-2xl text-white text-sm font-extrabold transition-all"
                              style={{ backgroundColor: color, boxShadow: `0 12px 28px -12px ${color}` }}
                            >
                              {t("Primary Action")}
                            </button>
                            <div
                              className="w-full min-w-[180px] flex items-center justify-center gap-3 px-10 py-4 rounded-2xl text-sm font-extrabold shadow-inner transition-all border border-white/5"
                              style={{ backgroundColor: `${color}15`, color: color }}
                            >
                              <CheckCircle size={20} /> {t("Active State")}
                            </div>
                            <button
                              className="w-full min-w-[180px] px-10 py-4 rounded-2xl border-2 text-sm font-extrabold transition-all shadow-lg shadow-black/20"
                              style={{ borderColor: color, color: color }}
                            >
                              {t("Outline Style")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-12 animate-in fade-in zoom-in-95 duration-300 max-w-4xl">
                  <div className="grid grid-cols-1 gap-12">
                    <ImageUploader
                      label="Login Page Background Environment"
                      value={loginBg}
                      pathValue={loginBgPath}
                      onImageChange={setLoginBg}
                      onPathChange={setLoginBgPath}
                      aspectRatio="video"
                      showPathInput={true}
                      disabled={!isEditing}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-slate-100 dark:border-slate-800 pt-12">
                      <ImageUploader
                        label="Internal Portal Favicon (Recruiter)"
                        value={recruiterFavicon}
                        pathValue={recruiterFaviconPath}
                        onImageChange={setRecruiterFavicon}
                        onPathChange={setRecruiterFaviconPath}
                        shape="circle"
                        showPathInput={true}
                        disabled={!isEditing}
                      />
                      <ImageUploader
                        label="Candidate Experience Favicon (Job Seeker)"
                        value={jobSeekerFavicon}
                        pathValue={jobSeekerFaviconPath}
                        onImageChange={setJobSeekerFavicon}
                        onPathChange={setJobSeekerFaviconPath}
                        shape="circle"
                        showPathInput={true}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
