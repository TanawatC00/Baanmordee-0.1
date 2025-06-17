
-- เพิ่มคอลัมน์สำหรับภาษาอังกฤษในตาราง symptoms
ALTER TABLE symptoms 
ADD COLUMN name_en TEXT;

-- เพิ่มคอลัมน์สำหรับภาษาอังกฤษในตาราง symptom_categories
ALTER TABLE symptom_categories 
ADD COLUMN name_en TEXT;

-- เพิ่มคอลัมน์สำหรับภาษาอังกฤษในตาราง symptom_durations
ALTER TABLE symptom_durations 
ADD COLUMN name_en TEXT;

-- เพิ่มคอลัมน์สำหรับภาษาอังกฤษในตาราง conditions
ALTER TABLE conditions 
ADD COLUMN name_en TEXT,
ADD COLUMN description_en TEXT,
ADD COLUMN self_care_en TEXT,
ADD COLUMN medications_en TEXT[];

-- อัพเดทข้อมูลตัวอย่างสำหรับ symptom_categories
UPDATE symptom_categories SET name_en = 'General' WHERE id = 'general';
UPDATE symptom_categories SET name_en = 'Head and Neck' WHERE id = 'head_neck';
UPDATE symptom_categories SET name_en = 'Respiratory' WHERE id = 'respiratory';
UPDATE symptom_categories SET name_en = 'Cardiovascular' WHERE id = 'cardiovascular';
UPDATE symptom_categories SET name_en = 'Digestive' WHERE id = 'digestive';
UPDATE symptom_categories SET name_en = 'Musculoskeletal' WHERE id = 'musculoskeletal';
UPDATE symptom_categories SET name_en = 'Skin' WHERE id = 'skin';
UPDATE symptom_categories SET name_en = 'Neurological' WHERE id = 'neurological';
UPDATE symptom_categories SET name_en = 'Urogenital' WHERE id = 'urogenital';
UPDATE symptom_categories SET name_en = 'Mental Health' WHERE id = 'mental_health';

-- อัพเดทข้อมูลตัวอย่างสำหรับ symptom_durations
UPDATE symptom_durations SET name_en = 'Less than 1 day' WHERE id = 'less_than_1_day';
UPDATE symptom_durations SET name_en = '1-3 days' WHERE id = '1_3_days';
UPDATE symptom_durations SET name_en = '4-7 days' WHERE id = '4_7_days';
UPDATE symptom_durations SET name_en = '1-2 weeks' WHERE id = '1_2_weeks';
UPDATE symptom_durations SET name_en = '2-4 weeks' WHERE id = '2_4_weeks';
UPDATE symptom_durations SET name_en = 'More than 1 month' WHERE id = 'more_than_1_month';

