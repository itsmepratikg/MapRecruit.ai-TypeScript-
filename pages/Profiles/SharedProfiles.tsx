
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Share2 } from '../../components/Icons';
import { PlaceholderPage } from '../../components/PlaceholderPage';

export const SharedProfiles = () => {
  const { t } = useTranslation();
  return (
    <PlaceholderPage
      title={t("Shared Profiles")}
      description={t("View profiles that have been shared with you by other team members or departments.")}
      icon={Share2}
    />
  );
};
