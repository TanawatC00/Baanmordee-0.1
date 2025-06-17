import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Symptom } from '@/types/symptom';
import { useLanguage } from '@/contexts/LanguageContext';

interface SelectedSymptomsListProps {
  selectedSymptoms: string[];
  onRemoveSymptom: (id: string) => void;
  symptoms: Symptom[];
}

const SelectedSymptomsList: React.FC<SelectedSymptomsListProps> = ({
  selectedSymptoms,
  onRemoveSymptom,
  symptoms = []
}) => {
  const { t, language } = useLanguage();
  
  if (selectedSymptoms.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-medical-blue/10 rounded-md">
      <h3 className="font-medium mb-2">{t('symptom.selected.title').replace('{count}', selectedSymptoms.length.toString())}</h3>
      <ScrollArea className="max-h-[150px]">
        <div className="flex flex-wrap gap-2">
          {selectedSymptoms.map(id => {
            const symptom = symptoms.find(s => s.id === id);
            return (
              <div key={id} className="bg-white px-3 py-1 rounded-full border border-medical-blue/20 flex items-center">
                <span className="font-medium">
                  {symptom
                    ? (language === 'th' ? symptom.name : (symptom.name_en || symptom.name))
                    : id}
                </span>
                <button 
                  onClick={() => onRemoveSymptom(id)}
                  className="ml-2 text-medical-red hover:text-medical-red/80"
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SelectedSymptomsList;