-- อัพเดทข้อมูลตัวอย่างสำหรับ symptoms (เลือกบางอาการที่สำคัญ)
UPDATE symptoms SET name_en = 'Fever' WHERE id = 'fever';
UPDATE symptoms SET name_en = 'Headache' WHERE id = 'headache';
UPDATE symptoms SET name_en = 'Cough' WHERE id = 'cough';
UPDATE symptoms SET name_en = 'Runny nose' WHERE id = 'runny_nose';
UPDATE symptoms SET name_en = 'Chest pain' WHERE id = 'chest_pain';
UPDATE symptoms SET name_en = 'Abdominal pain' WHERE id = 'abdominal_pain';
UPDATE symptoms SET name_en = 'Nausea' WHERE id = 'nausea';
UPDATE symptoms SET name_en = 'Vomiting' WHERE id = 'vomiting';
UPDATE symptoms SET name_en = 'Fatigue' WHERE id = 'fatigue';
UPDATE symptoms SET name_en = 'Dizziness' WHERE id = 'dizziness';
UPDATE symptoms SET name_en = 'Joint pain' WHERE id = 'joint_pain';
UPDATE symptoms SET name_en = 'Back pain' WHERE id = 'back_pain';
UPDATE symptoms SET name_en = 'Skin rash' WHERE id = 'skin_rash';
UPDATE symptoms SET name_en = 'Itching' WHERE id = 'itching';
UPDATE symptoms SET name_en = 'Confusion' WHERE id = 'confusion';
UPDATE symptoms SET name_en = 'Sadness' WHERE id = 'sadness';
UPDATE symptoms SET name_en = 'Restlessness' WHERE id = 'restlessness';
UPDATE symptoms SET name_en = 'Frequent urination' WHERE id = 'frequent_urination';
UPDATE symptoms SET name_en = 'Leg pain' WHERE id = 'leg_pain';
UPDATE symptoms SET name_en = 'Swelling' WHERE id = 'swelling';
UPDATE symptoms SET name_en = 'Weakness' WHERE id = 'weakness';
UPDATE symptoms SET name_en = 'Weight loss' WHERE id = 'weight_loss';
UPDATE symptoms SET name_en = 'Weight gain' WHERE id = 'weight_gain';
UPDATE symptoms SET name_en = 'Excessive thirst' WHERE id = 'excessive_thirst';
UPDATE symptoms SET name_en = 'Blurred vision' WHERE id = 'blurred_vision';
UPDATE symptoms SET name_en = 'Eye pain' WHERE id = 'eye_pain';
UPDATE symptoms SET name_en = 'Ear pain' WHERE id = 'ear_pain';
UPDATE symptoms SET name_en = 'Stiffness' WHERE id = 'stiffness';
UPDATE symptoms SET name_en = 'Hand pain' WHERE id = 'hand_pain';
UPDATE symptoms SET name_en = 'Foot pain' WHERE id = 'foot_pain';
UPDATE symptoms SET name_en = 'Severe pain' WHERE id = 'severe_pain';
UPDATE symptoms SET name_en = 'Breast pain' WHERE id = 'breast_pain';
UPDATE symptoms SET name_en = 'Skin redness' WHERE id = 'skin_redness';
UPDATE symptoms SET name_en = 'Pain' WHERE id = 'pain';
UPDATE symptoms SET name_en = 'Skin discoloration' WHERE id = 'skin_discoloration';
UPDATE symptoms SET name_en = 'Neck swelling' WHERE id = 'neck_swelling';
UPDATE symptoms SET name_en = 'Constipation' WHERE id = 'constipation';

-- อัพเดทข้อมูลตัวอย่างสำหรับ conditions (เลือกบางโรคที่สำคัญ)
UPDATE conditions SET 
  name_en = 'Pneumonia',
  description_en = 'Lung infection causing inflammation of air sacs which may fill with fluid or pus',
  self_care_en = 'Get plenty of rest, drink lots of fluids, avoid smoking',
  medications_en = ARRAY['Antibiotics as prescribed', 'Fever reducers']
WHERE id = 'pneumonia';

UPDATE conditions SET 
  name_en = 'Bronchitis',
  description_en = 'Inflammation of the bronchial tubes that carry air to the lungs',
  self_care_en = 'Rest, drink warm fluids, use humidifier',
  medications_en = ARRAY['Cough suppressants', 'Expectorants']
WHERE id = 'bronchitis';

UPDATE conditions SET 
  name_en = 'Hypertension',
  description_en = 'High blood pressure condition where blood pressure in arteries is elevated',
  self_care_en = 'Reduce salt intake, exercise regularly, maintain healthy weight',
  medications_en = ARRAY['Blood pressure medications', 'Diuretics']
WHERE id = 'hypertension';

UPDATE conditions SET 
  name_en = 'Type 2 Diabetes',
  description_en = 'Condition where the body does not use insulin effectively',
  self_care_en = 'Control diet, exercise regularly',
  medications_en = ARRAY['Blood sugar medications', 'Insulin']
WHERE id = 'diabetes_type2';

UPDATE conditions SET 
  name_en = 'Migraine',
  description_en = 'Severe headache disorder that occurs episodically',
  self_care_en = 'Rest in dark room, avoid loud noises',
  medications_en = ARRAY['Headache medications', 'Anti-nausea medications']
WHERE id = 'migraine';