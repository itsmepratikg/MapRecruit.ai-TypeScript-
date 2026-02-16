import { useState, useEffect } from 'react';
import { companyService } from '../services/api';
import { generatePalette, DEFAULT_THEME_COLOR } from '../utils/colorUtils';

export const useCompanyTheme = (userProfile: any) => {
    const [themeColor, setThemeColor] = useState<string>(DEFAULT_THEME_COLOR);
    const [companyName, setCompanyName] = useState<string>('');
    const [logos, setLogos] = useState<{ logo?: string, minifiedLogo?: string }>({});
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchAndApplyTheme = async () => {
            // Wait until user is logged in before fetching company data
            if (!userProfile || !sessionStorage.getItem('authToken')) {
                applyTheme(DEFAULT_THEME_COLOR);
                return;
            }

            setLoading(true);
            try {
                const companyData = await companyService.get();

                // Extract main color from themesdata
                // themesdata is an array in some company documents
                const themes = companyData?.themesdata;
                const mainColor = Array.isArray(themes)
                    ? themes[0]?.themeVariables?.mainColor
                    : themes?.themeVariables?.mainColor;



                if (mainColor) {
                    setThemeColor(mainColor);
                    applyTheme(mainColor);
                } else {
                    setThemeColor(DEFAULT_THEME_COLOR);
                    applyTheme(DEFAULT_THEME_COLOR);
                }

                // Extract branding data (standard DB paths)
                setCompanyName(companyData?.companyProfile?.companyName || '');
                setLogos({
                    logo: companyData?.companyProfile?.companyLogo,
                    minifiedLogo: companyData?.companyProfile?.companyMinifiedLogo
                });

            } catch (error) {
                // Fallback on error
                setThemeColor(DEFAULT_THEME_COLOR);
                applyTheme(DEFAULT_THEME_COLOR);
            } finally {
                setLoading(false);
            }
        };

        fetchAndApplyTheme();
    }, [userProfile]); // Re-run if user profile changes (e.g. login/logout/update)

    // Helper to generate palette and set CSS variables
    const applyTheme = (color: string) => {
        const palette = generatePalette(color);
        const root = document.documentElement;

        Object.entries(palette).forEach(([shade, hexValue]) => {
            root.style.setProperty(`--color-primary-${shade}`, hexValue);
        });
    };

    return { themeColor, companyName, logos, loading };
};
