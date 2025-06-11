
import { useQuery } from '@tanstack/react-query';
import { getIcdCodeBySymptoms, IcdCondition } from '@/services/IcdService';

export const useIcdData = (selectedSymptoms: string[]) => {
  const { data: icdConditions = [], isLoading } = useQuery({
    queryKey: ['icdConditions', selectedSymptoms],
    queryFn: () => getIcdCodeBySymptoms(selectedSymptoms),
    enabled: selectedSymptoms.length > 0,
  });

  return {
    icdConditions,
    isLoading
  };
};