import React from 'react';
import { Button } from "@/components/ui/button";
import { SymptomDuration } from '@/types/symptom';
import { useLanguage } from '@/contexts/LanguageContext';

interface DurationSelectorProps {
  selectedDuration: string;
  onDurationChange: (duration: string) => void;
}

const durations = [
  { id: 'less_than_a_day', key: 'symptom.duration.less_than_a_day' },
  { id: '1 week', key: 'symptom.duration.week' },
  { id: 'more_than_a_week', key: 'symptom.duration.more_than_a_week' },
];

const DurationSelector: React.FC<DurationSelectorProps> = ({ 
  selectedDuration, 
  onDurationChange 
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">{t('symptom.duration.title')}</h3>
      <div className="flex flex-wrap gap-2">
        {durations.map((duration) => (
          <Button
            key={duration.id}
            variant={selectedDuration === duration.id ? "default" : "outline"}
            className={selectedDuration === duration.id ? "bg-medical-blue" : ""}
            onClick={() => onDurationChange(duration.id)}
          >
            {t(duration.key)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DurationSelector;