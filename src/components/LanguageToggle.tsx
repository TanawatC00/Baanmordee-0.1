
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  
  const toggleLanguage = (checked: boolean) => {
    setLanguage(checked ? 'en' : 'th');
  };

  return (
    <div className="flex items-center space-x-3">
      <span className={`text-sm font-medium transition-colors ${language === 'th' ? 'text-medical-blue' : 'text-gray-500'}`}>
        TH
      </span>
      <Switch
        checked={language === 'en'}
        onCheckedChange={toggleLanguage}
        className="data-[state=checked]:bg-medical-blue"
      />
      <span className={`text-sm font-medium transition-colors ${language === 'en' ? 'text-medical-blue' : 'text-gray-500'}`}>
        EN
      </span>
    </div>
  );
};

export default LanguageToggle;