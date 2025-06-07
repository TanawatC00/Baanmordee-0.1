
export interface Symptom {
    id: string;
    name: string;
    category: string;
  }
  
  export interface SymptomCategory {
    id: string;
    name: string;
  }
  
  export interface SymptomDuration {
    id: string;
    name: string;
  }
  
  export interface Condition {
    id: string;
    name: string;
    description: string | null;
    symptoms: string[];
    severity: 'mild' | 'moderate' | 'severe';
    self_care: string | null;
    medications: string[] | null;
    seek_medical_attention: boolean;
    urgency: string | null;
    matchCount?: number;
    matchPercentage?: number;
  }
  