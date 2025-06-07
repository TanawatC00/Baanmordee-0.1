
import { supabase } from "@/integrations/supabase/client";
import { Condition, Symptom, SymptomCategory, SymptomDuration } from "@/types/symptom";

// Fetch all symptom categories
export const fetchSymptomCategories = async (): Promise<SymptomCategory[]> => {
  const { data, error } = await supabase
    .from('symptom_categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error("Error fetching symptom categories:", error);
    return [];
  }
  
  return data as SymptomCategory[];
};

// Fetch all symptoms
export const fetchSymptoms = async (): Promise<Symptom[]> => {
  const { data, error } = await supabase
    .from('symptoms')
    .select('*')
    .order('name');
  
  if (error) {
    console.error("Error fetching symptoms:", error);
    return [];
  }
  
  return data as Symptom[];
};

// Fetch all symptom durations
export const fetchSymptomDurations = async (): Promise<SymptomDuration[]> => {
  const { data, error } = await supabase
    .from('symptom_durations')
    .select('*')
    .order('name');
  
  if (error) {
    console.error("Error fetching symptom durations:", error);
    return [];
  }
  
  return data as SymptomDuration[];
};

// Fetch all conditions
export const fetchConditions = async (): Promise<Condition[]> => {
  const { data, error } = await supabase
    .from('conditions')
    .select('*')
    .order('name');
  
  if (error) {
    console.error("Error fetching conditions:", error);
    return [];
  }
  
  return data as Condition[];
};

// Find conditions matching selected symptoms
export const diagnoseConditions = (selectedSymptomIds: string[]): Promise<Condition[]> => {
  if (!selectedSymptomIds.length) return Promise.resolve([]);
  
  return fetchConditions().then(conditions => {
    // Sort conditions by number of matching symptoms (descending)
    return conditions
      .map(condition => {
        const matchingSymptoms = condition.symptoms.filter(id => 
          selectedSymptomIds.includes(id)
        );
        
        // คำนวณคะแนนความเป็นไปได้โดยพิจารณาทั้งจำนวนอาการที่ตรงกันและสัดส่วนของอาการที่ตรงกัน
        const matchCount = matchingSymptoms.length;
        const percentageMatch = Math.round((matchingSymptoms.length / condition.symptoms.length) * 100);
        
        // คำนวณคะแนนรวม โดยให้น้ำหนักทั้งจำนวนอาการที่ตรงกันและเปอร์เซ็นต์ความตรงกัน
        // โรคที่มีอาการตรงกันมากและมีสัดส่วนอาการตรงกันสูงจะได้คะแนนมาก
        const relevanceScore = (matchCount * 0.6) + (percentageMatch * 0.4);
        
        return {
          ...condition,
          matchCount,
          matchPercentage: percentageMatch,
          relevanceScore
        };
      })
      .filter(condition => condition.matchCount > 0) // กรองเฉพาะโรคที่มีอาการตรงกันอย่างน้อย 1 อย่าง
      .sort((a, b) => {
        // เรียงลำดับตามคะแนนความเกี่ยวข้อง (relevance score)
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore! - a.relevanceScore!;
        }
        
        // ถ้าคะแนนเท่ากัน ให้เรียงตามความรุนแรงของโรค
        const severityOrder = { 'severe': 3, 'moderate': 2, 'mild': 1 };
        return severityOrder[b.severity as keyof typeof severityOrder] - 
               severityOrder[a.severity as keyof typeof severityOrder];
      })
      .slice(0, 3); // แสดงเฉพาะ 3 โรคแรกที่มีความเป็นไปได้มากที่สุด
  });
};