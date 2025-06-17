
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Symptom } from '@/types/symptom';
import SymptomCard from './SymptomCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface SymptomListProps {
  filteredSymptoms: Symptom[];
  selectedSymptoms: string[];
  handleSymptomToggle: (id: string) => void;
}

const SymptomList: React.FC<SymptomListProps> = ({ 
  filteredSymptoms, 
  selectedSymptoms, 
  handleSymptomToggle 
}) => {
  const { t } = useLanguage();
  
  if (filteredSymptoms.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>{t('symptom.noResults')}</p>
        <p className="text-sm mt-2">{t('symptom.noResultsDesc')}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6 p-1">
        {filteredSymptoms.map(symptom => (
          <SymptomCard 
            key={symptom.id} 
            symptom={symptom} 
            selected={selectedSymptoms.includes(symptom.id)}
            onToggle={handleSymptomToggle}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default SymptomList;