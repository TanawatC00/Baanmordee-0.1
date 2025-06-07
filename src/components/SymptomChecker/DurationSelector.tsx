
import React from 'react';
import { Button } from "@/components/ui/button";
import { SymptomDuration } from '@/types/symptom';

interface DurationSelectorProps {
  durations: SymptomDuration[];
  selectedDuration: string;
  setSelectedDuration: (id: string) => void;
}

const DurationSelector: React.FC<DurationSelectorProps> = ({ 
  durations, 
  selectedDuration, 
  setSelectedDuration 
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">ระยะเวลาของอาการ:</h3>
      <div className="flex flex-wrap gap-2">
        {durations.map((duration: SymptomDuration) => (
          <Button
            key={duration.id}
            variant={selectedDuration === duration.id ? "default" : "outline"}
            className={selectedDuration === duration.id ? "bg-medical-blue" : ""}
            onClick={() => setSelectedDuration(duration.id)}
          >
            {duration.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DurationSelector;