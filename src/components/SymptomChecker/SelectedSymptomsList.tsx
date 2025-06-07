
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Symptom } from '@/types/symptom';

interface SelectedSymptomsListProps {
  selectedSymptoms: string[];
  symptoms: Symptom[];
  handleSymptomToggle: (id: string) => void;
}

const SelectedSymptomsList: React.FC<SelectedSymptomsListProps> = ({ 
  selectedSymptoms, 
  symptoms, 
  handleSymptomToggle 
}) => {
  if (selectedSymptoms.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-medical-blue/10 rounded-md">
      <h3 className="font-medium mb-2">อาการที่เลือก ({selectedSymptoms.length}):</h3>
      <ScrollArea className="max-h-[150px]">
        <div className="flex flex-wrap gap-2">
          {selectedSymptoms.map(id => {
            const symptom = symptoms.find(s => s.id === id);
            return (
              <div key={id} className="bg-white px-3 py-1 rounded-full border border-medical-blue/20 flex items-center">
                <span>{symptom?.name.split(':')[0]}</span>
                <button 
                  onClick={() => handleSymptomToggle(id)}
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