import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { diagnoseConditions } from '@/services/SymptomService';
import { Condition } from '@/types/symptom';
import DiagnosisResult from './DiagnosisResult';
import CategorySelector from './CategorySelector';
import DurationSelector from './DurationSelector';
import SymptomList from './SymptomList';
import SelectedSymptomsList from './SelectedSymptomsList';
import { useSymptomData } from '@/hooks/useSymptomData';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Remove this interface if CategorySelector defines its own props elsewhere
interface SelectedSymptomsListProps {
  selectedSymptoms: string[];
  onRemoveSymptom: (id: string) => void;
  // other props if any
}

const SymptomSelector: React.FC = () => {
  const { t } = useLanguage();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string>('days');
  const [diagnoses, setDiagnoses] = useState<Condition[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Use custom hook to fetch data
  const { 
    symptoms, 
    categories, 
    durations, 
    isLoading, 
    getCategoryCount,
    getSearchMatchCount,
    filterSymptoms 
  } = useSymptomData();

  // Function to remove a symptom from the selectedSymptoms array
  const onRemoveSymptom = (id: string) => {
    setSelectedSymptoms(prev => prev.filter(symptomId => symptomId !== id));
  };

  const handleSymptomToggle = (id: string) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(id)) {
        return prev.filter(symptomId => symptomId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleDiagnose = async () => {
    try {
      const results = await diagnoseConditions(selectedSymptoms);
      setDiagnoses(results);
      setShowResults(true);
    } catch (error) {
      console.error("Error diagnosing conditions:", error);
      toast({
        title: t('symptom.error.title'),
        description: t('symptom.error.diagnose'),
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setSelectedDuration('days');
    setDiagnoses([]);
    setShowResults(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-blue mb-4 mx-auto"></div>
          <p className="text-medical-blue">{t('symptom.loading')}</p>
        </div>
      </div>
    );
  }

  // Get filtered symptoms based on category and search
  const filteredSymptoms = filterSymptoms(activeCategory, searchQuery);
  const searchMatchCount = getSearchMatchCount(searchQuery);

  if (showResults) {
    return (
      <div className="mt-6">
        <DiagnosisResult 
          diagnoses={diagnoses} 
          selectedSymptoms={selectedSymptoms}
          duration={selectedDuration}
          onReset={handleReset}
        />
      </div>
    );
  }

  return (
    <div className="mt-6">
      <Card className="border-medical-blue/20">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold text-medical-blue mb-4">{t('symptom.selector.title')}</h2>
          
          <DurationSelector 
            selectedDuration={selectedDuration}
            onDurationChange={setSelectedDuration}
          />
          
          <div className="mb-4">
            <div className="relative mb-4">
              <Input 
                placeholder={t('symptom.search.placeholder')} 
                className="w-full pl-10" 
                value={searchQuery}
                onChange={handleSearch}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              {searchQuery && (
                <div className="text-xs text-gray-500 mt-1">
                  {t('symptom.search.results').replace('{count}', searchMatchCount.toString())}
                </div>
              )}
            </div>
            
            <CategorySelector
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              categories={categories}
              getCategoryCount={getCategoryCount}
            />
          </div>

          <SymptomList 
            filteredSymptoms={filteredSymptoms}
            selectedSymptoms={selectedSymptoms}
            handleSymptomToggle={handleSymptomToggle}
          />

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleReset} className="border-medical-red text-medical-red hover:bg-medical-red/10">
              {t('symptom.clear')}
            </Button>
            <Button 
              onClick={handleDiagnose} 
              disabled={selectedSymptoms.length === 0}
              className="bg-medical-blue hover:bg-medical-blue/90 text-white"
            >
              {t('symptom.analyze')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <SelectedSymptomsList
        selectedSymptoms={selectedSymptoms}
        onRemoveSymptom={onRemoveSymptom}
        symptoms={symptoms}
      />
    </div>
  );
};

export default SymptomSelector;