import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'th' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  th: {
    // Navbar
    'nav.home': 'หน้าหลัก',
    'nav.symptomChecker': 'ตรวจอาการ',
    'nav.chatbot': 'แชทบอท',
    'nav.hospitalMap': 'แผนที่โรงพยาบาล',
    'nav.about': 'เกี่ยวกับเรา',
    'nav.login': 'เข้าสู่ระบบ',
    'nav.register': 'สมัครสมาชิก',
    
    // Home page
    'home.title': 'บ้านหมอดี',
    'home.subtitle': 'ตรวจอาการด้วยตนเองอย่างง่ายดาย',
    'home.description': 'บริการตรวจอาการเบื้องต้นออนไลน์ ฟรี ง่าย รวดเร็ว',
    'home.features.symptomChecker': 'รวดเร็ว',
    'home.features.symptomCheckerDesc': 'ใช้เวลาเพียงไม่กี่นาทีในการตรวจสอบอาการและรับข้อมูล',
    'home.features.chatbot': 'ง่ายดาย',
    'home.features.chatbotDesc': 'เพียงเลือกอาการที่คุณกำลังประสบและระบุระยะเวลา',
    'home.features.hospitalMap': 'ข้อมูลครบถ้วน',
    'home.features.hospitalMapDesc': 'รับข้อมูลเกี่ยวกับสาเหตุที่เป็นไปได้และคำแนะนำในการดูแลตนเอง',
    'home.getStarted': 'เริ่มตรวจอาการเลย',
    'home.disclaimer': 'บ้านหมอดีให้ข้อมูลเบื้องต้นเท่านั้น ไม่ใช่การวินิจฉัยทางการแพทย์ หากมีอาการรุนแรงหรือกังวล กรุณาพบแพทย์โดยเร็วที่สุด',
    
    // Symptom Checker
    'symptom.title': 'ระบบตรวจสอบอาการเบื้องต้นด้วยตนเอง',
    'symptom.description': 'เลือกอาการที่คุณกำลังประสบ เพื่อรับข้อมูลเกี่ยวกับสาเหตุที่เป็นไปได้และคำแนะนำเบื้องต้น',
        'symptom.selector.title': 'เลือกอาการที่คุณกำลังประสบ',
    'symptom.duration.title': 'ระยะเวลาของอาการ:',
    'symptom.search.placeholder': 'ค้นหาอาการ...',
    'symptom.search.results': 'พบ {count} อาการที่ตรงกับการค้นหา',
    'symptom.category.select': 'เลือกหมวดหมู่',
    'symptom.noResults': 'ไม่พบอาการที่ตรงกับการค้นหา',
    'symptom.noResultsDesc': 'ลองค้นหาด้วยคำที่แตกต่างหรือเลือกจากหมวดหมู่',
    'symptom.selected.title': 'อาการที่เลือก ({count}):',
    'symptom.clear': 'ล้างค่า',
    'symptom.analyze': 'วิเคราะห์อาการ',
    'symptom.loading': 'กำลังโหลดข้อมูล...',
    'symptom.error.diagnose': 'ไม่สามารถวิเคราะห์อาการได้ กรุณาลองใหม่อีกครั้ง',
    'symptom.error.title': 'เกิดข้อผิดพลาด',
    'symptom.duration.less_than_a_day': 'ไม่ถึง 1 วัน',
    'symptom.duration.week': 'ประมาณ 1 สัปดาห์',
    'symptom.duration.more_than_a_week': 'เกิน 1 สัปดาห์ขึ้นไป',
    
    // Diagnosis Results
    'diagnosis.title': 'ผลการวิเคราะห์อาการเบื้องต้น',
    'diagnosis.subtitle': 'ข้อมูลนี้เป็นเพียงการวิเคราะห์เบื้องต้น ไม่สามารถทดแทนการวินิจฉัยโดยแพทย์ได้',
    'diagnosis.symptomInfo': 'ข้อมูลอาการ:',
    'diagnosis.selectedSymptoms': 'อาการที่เลือก:',
    'diagnosis.duration': 'ระยะเวลาของอาการ:',
    'diagnosis.possibleConditions': 'ภาวะที่เป็นไปได้ ({count} รายการ):',
    'diagnosis.noResults': 'ไม่พบความเชื่อมโยงกับโรคในฐานข้อมูลของเรา กรุณาเลือกอาการเพิ่มเติมหรือปรึกษาแพทย์',
    'diagnosis.confidence.high': 'มีความเป็นไปได้สูง',
    'diagnosis.confidence.medium': 'มีความเป็นไปได้ปานกลาง',
    'diagnosis.confidence.low': 'อาจเป็นไปได้',
    'diagnosis.selfCare': 'การดูแลตนเอง:',
    'diagnosis.medications': 'ยาที่อาจช่วยบรรเทาอาการ:',
    'diagnosis.urgency.immediate': '⚠️ ควรพบแพทย์โดยด่วน หรือไปห้องฉุกเฉินทันที',
    'diagnosis.urgency.soon': '⚠️ ควรไปพบแพทย์เร็วที่สุดเท่าที่จะเป็นไปได้',
    'diagnosis.urgency.routine': '👨‍⚕️ ควรปรึกษาแพทย์เมื่อมีโอกาส',
    'diagnosis.warning.severe': 'คำเตือน: กรุณาพบแพทย์โดยเร็วที่สุด',
    'diagnosis.warning.severeDesc': 'อาการของคุณอาจบ่งชี้ถึงภาวะที่อันตราย ควรพบแพทย์หรือไปห้องฉุกเฉินโดยเร็วที่สุด',
    'diagnosis.disclaimer': 'คำเตือน: ข้อมูลนี้มีวัตถุประสงค์เพื่อการศึกษาเท่านั้น ไม่ใช่การวินิจฉัยทางการแพทย์ โปรดปรึกษาแพทย์หากคุณมีข้อกังวลเกี่ยวกับสุขภาพ',
    'diagnosis.checkAgain': 'ตรวจสอบอาการอีกครั้ง',
    
    // ICD Reference
    'icd.title': 'ข้อมูลอ้างอิงจาก ICD-10',
    'icd.subtitle': 'มาตรฐานทางการแพทย์',
    'icd.description': 'รหัสโรคมาตรฐานสากลที่เกี่ยวข้องกับอาการของคุณ',
    'icd.category': 'หมวดหมู่:',
    'icd.severity.severe': 'รุนแรง',
    'icd.severity.moderate': 'ปานกลาง',
    'icd.severity.mild': 'เล็กน้อย',
    'icd.note': 'หมายเหตุ:',
    'icd.noteText': 'รหัส ICD-10 เป็นมาตรฐานสากลสำหรับการจำแนกโรค ข้อมูลนี้ใช้เพื่อการอ้างอิงเท่านั้น และไม่ใช่การวินิจฉัยทางการแพทย์',
    'symptom.disclaimer': 'ระบบตรวจสอบอาการนี้ไม่ใช่การวินิจฉัยทางการแพทย์ และไม่สามารถทดแทนการพบแพทย์ได้ กรุณาพบแพทย์หากมีอาการรุนแรงหรือกังวล',
    
    // Chatbot
    'chatbot.title': 'ผู้ช่วยทางการแพทย์ AI',
    'chatbot.subtitle': 'ปรึกษาข้อมูลด้านสุขภาพ โรค ยา และการดูแลตัวเองกับ AI ผู้เชี่ยวชาญ',
    'chatbot.placeholder': 'พิมพ์คำถามเกี่ยวกับสุขภาพที่นี่... เช่น \'ฉันมีอาการปวดหัด มีวิธีดูแลอย่างไร?\'',
    'chatbot.send': 'ส่ง',
    'chatbot.thinking': 'กำลังวิเคราะห์และตอบคำถาม...',
    'chatbot.welcomeTitle': 'เริ่มปรึกษาผู้ช่วยทางการแพทย์ AI',
    'chatbot.welcomeSubtitle': 'พิมพ์คำถามเกี่ยวกับสุขภาพของคุณด้านล่าง',
    'chatbot.examples': 'สามารถถามเรื่อง: อาการโรค, การรักษา, ยา, การดูแลสุขภาพ, โภชนาการ, การออกกำลังกาย',
    'chatbot.clearHistory': 'ลบประวัติการสนทนา',
    'chatbot.errorClear': 'ไม่สามารถลบประวัติการสนทนาได้',
    'chatbot.clearSuccess': 'ลบประวัติการสนทนาแล้ว',

    // Maps page
    'maps.title': 'ค้นหาสถานพยาบาล',
    'maps.subtitle': 'ค้นหาสถานพยาบาล คลินิก และศูนย์สุขภาพใกล้เคียง',
    'maps.nearbyFacilities': 'สถานพยาบาลใกล้เคียง',
    'maps.interactiveMap': 'แผนที่แบบโต้ตอบ',
    'maps.myLocation': 'ตำแหน่งของฉัน',
    'maps.viewOnMap': 'ดูบนแผนที่',
    'maps.type': 'ประเภท',
    'maps.distance': 'ระยะทาง',
    'maps.selectLocation': 'เลือกตำแหน่งเพื่อค้นหาสถานพยาบาลใกล้เคียง',
    'maps.typeHospital': 'โรงพยาบาล',
    'maps.typeClinic': 'คลินิก/ศูนย์สุขภาพ',
    'maps.searchPlaceholder': 'ค้นหาสถานพยาบาล',
    'maps.currentLocation': 'ตำแหน่งปัจจุบันของคุณ',
    
    // About
    'about.title': 'เกี่ยวกับบ้านหมอดี',
    'about.subtitle': 'เรียนรู้เพิ่มเติมเกี่ยวกับแอปพลิเคชันตรวจสอบอาการของเรา',
    'about.aboutProject': 'เกี่ยวกับโครงการ',
    'about.projectDescription1': 'บ้านหมอดีเป็นแอปพลิเคชันที่ออกแบบมาเพื่อช่วยให้ผู้ใช้งานสามารถตรวจสอบอาการเบื้องต้นได้ด้วยตนเอง โดยมีวัตถุประสงค์เพื่อให้ข้อมูลและแนวทางเบื้องต้น ไม่ใช่เพื่อทดแทนการวินิจฉัยโดยแพทย์',
    'about.projectDescription2': 'แอปพลิเคชันนี้เหมาะสำหรับผู้ที่ต้องการเรียนรู้เพิ่มเติมเกี่ยวกับอาการของตนเองก่อนที่จะตัดสินใจพบแพทย์ หรือเพื่อรับข้อมูลเพิ่มเติมเกี่ยวกับการดูแลตนเองเบื้องต้น',
    'about.howToUse': 'วิธีการใช้งาน',
    'about.usageDescription': 'การใช้งานแอปพลิเคชันตรวจสอบอาการของเรามีขั้นตอนดังนี้',
    'about.step1': 'เลือกอาการที่คุณกำลังประสบ',
    'about.step2': 'ระบุระยะเวลาที่มีอาการ',
    'about.step3': 'รับผลการวิเคราะห์เบื้องต้นและคำแนะนำ',
    'about.goToChecker': 'ไปที่ตัวตรวจสอบอาการ',
    'about.references': 'แหล่งข้อมูลอ้างอิง',
    'about.referencesDescription': 'ข้อมูลทางการแพทย์ในแอปพลิเคชันนี้อ้างอิงจากแหล่งข้อมูลที่น่าเชื่อถือ รวมถึง',
    'about.diseaseData': 'ข้อมูลโรค',
    'about.who': 'องค์การอนามัยโลก (World Health Organization)',
    'about.cdc': 'กรมควบคุมโรค (Centers for Disease Control and Prevention)',
    'about.drugData': 'ข้อมูลยา',
    'about.medicalCouncil': 'ข้อมูลจากแพทยสภา และสภาเภสัชกรรม',
    'about.disclaimer': 'คำเตือน: ข้อมูลในแอปพลิเคชันนี้มีวัตถุประสงค์เพื่อการศึกษาเท่านั้น ไม่ใช่การวินิจฉัยทางการแพทย์ โปรดปรึกษาแพทย์สำหรับการวินิจฉัยและการรักษาที่เหมาะสม',
    'about.team': 'ทีมผู้พัฒนา',
    'about.devTeam': 'ทีมพัฒนาซอฟต์แวร์',
    'about.devTeamDescription': 'แอปพลิเคชันนี้พัฒนาโดยนักเรียนที่มีความสนใจทางด้านการพัฒนาโปรแกรม และต้องการให้สามารถนำไปใช้ประโยชน์ได้<br />'
  + 'โดยประกอบไปด้วย:<br />'
  + '<span style="display:block; margin-left:2em;">นายธนวัฒน์ ฉายศิริวัฒนา</span>'
  + '<span style="display:block; margin-left:2em;">นายอะิภัทร จิราภารัญชน์</span>',
    'about.medicalAdvisor': 'ที่ปรึกษาทางการแพทย์',
    'about.medicalAdvisorDescription': 'ข้อมูลทางการแพทย์ในแอปพลิเคชันนี้ได้รับการตรวจสอบโดยผู้เชี่ยวชาญทางการแพทย์เพื่อให้มั่นใจในความถูกต้องและความเหมาะสม อย่างไรก็ตาม โปรดทราบว่าข้อมูลนี้ไม่สามารถทดแทนคำแนะนำทางการแพทย์โดยตรงจากแพทย์ได้',
    'about.contact': 'ติดต่อเรา',
    'about.contactDescription': 'หากคุณมีคำถาม ข้อเสนอแนะ หรือต้องการรายงานปัญหาเกี่ยวกับแอปพลิเคชัน โปรดติดต่อเราทางอีเมล: Tanawat.c@pccst.ac.th',
    
    // Auth
    'auth.login': 'เข้าสู่ระบบ',
    'auth.register': 'สมัครสมาชิก',
    'auth.email': 'อีเมล',
    'auth.password': 'รหัสผ่าน',
    'auth.confirmPassword': 'ยืนยันรหัสผ่าน',
    'auth.loginButton': 'เข้าสู่ระบบ',
    'auth.registerButton': 'สมัครสมาชิก',
    'auth.loginDescription': 'กรอกข้อมูลเพื่อเข้าสู่ระบบ บ้านหมอดี',
    'auth.registerDescription': 'กรอกข้อมูลเพื่อสร้างบัญชีผู้ใช้ในระบบบ้านหมอดี',
    'auth.noAccount': 'ยังไม่มีบัญชี?',
    'auth.hasAccount': 'มีบัญชีอยู่แล้ว?',
    'auth.registerNew': 'สมัครสมาชิกใหม่',
    'auth.emailError': 'กรุณาระบุอีเมลให้ถูกต้อง',
    'auth.passwordError': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
    'auth.confirmPasswordError': 'กรุณายืนยันรหัสผ่าน',
    'auth.passwordMismatch': 'รหัสผ่านไม่ตรงกัน',
    'auth.invalidCredentials': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    'auth.emailNotConfirmed': 'อีเมลของคุณยังไม่ได้ยืนยัน โปรดตรวจสอบอีเมลของคุณเพื่อยืนยันบัญชี',
    'auth.loginFailed': 'เข้าสู่ระบบล้มเหลว',
    'auth.loginSuccess': 'เข้าสู่ระบบสำเร็จ',
    'auth.welcomeBack': 'ยินดีต้อนรับกลับมา',
    'auth.loggingIn': 'กำลังเข้าสู่ระบบ...',
    'auth.emailAlreadyExists': 'อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น',
    'auth.registerFailed': 'สมัครสมาชิกล้มเหลว',
    'auth.registerSuccess': 'สมัครสมาชิกสำเร็จ',
    'auth.checkEmailConfirm': 'ยินดีต้อนรับสู่บ้านหมอดี กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีผู้ใช้',
    'auth.registering': 'กำลังสมัครสมาชิก...',
    
    // Common
    'common.loading': 'กำลังโหลด...',
    'common.error': 'เกิดข้อผิดพลาด',
    'common.success': 'สำเร็จ',
    'common.save': 'บันทึก',
    'common.cancel': 'ยกเลิก',
    'common.confirm': 'ยืนยัน',
    'common.close': 'ปิด',
    'common.back': 'กลับ',
    'common.next': 'ถัดไป',
    'common.previous': 'ก่อนหน้า',
    'common.warning': 'คำเตือน',
    'common.user': 'ผู้ใช้',
    'common.tryAgain': 'กรุณาลองใหม่อีกครั้ง',
    
    // Footer
    'footer.copyright': '© 2025 บ้านหมอดี - ระบบตรวจสอบอาการเบื้องต้น',
  },
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.symptomChecker': 'Symptom Checker',
    'nav.chatbot': 'Chatbot',
    'nav.hospitalMap': 'Hospital Map',
    'nav.about': 'About Us',
    'nav.login': 'Login',
    'nav.register': 'Register',
    
    // Home page
    'home.title': 'Doctor at Home',
    'home.subtitle': 'Easy Self Symptom Checking',
    'home.description': 'Free, easy, and fast online preliminary symptom checking service',
    'home.features.symptomChecker': 'Fast',
    'home.features.symptomCheckerDesc': 'Takes only a few minutes to check symptoms and get information',
    'home.features.chatbot': 'Easy',
    'home.features.chatbotDesc': 'Simply select your symptoms and specify the duration',
    'home.features.hospitalMap': 'Comprehensive Information',
    'home.features.hospitalMapDesc': 'Get information about possible causes and self-care recommendations',
    'home.getStarted': 'Start Checking Symptoms',
    'home.disclaimer': 'Doctor at Home provides preliminary information only, not medical diagnosis. If you have severe symptoms or concerns, please see a doctor immediately',
    
    // Symptom Checker
    'symptom.title': 'Self Preliminary Symptom Checking System',
    'symptom.description': 'Select the symptoms you are experiencing to get information about possible causes and preliminary recommendations',
    'symptom.disclaimer': 'This symptom checker is not a medical diagnosis and cannot replace seeing a doctor. Please see a doctor if you have severe symptoms or concerns',
    'symptom.selector.title': 'Select the symptoms you are experiencing',
    'symptom.duration.title': 'Duration of symptoms:',
    'symptom.search.placeholder': 'Search symptoms...',
    'symptom.search.results': 'Found {count} symptoms matching your search',
    'symptom.category.select': 'Select category',
    'symptom.noResults': 'No symptoms found matching your search',
    'symptom.noResultsDesc': 'Try searching with different terms or select from categories',
    'symptom.selected.title': 'Selected symptoms ({count}):',
    'symptom.clear': 'Clear',
    'symptom.analyze': 'Analyze Symptoms',
    'symptom.loading': 'Loading data...',
    'symptom.error.diagnose': 'Unable to analyze symptoms. Please try again',
    'symptom.error.title': 'An error occurred',
    'symptom.duration.less_than_a_day': 'Less than 1 day',
    'symptom.duration.week': '1 week',
    'symptom.duration.more_than_a_week': 'More than 1 week',
    
    // Diagnosis Results
    'diagnosis.title': 'Preliminary Symptom Analysis Results',
    'diagnosis.subtitle': 'This information is for preliminary analysis only and cannot replace medical diagnosis by a doctor',
    'diagnosis.symptomInfo': 'Symptom Information:',
    'diagnosis.selectedSymptoms': 'Selected symptoms:',
    'diagnosis.duration': 'Duration of symptoms:',
    'diagnosis.possibleConditions': 'Possible conditions ({count} items):',
    'diagnosis.noResults': 'No connection found with diseases in our database. Please select additional symptoms or consult a doctor',
    'diagnosis.confidence.high': 'High possibility',
    'diagnosis.confidence.medium': 'Moderate possibility',
    'diagnosis.confidence.low': 'Possible',
    'diagnosis.selfCare': 'Self-care:',
    'diagnosis.medications': 'Medications that may help relieve symptoms:',
    'diagnosis.urgency.immediate': '⚠️ Should see a doctor urgently or go to emergency room immediately',
    'diagnosis.urgency.soon': '⚠️ Should see a doctor as soon as possible',
    'diagnosis.urgency.routine': '👨‍⚕️ Should consult a doctor when possible',
    'diagnosis.warning.severe': 'Warning: Please see a doctor as soon as possible',
    'diagnosis.warning.severeDesc': 'Your symptoms may indicate a dangerous condition. You should see a doctor or go to the emergency room as soon as possible',
    'diagnosis.disclaimer': 'Warning: This information is for educational purposes only, not medical diagnosis. Please consult a doctor if you have health concerns',
    'diagnosis.checkAgain': 'Check symptoms again',
    
    // ICD Reference
    'icd.title': 'ICD-10 Reference Information',
    'icd.subtitle': 'Medical Standard',
    'icd.description': 'International standard disease codes related to your symptoms',
    'icd.category': 'Category:',
    'icd.severity.severe': 'Severe',
    'icd.severity.moderate': 'Moderate',
    'icd.severity.mild': 'Mild',
    'icd.note': 'Note:',
    'icd.noteText': 'ICD-10 codes are international standards for disease classification. This information is for reference only and is not medical diagnosis',    
    
    // Chatbot
    'chatbot.title': 'AI Medical Assistant',
    'chatbot.subtitle': 'Consult with AI experts about health information, diseases, medications, and self-care',
    'chatbot.placeholder': 'Type your health question here... e.g. \'I have a headache, how should I take care of it?\'',
    'chatbot.send': 'Send',
    'chatbot.thinking': 'Analyzing and answering...',
    'chatbot.welcomeTitle': 'Start consulting with AI Medical Assistant',
    'chatbot.welcomeSubtitle': 'Type your health questions below',
    'chatbot.examples': 'You can ask about: symptoms, treatments, medications, health care, nutrition, exercise',
    'chatbot.clearHistory': 'Clear Chat History',
    'chatbot.errorClear': 'Unable to clear chat history',
    'chatbot.clearSuccess': 'Chat history cleared',
    
    // Maps page
    'maps.title': 'Find Healthcare Facilities',
    'maps.subtitle': 'Search for hospitals, clinics, and nearby health centers',
    'maps.nearbyFacilities': 'Nearby Health Facilities',
    'maps.interactiveMap': 'Interactive Map',
    'maps.myLocation': 'My Location',
    'maps.viewOnMap': 'View on Map',
    'maps.type': 'Type',
    'maps.distance': 'Distance',
    'maps.selectLocation': 'Select a location to find nearby healthcare facilities',
    'maps.typeHospital': 'Hospital',
    'maps.typeClinic': 'Clinic/Health Center',
    'maps.searchPlaceholder': 'Search for healthcare facilities',
    'maps.currentLocation': 'Your current location',

    // About
    'about.title': 'About Doctor at Home',
    'about.subtitle': 'Learn more about our symptom checking application',
    'about.aboutProject': 'About the Project',
    'about.projectDescription1': 'Doctor at Home is an application designed to help users check preliminary symptoms by themselves. Its purpose is to provide preliminary information and guidance, not to replace medical diagnosis by doctors',
    'about.projectDescription2': 'This application is suitable for those who want to learn more about their symptoms before deciding to see a doctor, or to get additional information about basic self-care',
    'about.howToUse': 'How to Use',
    'about.usageDescription': 'Using our symptom checking application follows these steps',
    'about.step1': 'Select the symptoms you are experiencing',
    'about.step2': 'Specify the duration of symptoms',
    'about.step3': 'Get preliminary analysis results and recommendations',
    'about.goToChecker': 'Go to Symptom Checker',
    'about.references': 'References',
    'about.referencesDescription': 'Medical information in this application is referenced from reliable sources, including',
    'about.diseaseData': 'Disease Data',
    'about.who': 'World Health Organization',
    'about.cdc': 'Centers for Disease Control and Prevention',
    'about.drugData': 'Drug Data',
    'about.medicalCouncil': 'Data from Medical Council and Pharmacy Council',
    'about.disclaimer': 'Warning: Information in this application is for educational purposes only, not medical diagnosis. Please consult a doctor for appropriate diagnosis and treatment',
    'about.team': 'Development Team',
    'about.devTeam': 'Software Development Team',
    'about.devTeamDescription': 'This application was developed by students who are passionate about programming and want it to be useful.<br />'
  + 'The team consists of:<br />'
  + '<span style="display:block; margin-left:2em;">Mr. Tanawat Chaisiriwattana</span>'
  + '<span style="display:block; margin-left:2em;">Mr. Athiphat Chiraparan</span>',
    'about.medicalAdvisor': 'Medical Advisor',
    'about.medicalAdvisorDescription': 'Medical information in this application has been reviewed by medical experts to ensure accuracy and appropriateness. However, please note that this information cannot replace direct medical advice from doctors',
    'about.contact': 'Contact Us',
    'about.contactDescription': 'If you have questions, suggestions, or want to report issues about the application, please contact us via email: Tanawat.c@pccst.ac.th',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.loginButton': 'Login',
    'auth.registerButton': 'Register',
    'auth.loginDescription': 'Enter your information to login to Doctor Home',
    'auth.registerDescription': 'Enter your information to create an account in Doctor Home system',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.registerNew': 'Register New Account',
    'auth.emailError': 'Please enter a valid email',
    'auth.passwordError': 'Password must be at least 6 characters',
    'auth.confirmPasswordError': 'Please confirm your password',
    'auth.passwordMismatch': 'Passwords do not match',
    'auth.invalidCredentials': 'Invalid email or password',
    'auth.emailNotConfirmed': 'Your email is not confirmed. Please check your email to confirm your account',
    'auth.loginFailed': 'Login Failed',
    'auth.loginSuccess': 'Login Successful',
    'auth.welcomeBack': 'Welcome back',
    'auth.loggingIn': 'Logging in...',
    'auth.emailAlreadyExists': 'This email is already in use. Please use another email',
    'auth.registerFailed': 'Registration Failed',
    'auth.registerSuccess': 'Registration Successful',
    'auth.checkEmailConfirm': 'Welcome to Doctor Home. Please check your email to confirm your account',
    'auth.registering': 'Registering...',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error occurred',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.warning': 'Warning',
    'common.user': 'User',
    'common.tryAgain': 'Please try again',

    // Footer
    'footer.copyright': '© 2025 Doctor Home - Preliminary Symptom Checking System',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('th');
  
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
