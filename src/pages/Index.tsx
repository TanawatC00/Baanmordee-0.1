
import React from 'react';
import Navbar from '../components/Layout/Navbar';
import SymptomSelector from '../components/SymptomChecker/SymptomSelector';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-medical-blue mb-4">
              บ้านหมอดี
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              ระบบตรวจสอบอาการเบื้องต้นด้วยตนเอง
            </p>
            <p className="text-sm text-gray-500">
              เลือกอาการที่คุณกำลังประสบ เพื่อรับข้อมูลเกี่ยวกับสาเหตุที่เป็นไปได้และคำแนะนำเบื้องต้น
            </p>
          </div>
          
          <SymptomSelector />
          
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>
              <strong>คำเตือน:</strong> ระบบตรวจสอบอาการนี้ไม่ใช่การวินิจฉัยทางการแพทย์ 
              และไม่สามารถทดแทนการพบแพทย์ได้ กรุณาพบแพทย์หากมีอาการรุนแรงหรือกังวล
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-white shadow-inner py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 บ้านหมอดี - ระบบตรวจสอบอาการเบื้องต้น</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
