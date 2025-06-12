
import React from 'react';
import Navbar from '../components/Layout/Navbar';
import SymptomSelector from '../components/SymptomChecker/SymptomSelector';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t, language } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-medical-blue mb-4">
              {language === 'th' ? 'บ้านหมอดี' : 'Doctor at Home'}
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              {t('symptom.title')}
            </p>
            <p className="text-sm text-gray-500">
              {t('symptom.description')}
            </p>
          </div>
          
          <SymptomSelector />
          
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>
              <strong>{t('common.warning')}:</strong> {t('symptom.disclaimer')}
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-white shadow-inner py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>{t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;