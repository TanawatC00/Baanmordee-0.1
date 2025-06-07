
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Symptom } from '@/types/symptom';

interface SymptomCardProps {
  symptom: Symptom;
  selected: boolean;
  onToggle: (id: string) => void;
}

const SymptomCard: React.FC<SymptomCardProps> = ({ symptom, selected, onToggle }) => {
  // Split the symptom name into main name and description if it has any
  const parts = symptom.name.split(':');
  const mainName = parts[0].trim();
  const description = parts.length > 1 ? parts[1].trim() : null;

  return (
    <Card 
      className={`cursor-pointer transition-all border ${
        selected 
          ? 'border-medical-blue bg-medical-blue/5' 
          : 'border-gray-200 hover:border-medical-blue/50'
      }`}
      onClick={() => onToggle(symptom.id)}
    >
      <CardContent className="p-4 flex justify-between items-start">
        <div>
          <h4 className="font-medium text-lg">{mainName}</h4>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        <div 
          className={`w-6 h-6 rounded-full border flex items-center justify-center ${
            selected 
              ? 'bg-medical-blue border-medical-blue text-white' 
              : 'border-gray-300'
          }`}
        >
          {selected && <span>✓</span>}
        </div>
      </CardContent>
    </Card>
  );
};

export default SymptomCard;