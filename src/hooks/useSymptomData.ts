
import { useQuery } from '@tanstack/react-query';
import { 
  fetchSymptoms, 
  fetchSymptomCategories, 
  fetchSymptomDurations 
} from '@/services/SymptomService';
import { SymptomCategory, Symptom } from '@/types/symptom';
import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const useSymptomData = () => {
  const { language } = useLanguage();
  
  // Fetch data using react-query
  const { data: symptoms = [], isLoading: symptomsLoading } = useQuery({
    queryKey: ['symptoms'],
    queryFn: fetchSymptoms
  });

  const { data: dbCategories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['symptomCategories'],
    queryFn: fetchSymptomCategories
  });

  const { data: durations = [], isLoading: durationsLoading } = useQuery({
    queryKey: ['symptomDurations'],
    queryFn: fetchSymptomDurations
  });

  // Helper function to get display name based on language
  const getDisplayName = (item: { name: string; name_en?: string | null }) => {
    if (language === 'en' && item.name_en) {
      return item.name_en;
    }
    return item.name;
  };

  // Filter out categories that have no symptoms
  const nonEmptyCategories = useMemo(() => 
    dbCategories.filter(category => 
      symptoms.some(symptom => symptom.category === category.id)
    ),
    [dbCategories, symptoms]
  );

  // Add "All" category as the first option
  const categories = useMemo(() => {
    const allCategory: SymptomCategory = { 
      id: 'all', 
      name: 'ทั้งหมด',
      name_en: 'All'
    };
    return [allCategory, ...nonEmptyCategories];
  }, [nonEmptyCategories]);

  const isLoading = symptomsLoading || categoriesLoading || durationsLoading;

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') {
      return symptoms.length;
    }
    return symptoms.filter(s => s.category === categoryId).length;
  };

  // Function to get symptom count by searchQuery
  const getSearchMatchCount = (searchQuery: string) => {
    if (!searchQuery) return symptoms.length;
    return symptoms.filter(symptom => {
      const displayName = getDisplayName(symptom);
      return displayName.toLowerCase().includes(searchQuery.toLowerCase());
    }).length;
  };

  // Get symptoms by category and search terms
  const filterSymptoms = (categoryId: string, searchQuery: string): Symptom[] => {
    // Handle case where the category might have been deleted/merged
    const categoryExists = categoryId === 'all' || 
      categories.some(c => c.id === categoryId);
    
    const effectiveCategoryId = categoryExists ? categoryId : 'all';
    
    return symptoms.filter(symptom => {
      const displayName = getDisplayName(symptom);
      return (effectiveCategoryId === 'all' || symptom.category === effectiveCategoryId) &&
        (searchQuery === '' || displayName.toLowerCase().includes(searchQuery.toLowerCase()));
    });
  };

  return {
    symptoms,
    categories,
    durations,
    isLoading,
    getCategoryCount,
    getSearchMatchCount,
    filterSymptoms,
    getDisplayName
  };
};