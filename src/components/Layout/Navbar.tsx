
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-medical-blue flex items-center">
          <span className="text-medical-blue">บ้าน</span>
          <span className="text-medical-green">หมอ</span>
          <span className="text-medical-blue">ดี</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link 
            to="/" 
            className={`${location.pathname === '/' ? 'text-medical-blue font-medium' : 'text-gray-700 hover:text-medical-blue'} transition`}
          >
            หน้าหลัก
          </Link>
          <Link 
            to="/symptom-checker" 
            className={`${location.pathname === '/symptom-checker' ? 'text-medical-blue font-medium' : 'text-gray-700 hover:text-medical-blue'} transition`}
          >
            ตรวจอาการ
          </Link>
          <Link 
            to="/chatbot" 
            className={`${location.pathname === '/chatbot' ? 'text-medical-blue font-medium' : 'text-gray-700 hover:text-medical-blue'} transition`}
          >
            แชทบอท
          </Link>
          <Link 
            to="/hospital-map" 
            className={`${location.pathname === '/hospital-map' ? 'text-medical-blue font-medium' : 'text-gray-700 hover:text-medical-blue'} transition`}
          >
            แผนที่โรงพยาบาล
          </Link>
          <Link 
            to="/about" 
            className={`${location.pathname === '/about' ? 'text-medical-blue font-medium' : 'text-gray-700 hover:text-medical-blue'} transition`}
          >
            เกี่ยวกับเรา
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;