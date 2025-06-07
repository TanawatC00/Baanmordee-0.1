
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

const SymptomSelector: React.FC = () => {
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

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptomId)) {
        return prev.filter(id => id !== symptomId);
      } else {
        return [...prev, symptomId];
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
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถวิเคราะห์อาการได้ กรุณาลองใหม่อีกครั้ง",
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
          <p className="text-medical-blue">กำลังโหลดข้อมูล...</p>
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
          <h2 className="text-2xl font-semibold text-medical-blue mb-4">เลือกอาการที่คุณกำลังประสบ</h2>
          
          <DurationSelector 
            durations={durations}
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
          />
          
          <div className="mb-4">
            <div className="relative mb-4">
              <Input 
                placeholder="ค้นหาอาการ..." 
                className="w-full pl-10" 
                value={searchQuery}
                onChange={handleSearch}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              {searchQuery && (
                <div className="text-xs text-gray-500 mt-1">
                  พบ {searchMatchCount} อาการที่ตรงกับการค้นหา
                </div>
              )}
            </div>
            
            <CategorySelector
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
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
              ล้างค่า
            </Button>
            <Button 
              onClick={handleDiagnose} 
              disabled={selectedSymptoms.length === 0}
              className="bg-medical-blue hover:bg-medical-blue/90 text-white"
            >
              วิเคราะห์อาการ
            </Button>
          </div>
        </CardContent>
      </Card>

      <SelectedSymptomsList 
        selectedSymptoms={selectedSymptoms}
        symptoms={symptoms}
        handleSymptomToggle={handleSymptomToggle}
      />
    </div>
  );
};

export default SymptomSelector;