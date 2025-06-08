
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hospital, MapPin, Phone } from "lucide-react";

interface HospitalData {
  id: string;
  name: string;
  address: string;
  phone?: string;
  lat: number;
  lng: number;
  distance?: number;
}

interface HospitalListProps {
  hospitals: HospitalData[];
  onSelectHospital: (hospital: HospitalData) => void;
  selectedHospital: HospitalData | null;
}

const HospitalList: React.FC<HospitalListProps> = ({
  hospitals,
  onSelectHospital,
  selectedHospital
}) => {
  if (hospitals.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center">
            <Hospital className="mr-2" size={20} />
            รายการโรงพยาบาล
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            ไม่พบข้อมูลโรงพยาบาล<br />
            กรุณาโหลดข้อมูลใหม่
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <h3 className="text-lg font-semibold flex items-center">
          <Hospital className="mr-2" size={20} />
          โรงพยาบาลใกล้เคียง ({hospitals.length})
        </h3>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedHospital?.id === hospital.id
                    ? 'border-medical-blue bg-medical-blue/5'
                    : 'border-gray-200 hover:border-medical-blue/50'
                }`}
                onClick={() => onSelectHospital(hospital)}
              >
                <h4 className="font-medium text-medical-blue mb-1">
                  {hospital.name}
                </h4>
                
                <div className="text-sm text-gray-600 mb-2 flex items-start">
                  <MapPin className="mr-1 mt-0.5 flex-shrink-0" size={14} />
                  <span>{hospital.address}</span>
                </div>
                
                {hospital.phone && (
                  <div className="text-sm text-gray-600 mb-2 flex items-center">
                    <Phone className="mr-1" size={14} />
                    <span>{hospital.phone}</span>
                  </div>
                )}
                
                {hospital.distance && (
                  <div className="text-sm font-medium text-medical-green">
                    ระยะทาง: {hospital.distance.toFixed(2)} กม.
                  </div>
                )}
                
                <Button
                  size="sm"
                  className="mt-2 h-7 text-xs"
                  variant={selectedHospital?.id === hospital.id ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectHospital(hospital);
                  }}
                >
                  {selectedHospital?.id === hospital.id ? "เลือกแล้ว" : "เลือก"}
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default HospitalList;