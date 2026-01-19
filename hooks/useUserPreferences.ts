import { useState, useEffect } from 'react';
import { DEFAULT_USER_ACCOUNT } from '../data';
import { userService } from '../services/api';
import { useToast } from '../components/Toast';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LOCALES } from '../src/i18n';

export const useUserPreferences = () => {

  const { addPromise } = useToast();
  const { i18n } = useTranslation();

  // --- Helper: Get State from Auth User or Fallback ---
  const getInitialState = () => {
    if (typeof window === 'undefined') return DEFAULT_USER_ACCOUNT.preferences;

    // 1. Try Authenticated User (Source of Truth)
    const authUserStr = localStorage.getItem('user');
    if (authUserStr) {
      try {
        const user = JSON.parse(authUserStr);
        if (user.accessibilitySettings && Object.keys(user.accessibilitySettings).length > 0) {
          // Merge with defaults
          return {
            theme: user.accessibilitySettings.theme || DEFAULT_USER_ACCOUNT.preferences.theme,
            // Use languageCode if available, else fallback
            languageCode: user.accessibilitySettings.languageCode || 'en-US',
            dateFormat: user.accessibilitySettings.dateFormat || 'MM/DD/YYYY',
            language: user.accessibilitySettings.language || DEFAULT_USER_ACCOUNT.preferences.language, // Legacy
            dashboardConfig: {
              ...DEFAULT_USER_ACCOUNT.preferences.dashboardConfig,
              ...(user.accessibilitySettings.dashboardConfig || {}),
              layouts: {
                ...DEFAULT_USER_ACCOUNT.preferences.dashboardConfig.layouts,
                ...(user.accessibilitySettings.dashboardConfig?.layouts || {})
              }
            }
          };
        }
      } catch (e) { console.error("Error parsing user settings", e); }
    }

    // 2. Fallback: Legacy LocalStorage
    try {
      const stored = localStorage.getItem('userAccount');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.preferences) return parsed.preferences;
      }
    } catch (e) { }

    return { ...DEFAULT_USER_ACCOUNT.preferences, languageCode: 'en-US', dateFormat: 'MM/DD/YYYY' };
  };

  const [preferences, setPreferences] = useState(getInitialState);

  // --- Explicit Save Action ---
  const saveSettings = async () => {
    const authUserStr = localStorage.getItem('user');
    if (authUserStr) {
      try {
        const user = JSON.parse(authUserStr);

        // 1. Persist to LocalStorage (User Object)
        user.accessibilitySettings = preferences;
        localStorage.setItem('user', JSON.stringify(user));

        // 2. Persist to Backend
        const userId = user._id || user.id;
        if (userId) {
          await addPromise(
            userService.update(userId, { accessibilitySettings: preferences }),
            {
              loading: 'Saving changes...',
              success: 'Settings saved',
              error: 'Could not save settings'
            }
          );
        }
      } catch (error) {
        console.error("Failed to save preferences to server", error);
      }
    } else {
      // Guest Fallback
      localStorage.setItem('userAccount', JSON.stringify({
        ...DEFAULT_USER_ACCOUNT,
        preferences: preferences
      }));
    }
  };

  // --- Local State Updaters (Previews) ---

  const updateLocalState = (partialPrefs: any) => {
    setPreferences(prev => ({
      ...prev,
      ...partialPrefs,
      dashboardConfig: partialPrefs.dashboardConfig ? {
        ...prev.dashboardConfig,
        ...partialPrefs.dashboardConfig,
        layouts: {
          ...prev.dashboardConfig.layouts,
          ...(partialPrefs.dashboardConfig.layouts || {})
        }
      } : prev.dashboardConfig
    }));
  };

  const updateTheme = (theme: 'light' | 'dark' | 'system') => {
    updateLocalState({ theme });
  };

  const updateLanguage = (code: string) => {
    // Find associated date format
    const locale = SUPPORTED_LOCALES.find(l => l.code === code);

    // Explicitly update i18n
    if (i18n.language !== code) {
      i18n.changeLanguage(code);
    }

    updateLocalState({
      languageCode: code,
      language: locale?.label || 'English (United States)', // Sync legacy field
      dateFormat: locale?.dateFormat || 'MM/DD/YYYY'
    });
  };

  const updateDashboardLayout = (widgets: any[], viewMode: 'desktop' | 'tablet' | 'mobile') => {
    const partial = {
      dashboardConfig: {
        layouts: {
          [viewMode]: widgets
        }
      }
    };
    updateLocalState(partial);
  };

  const resetDashboard = () => {
    updateLocalState({
      dashboardConfig: DEFAULT_USER_ACCOUNT.preferences.dashboardConfig
    });
  }

  // --- Effect: Apply Theme ---
  useEffect(() => {
    const applyTheme = (t: string) => {
      let isDark = false;
      if (t === 'dark') {
        isDark = true;
      } else if (t === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme(preferences.theme);

    if (preferences.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [preferences.theme]);

  // Remove the "Push" effect that was causing loops
  // useEffect(() => {
  //   if (preferences.languageCode && i18n.language !== preferences.languageCode) {
  //     i18n.changeLanguage(preferences.languageCode);
  //   }
  // }, [preferences.languageCode, i18n]);

  // --- Effect: Sync with Global i18n Changes (Fix Loop) ---
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      // If the global language changes (e.g. from another component),
      // sync this hook's local state to match and prevent reverting it.
      // Use function update to prevent stale closures, but check current state carefully? 
      // Actually, since we only set state if different, it should be fine.
      // We need to access the LATEST preferences to check if update is needed.
      // But we can't access it easily inside the event listener if we don't depend on it.
      // If we depend on it, we re-bind the listener on every change. 
      // That's acceptable.

      if (preferences.languageCode !== lng) {
        const locale = SUPPORTED_LOCALES.find(l => l.code === lng);
        setPreferences(prev => {
          if (prev.languageCode === lng) return prev; // already synced
          return {
            ...prev,
            languageCode: lng,
            language: locale?.label || prev.language,
            dateFormat: locale?.dateFormat || prev.dateFormat
          };
        });
      }
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [preferences.languageCode, i18n]);

  return {
    userAccount: { preferences },
    theme: preferences.theme,
    language: preferences.language,       // Legacy Label
    languageCode: preferences.languageCode, // New Code
    dateFormat: preferences.dateFormat,
    dashboardLayouts: preferences.dashboardConfig.layouts,
    updateTheme,
    updateLanguage,
    updateDashboardLayout,
    resetDashboard,
    saveSettings
  };
};