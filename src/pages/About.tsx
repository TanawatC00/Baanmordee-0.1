
import React from 'react';
import Navbar from '../components/Layout/Navbar';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";

const About = () => {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
  
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-medical-blue mb-4">
                เกี่ยวกับบ้านหมอดี
              </h1>
              <p className="text-lg text-gray-600">
               เรียนรู้เพิ่มเติมเกี่ยวกับแอปพลิเคชันตรวจสอบอาการของเรา
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
             <Card>
               <CardHeader className="bg-medical-blue/5 pb-2">
                 <h2 className="text-xl font-semibold text-medical-blue">เกี่ยวกับโครงการ</h2>
               </CardHeader>
               <CardContent className="pt-4">
                 <p className="mb-4">
                   บ้านหมอดีเป็นแอปพลิเคชันที่ออกแบบมาเพื่อช่วยให้ผู้ใช้งานสามารถตรวจสอบอาการเบื้องต้นได้ด้วยตนเอง 
                   โดยมีวัตถุประสงค์เพื่อให้ข้อมูลและแนวทางเบื้องต้น ไม่ใช่เพื่อทดแทนการวินิจฉัยโดยแพทย์
                 </p>
                 <p>
                   แอปพลิเคชันนี้เหมาะสำหรับผู้ที่ต้องการเรียนรู้เพิ่มเติมเกี่ยวกับอาการของตนเองก่อนที่จะตัดสินใจพบแพทย์ 
                   หรือเพื่อรับข้อมูลเพิ่มเติมเกี่ยวกับการดูแลตนเองเบื้องต้น
                 </p>
                </CardContent>
             </Card>

             <Card>
               <CardHeader className="bg-medical-blue/5 pb-2">
                 <h2 className="text-xl font-semibold text-medical-blue">วิธีการใช้งาน</h2>
               </CardHeader>
               <CardContent className="pt-4">
                 <p className="mb-3">การใช้งานแอปพลิเคชันตรวจสอบอาการของเรามีขั้นตอนดังนี้:</p>
                 <ol className="list-decimal list-inside space-y-2">
                   <li>เลือกอาการที่คุณกำลังประสบ</li>
                   <li>ระบุระยะเวลาที่มีอาการ</li>
                   <li>รับผลการวิเคราะห์เบื้องต้นและคำแนะนำ</li>
                 </ol>
                 <div className="mt-4">
                   <Link 
                     to="/symptom-checker" 
                     className="inline-block bg-medical-blue text-white px-4 py-2 rounded hover:bg-medical-blue/90 transition-colors"
                   >
                     ไปที่ตัวตรวจสอบอาการ
                   </Link>
                 </div>
               </CardContent>
             </Card>
           </div>

           <Card className="mb-10">
             <CardHeader className="bg-medical-blue/5 pb-2">
               <h2 className="text-xl font-semibold text-medical-blue">แหล่งข้อมูลอ้างอิง</h2>
             </CardHeader>
             <CardContent className="pt-4">
               <p className="mb-4">ข้อมูลทางการแพทย์ในแอปพลิเคชันนี้อ้างอิงจากแหล่งข้อมูลที่น่าเชื่อถือ รวมถึง:</p>
               
               <div className="space-y-4">
                 <div className="p-4 bg-gray-50 rounded-md">
                   <h3 className="font-medium mb-2">ข้อมูลโรค:</h3>
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
                     <li>องค์การอนามัยโลก (World Health Organization)</li>
                     <li>กรมควบคุมโรค (Centers for Disease Control and Prevention)</li>
                   </ul>
                 </div>
                 
                 <div className="p-4 bg-gray-50 rounded-md">
                   <h3 className="font-medium mb-2">ข้อมูลยา:</h3>
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
                     <li>ข้อมูลจากแพทยสภา และสภาเภสัชกรรม</li>
                   </ul>
                 </div>
               </div>
               
               <div className="mt-6 p-4 bg-medical-orange/10 rounded-md">
                 <p className="text-medical-orange font-medium">
                   คำเตือน: ข้อมูลนี้มีวัตถุประสงค์เพื่อการวินิจฉัยเบื้องต้นเท่านั้น ไม่ใช่การวินิจฉัยทางการแพทย์ โปรดปรึกษาแพทย์หากคุณมีข้อกังวลเกี่ยวกับสุขภาพ
                 </p>
               </div>
             </CardContent>
           </Card>
           
           <Card>
             <CardHeader className="bg-medical-blue/5 pb-2">
               <h2 className="text-xl font-semibold text-medical-blue">ทีมผู้พัฒนา</h2>
             </CardHeader>
             <CardContent className="pt-4">
               <div className="space-y-6">
                 <div className="bg-gray-50 p-4 rounded-md">
                   <h3 className="font-medium text-lg mb-2">ทีมพัฒนาซอฟต์แวร์</h3>
                   <p>
                     แอปพลิเคชันนี้พัฒนาโดยนักเรียนที่มีความสนใจทางด้านการพัฒนาโปรแกรม และต้องการให้สามารถนำไปใช้ประโยชน์ได้  <br />
                        โดยประกอบไปด้วย:<br />
                     <strong>นายธนวัฒน์ ฉายศิริวัฒนา</strong><br />
                     <strong>นางสาวชยิสรา ไชยศักดิ์</strong>
                    </p>
                 </div>
                 
                 <div className="bg-gray-50 p-4 rounded-md">
                   <h3 className="font-medium text-lg mb-2">ที่ปรึกษาทางการแพทย์</h3>
                   <p>
                     ข้อมูลทางการแพทย์ในแอปพลิเคชันนี้ได้รับจากเว็บไซต์ทางการแพทย์ที่เชื่อถือได้ของไทยและระดับสากล เพื่อให้มั่นใจในความถูกต้องและความเหมาะสม 
                     อย่างไรก็ตาม โปรดทราบว่าข้อมูลนี้ไม่สามารถทดแทนคำแนะนำทางการแพทย์โดยตรงจากแพทย์ได้
                   </p>
                 </div>
                 
                 <div className="bg-gray-50 p-4 rounded-md">
                   <h3 className="font-medium text-lg mb-2">ติดต่อเรา</h3>
                   <p>
                     หากคุณมีคำถาม ข้อเสนอแนะ หรือต้องการรายงานปัญหาเกี่ยวกับแอปพลิเคชัน โปรดติดต่อเราทางอีเมล: Tanawat.C@pccst.ac.th
                   </p>
                 </div>
               </div>
               
               <div className="mt-6 text-center text-gray-500 text-sm">
                 <p>© 2025 บ้านหมอดี - ระบบตรวจสอบอาการเบื้องต้น</p>
               </div>
             </CardContent>
             </Card>
         </div>
       </main>
       </div>
   );
 };
 
 export default About;