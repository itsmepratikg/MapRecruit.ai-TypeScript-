
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart } from '../../components/Icons';
import { PlaceholderPage } from '../../components/PlaceholderPage';

export const FavoriteProfiles = () => {
  const { t } = useTranslation();
  return (
    <PlaceholderPage
      title={t("Favorite Profiles")}
      description={t("Access your bookmarked and starred candidates for quick reference.")}
      icon={Heart}
    />
  );
};
