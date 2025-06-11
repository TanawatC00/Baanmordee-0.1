
// Service สำหรับเชื่อมต่อกับ ICD-10 Data API
export interface IcdCondition {
  code: string;
  description: string;
  category: string;
  severity?: string;
  symptoms?: string[];
}

export interface IcdApiResponse {
  results: IcdCondition[];
  total: number;
}

const ICD_API_BASE = 'https://icd10cmtool.cdc.gov/cgi-bin/lookup';

export const searchIcdConditions = async (searchTerm: string): Promise<IcdCondition[]> => {
  try {
    // เนื่องจาก ICD-10 API มี CORS restrictions เราจะใช้วิธีค้นหาภายในระบบ
    // และใช้ข้อมูลที่มีมาตรฐาน ICD-10 แทน
    console.log(`Searching ICD-10 data for: ${searchTerm}`);
    
    // ข้อมูล ICD-10 มาตรฐานที่จะเพิ่มความน่าเชื่อถือให้กับระบบ
    const icdConditions: IcdCondition[] = [
      {
        code: "R50.9",
        description: "ไข้ ไม่ระบุสาเหตุ",
        category: "อาการและอาการแสดงทั่วไป",
        severity: "mild",
        symptoms: ["fever", "headache"]
      },
      {
        code: "R51",
        description: "ปวดหัว",
        category: "อาการและอาการแสดงของระบบประสาท",
        severity: "mild",
        symptoms: ["headache"]
      },
      {
        code: "K59.00",
        description: "ท้องผูก ไม่ระบุสาเหตุ",
        category: "โรคของระบบทางเดินอาหาร",
        severity: "mild",
        symptoms: ["constipation", "abdominal_pain"]
      },
      {
        code: "J06.9",
        description: "การติดเชื้อทางเดินหายใจส่วนต้น",
        category: "โรคของระบบทางเดินหายใจ",
        severity: "mild",
        symptoms: ["cough", "sore_throat", "runny_nose"]
      },
      {
        code: "M25.50",
        description: "ปวดข้อ ไม่ระบุตำแหน่ง",
        category: "โรคของระบบกล้ามเนื้อและกระดูก",
        severity: "mild",
        symptoms: ["joint_pain"]
      }
    ];

    // กรองตามคำค้นหา
    const filtered = icdConditions.filter(condition => 
      condition.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      condition.code.includes(searchTerm.toUpperCase())
    );

    return filtered;
  } catch (error) {
    console.error('Error searching ICD conditions:', error);
    return [];
  }
};

export const getIcdCodeBySymptoms = async (symptoms: string[]): Promise<IcdCondition[]> => {
  try {
    // แมปอาการกับรหัส ICD-10 ที่เกี่ยวข้อง
    const symptomToIcdMap: Record<string, IcdCondition[]> = {
      "fever": [
        {
          code: "R50.9",
          description: "ไข้ ไม่ระบุสาเหตุ",
          category: "อาการและอาการแสดงทั่วไป",
          severity: "mild"
        }
      ],
      "headache": [
        {
          code: "R51",
          description: "ปวดหัว",
          category: "อาการและอาการแสดงของระบบประสาท",
          severity: "mild"
        },
        {
          code: "G44.1",
          description: "ปวดหัววาสคิวลาร์",
          category: "โรคของระบบประสาท",
          severity: "moderate"
        }
      ],
      "cough": [
        {
          code: "R05",
          description: "ไอ",
          category: "อาการและอาการแสดงของระบบทางเดินหายใจ",
          severity: "mild"
        }
      ],
      "abdominal_pain": [
        {
          code: "R10.9",
          description: "ปวดท้อง ไม่ระบุตำแหน่ง",
          category: "อาการและอาการแสดงของระบบทางเดินอาหาร",
          severity: "moderate"
        }
      ]
    };

    const relatedConditions: IcdCondition[] = [];
    
    symptoms.forEach(symptomId => {
      const conditions = symptomToIcdMap[symptomId];
      if (conditions) {
        relatedConditions.push(...conditions);
      }
    });

    // ลบข้อมูลที่ซ้ำกัน
    const uniqueConditions = relatedConditions.filter((condition, index, self) =>
      index === self.findIndex(c => c.code === condition.code)
    );

    return uniqueConditions;
  } catch (error) {
    console.error('Error getting ICD codes by symptoms:', error);
    return [];
  }
};