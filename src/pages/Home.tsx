
import React from 'react';
import Navbar from '../components/Layout/Navbar';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-medical-blue mb-6">
            บ้านหมอดี
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            บริการตรวจอาการเบื้องต้นออนไลน์ ฟรี ง่าย รวดเร็ว
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-semibold text-medical-blue mb-4">
              ตรวจอาการด้วยตนเองอย่างง่ายดาย
            </h2>
            <p className="text-gray-600 mb-6">
              เลือกอาการที่คุณกำลังประสบอยู่ และรับข้อมูลเกี่ยวกับสาเหตุที่เป็นไปได้ 
              คำแนะนำในการดูแลตนเอง และข้อมูลเกี่ยวกับยาที่อาจช่วยบรรเทาอาการของคุณ
            </p>
            <Link to="/symptom-checker">
              <Button className="bg-medical-blue hover:bg-medical-blue/90 text-white px-8 py-6 text-lg">
                เริ่มตรวจอาการเลย
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium text-medical-blue mb-2">รวดเร็ว</h3>
              <p className="text-gray-600">ใช้เวลาเพียงไม่กี่นาทีในการตรวจสอบอาการ</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium text-medical-blue mb-2">สะดวก</h3>
              <p className="text-gray-600">รับข้อมูลเกี่ยวกับสาเหตุที่เป็นไปได้และคำแนะนำในการดูแลตนเอง</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium text-medical-blue mb-2">ข้อมูลครบถ้วน</h3>
              <p className="text-gray-600">ข้อมูลที่น่าเชื่อถือของโรงพยาบาลชั้นนำในไทย และข้อมูลจากระดับนานาชาติ</p>
            </div>
          </div>
          
          <div className="bg-medical-blue/10 p-6 rounded-lg">
            <p className="text-gray-700 text-sm">
              <strong>คำเตือน:</strong> บ้านหมอดีให้ข้อมูลเบื้องต้นเท่านั้น ไม่ใช่การวินิจฉัยทางการแพทย์
              หากมีอาการรุนแรงหรือกังวล กรุณาพบแพทย์โดยเร็วที่สุด
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

export default Home;
