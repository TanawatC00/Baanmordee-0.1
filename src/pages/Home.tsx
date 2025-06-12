
import React from 'react';
import Navbar from '../components/Layout/Navbar';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Home = () => {
  const { t, language } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-medical-blue mb-6">
            {language === 'th' ? 'บ้านหมอดี' : 'Doctor at Home'}
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            {t('home.description')}
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-semibold text-medical-blue mb-4">
              {t('home.getStarted')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('home.description')}
            </p>
            <Link to="/symptom-checker">
              <Button className="bg-medical-blue hover:bg-medical-blue/90 text-white px-8 py-6 text-lg">
                {t('home.getStarted')}
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium text-medical-blue mb-2">{t('home.features.symptomChecker')}</h3>
              <p className="text-gray-600">{t('home.features.symptomCheckerDesc')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium text-medical-blue mb-2">{t('home.features.chatbot')}</h3>
              <p className="text-gray-600">{t('home.features.chatbotDesc')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium text-medical-blue mb-2">{t('home.features.hospitalMap')}</h3>
              <p className="text-gray-600">{t('home.features.hospitalMapDesc')}</p>
            </div>
          </div>
          
          <div className="bg-medical-blue/10 p-6 rounded-lg">
            <p className="text-gray-700 text-sm">
              <strong>{t('common.warning')}:</strong> {t('home.disclaimer')}
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

export default Home;
