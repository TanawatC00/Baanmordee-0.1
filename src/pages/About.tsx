import React from 'react';
import Navbar from '../components/Layout/Navbar';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
  
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-medical-blue mb-4">
                {t('about.title')}
              </h1>
              <p className="text-lg text-gray-600">
               {t('about.subtitle')}
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
             <Card>
               <CardHeader className="bg-medical-blue/5 pb-2">
                 <h2 className="text-xl font-semibold text-medical-blue">{t('about.aboutProject')}</h2>
               </CardHeader>
               <CardContent className="pt-4">
                 <p className="mb-4">
                   {t('about.projectDescription1')}
                 </p>
                 <p>
                   {t('about.projectDescription2')}
                 </p>
                </CardContent>
             </Card>

             <Card>
               <CardHeader className="bg-medical-blue/5 pb-2">
                 <h2 className="text-xl font-semibold text-medical-blue">{t('about.howToUse')}</h2>
               </CardHeader>
               <CardContent className="pt-4">
                 <p className="mb-3">{t('about.usageDescription')}:</p>
                 <ol className="list-decimal list-inside space-y-2">
                  <li>{t('about.step1')}</li>
                  <li>{t('about.step2')}</li>
                  <li>{t('about.step3')}</li>
                 </ol>
                 <div className="mt-4">
                   <Link 
                     to="/symptom-checker" 
                     className="inline-block bg-medical-blue text-white px-4 py-2 rounded hover:bg-medical-blue/90 transition-colors"
                   >
                     {t('about.goToChecker')}
                   </Link>
                 </div>
               </CardContent>
             </Card>
           </div>

           <Card className="mb-10">
             <CardHeader className="bg-medical-blue/5 pb-2">
               <h2 className="text-xl font-semibold text-medical-blue">{t('about.references')}</h2>
             </CardHeader>
             <CardContent className="pt-4">
               <p className="mb-4">{t('about.referencesDescription')}:</p>
               
               <div className="space-y-4">
                 <div className="p-4 bg-gray-50 rounded-md">
                   <h3 className="font-medium mb-2">{t('about.diseaseData')}:</h3>
                   <ul className="list-disc list-inside space-y-1">
                     <li>
                       <a 
                         href="https://www.icd10data.com/ICD10CM/Codes" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-medical-blue hover:underline"
                       >
                         ICD-10-CM (International Classification of Diseases, 10th Revision, Clinical Modification)
                       </a>
                     </li>
                     <li>{t('about.who')}</li>
                     <li>{t('about.cdc')}</li>
                   </ul>
                 </div>
                 
                 <div className="p-4 bg-gray-50 rounded-md">
                   <h3 className="font-medium mb-2">{t('about.drugData')}:</h3>
                   <ul className="list-disc list-inside space-y-1">
                     <li>
                       <a 
                         href="https://lhncbc.nlm.nih.gov/RxNav/APIs/RxNormAPIs.html" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-medical-blue hover:underline"
                       >
                         RxNorm API (National Library of Medicine)
                       </a>
                     </li>
                     <li>{t('about.medicalCouncil')}</li>
                   </ul>
                 </div>
               </div>
               
               <div className="mt-6 p-4 bg-medical-orange/10 rounded-md">
                 <p className="text-medical-orange font-medium">
                   {t('about.disclaimer')}
                 </p>
               </div>
             </CardContent>
           </Card>
           
           <Card>
             <CardHeader className="bg-medical-blue/5 pb-2">
               <h2 className="text-xl font-semibold text-medical-blue">{t('about.team')}</h2>
             </CardHeader>
             <CardContent className="pt-4">
               <div className="space-y-6">
                 <div className="bg-gray-50 p-4 rounded-md">
                   <h3 className="font-medium text-lg mb-2">{t('about.devTeam')}</h3>
                   <div
                     className="text-gray-700"
                     dangerouslySetInnerHTML={{ __html: t('about.devTeamDescription') }}
                   />
                 </div>
                 
                 <div className="bg-gray-50 p-4 rounded-md">
                   <h3 className="font-medium text-lg mb-2">{t('about.medicalAdvisor')}</h3>
                   <p>
                     {t('about.medicalAdvisorDescription')}
                   </p>
                 </div>
                 
                 <div className="bg-gray-50 p-4 rounded-md">
                   <h3 className="font-medium text-lg mb-2">{t('about.contact')}</h3>
                   <p>
                     {t('about.contactDescription')}
                   </p>
                 </div>
               </div>
               
               <div className="mt-6 text-center text-gray-500 text-sm">
                 <p>{t('footer.copyright')}</p>
               </div>
             </CardContent>
             </Card>
         </div>
       </main>
       </div>
   );
 };
 
 export default About;