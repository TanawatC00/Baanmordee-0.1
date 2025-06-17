
export interface Symptom {
  id: string;
  name: string;
  name_en: string | null;
  category: string;
}

export interface SymptomCategory {
  id: string;
  name: string;
  name_en: string | null;
}

export interface SymptomDuration {
  id: string;
  name: string;
  name_en: string | null;
}

export interface Condition {
  id: string;
  name: string;
  name_en: string | null;
  description: string | null;
  description_en: string | null;
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  self_care: string | null;
  self_care_en: string | null;
  medications: string[] | null;
  medications_en: string[] | null;
  seek_medical_attention: boolean;
  urgency: string | null;
  matchCount?: number;
  matchPercentage?: number;
  relevanceScore?: number;
}