
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IcdCondition } from '@/services/IcdService';
import { useLanguage } from '@/contexts/LanguageContext';

interface IcdReferenceProps {
  icdConditions: IcdCondition[];
}

const IcdReference: React.FC<IcdReferenceProps> = ({ icdConditions }) => {
  const { t } = useLanguage();
  
  if (!icdConditions.length) return null;

  return (
    <Card className="border-medical-green/20 bg-medical-green/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-medical-green">
            {t('icd.title')}
          </h3>
          <Badge variant="outline" className="text-xs">
            {t('icd.subtitle')}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          {t('icd.description')}
        </p>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-3">
          {icdConditions.map((condition, index) => (
            <div key={`${condition.code}-${index}`} className="p-3 bg-white rounded-md border border-medical-green/10">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {condition.code}
                  </Badge>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    condition.severity === 'severe' ? 'bg-red-100 text-red-700' :
                    condition.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {condition.severity === 'severe' ? t('icd.severity.severe') :
                     condition.severity === 'moderate' ? t('icd.severity.moderate') : t('icd.severity.mild')}
                  </span>
                </div>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">
                {condition.description}
              </h4>
              <p className="text-sm text-gray-600">
                {t('icd.category')} {condition.category}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-xs text-blue-700">
            <strong>{t('icd.note')}</strong> {t('icd.noteText')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default IcdReference;