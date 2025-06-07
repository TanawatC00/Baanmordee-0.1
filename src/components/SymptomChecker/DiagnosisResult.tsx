
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useQuery } from '@tanstack/react-query';
import { fetchSymptoms, fetchSymptomDurations } from '@/services/SymptomService';
import { type Condition } from '@/types/symptom';

interface DiagnosisResultProps {
  diagnoses: Condition[];
  selectedSymptoms: string[];
  duration?: string;
  onReset: () => void;
}

const DiagnosisResult: React.FC<DiagnosisResultProps> = ({ 
  diagnoses, 
  selectedSymptoms,
  duration,
  onReset 
}) => {
  // Get symptoms and durations data
  const { data: symptoms = [] } = useQuery({
    queryKey: ['symptoms'],
    queryFn: fetchSymptoms
  });
  
  const { data: symptomDurations = [] } = useQuery({
    queryKey: ['symptomDurations'],
    queryFn: fetchSymptomDurations
  });
  
  // Get names of selected symptoms for display
  const selectedSymptomNames = selectedSymptoms.map(id => 
    symptoms.find(s => s.id === id)?.name.split(':')[0] || id
  );
  
  // Get duration name
  const durationName = symptomDurations.find(d => d.id === duration)?.name || '';
  
  // แสดงเพียง 2-3 โรคที่มีความเป็นไปได้มากที่สุด
  const topDiagnoses = diagnoses.slice(0, Math.min(3, diagnoses.length));
  
  // Check if any severe conditions are present in top diagnoses
  const hasSevereCondition = topDiagnoses.some(d => 
    d.severity === 'severe' || d.urgency === 'immediate'
  );

  return (
    <div className="space-y-6">
      {hasSevereCondition && (
        <Alert variant="destructive" className="border-medical-red/50 bg-medical-red/10">
          <AlertTitle className="text-medical-red font-bold text-lg">
            คำเตือน: กรุณาพบแพทย์โดยเร็วที่สุด
          </AlertTitle>
          <AlertDescription className="mt-2">
            อาการของคุณอาจบ่งชี้ถึงภาวะที่อันตราย ควรพบแพทย์หรือไปห้องฉุกเฉินโดยเร็วที่สุด
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-medical-blue/20">
        <CardHeader className="bg-medical-blue/5 pb-2">
          <h2 className="text-2xl font-semibold text-medical-blue">ผลการวิเคราะห์อาการเบื้องต้น</h2>
          <p className="text-sm text-gray-500 mt-1">
            ข้อมูลนี้เป็นเพียงการวิเคราะห์เบื้องต้น ไม่สามารถทดแทนการวินิจฉัยโดยแพทย์ได้
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">ข้อมูลอาการ:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm text-gray-500 mb-1">อาการที่เลือก:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptomNames.map((name, index) => (
                    <span key={index} className="bg-medical-blue/10 px-3 py-1 rounded-full text-medical-blue">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              
              {duration && (
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">ระยะเวลาของอาการ:</h4>
                  <span className="bg-medical-green/10 px-3 py-1 rounded-full text-medical-green inline-block">
                    {durationName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {topDiagnoses.length === 0 ? (
            <div className="p-6 text-center bg-gray-50 rounded-md">
              <p className="text-gray-600">
                ไม่พบความเชื่อมโยงกับโรคในฐานข้อมูลของเรา กรุณาเลือกอาการเพิ่มเติมหรือปรึกษาแพทย์
              </p>
            </div>
          ) : (
            <div className="space-y-6 mt-4">
              <h3 className="text-lg font-medium">ภาวะที่เป็นไปได้ ({topDiagnoses.length} รายการ):</h3>
              
              {topDiagnoses.map((condition, index) => {
                const severityColor = 
                  condition.severity === 'severe' ? 'bg-medical-red/10 border-medical-red/30' :
                  condition.severity === 'moderate' ? 'bg-medical-orange/10 border-medical-orange/30' :
                  'bg-medical-green/10 border-medical-green/30';
                
                const matchConfidence = index === 0 
                  ? 'มีความเป็นไปได้สูง' 
                  : index === 1 
                    ? 'มีความเป็นไปได้ปานกลาง' 
                    : 'อาจเป็นไปได้';
                
                return (
                  <div 
                    key={condition.id} 
                    className={`p-4 rounded-md border ${severityColor}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-semibold">{condition.name}</h4>
                      <div className="text-sm px-2 py-1 rounded-full bg-white border">
                        {matchConfidence}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{condition.description}</p>
                    
                    {condition.self_care && (
                      <div className="mb-3">
                        <h5 className="font-medium mb-1">การดูแลตนเอง:</h5>
                        <p className="text-gray-700">{condition.self_care}</p>
                      </div>
                    )}
                    
                    {condition.medications && condition.medications.length > 0 && (
                      <div className="mb-3">
                        <h5 className="font-medium mb-1">ยาที่อาจช่วยบรรเทาอาการ:</h5>
                        <ul className="list-disc list-inside text-gray-700">
                          {condition.medications.map((med, i) => (
                            <li key={i}>{med}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {condition.seek_medical_attention && (
                      <div className={`mt-4 p-3 rounded-md ${
                        condition.urgency === 'immediate' ? 'bg-medical-red/20 text-medical-red' :
                        condition.urgency === 'soon' ? 'bg-medical-orange/20 text-medical-orange' :
                        'bg-medical-blue/20 text-medical-blue'
                      }`}>
                        <p className="font-medium">
                          {condition.urgency === 'immediate' 
                            ? '⚠️ ควรพบแพทย์โดยด่วน หรือไปห้องฉุกเฉินทันที'
                            : condition.urgency === 'soon'
                            ? '⚠️ ควรไปพบแพทย์เร็วที่สุดเท่าที่จะเป็นไปได้'
                            : '👨‍⚕️ ควรปรึกษาแพทย์เมื่อมีโอกาส'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-8 text-center">
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="text-gray-700 italic">
                คำเตือน: ข้อมูลนี้มีวัตถุประสงค์เพื่อการศึกษาเท่านั้น ไม่ใช่การวินิจฉัยทางการแพทย์ 
                โปรดปรึกษาแพทย์หากคุณมีข้อกังวลเกี่ยวกับสุขภาพ
              </p>
            </div>
            <Button onClick={onReset} className="bg-medical-blue hover:bg-medical-blue/90 text-white">
              ตรวจสอบอาการอีกครั้ง
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosisResult;