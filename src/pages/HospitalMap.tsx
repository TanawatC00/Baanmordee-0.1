
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MapPin, Navigation, Hospital, Phone, Search, Locate } from "lucide-react";
import Navbar from '@/components/Layout/Navbar';
import HospitalMapView from '@/components/Hospital/HospitalMapView';
import HospitalList from '@/components/Hospital/HospitalList';

interface Hospital {
  id: string;
  name: string;
  address: string;
  phone?: string;
  lat: number;
  lng: number;
  distance?: number;
}

interface UserLocation {
  lat: number;
  lng: number;
}

const HospitalMap: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get user's current location
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error("เบราว์เซอร์ไม่รองรับการระบุตำแหน่ง");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        setIsLoadingLocation(false);
        toast.success("ระบุตำแหน่งสำเร็จ");
        fetchHospitals(location);
      },
      (error) => {
        setIsLoadingLocation(false);
        console.error("Error getting location:", error);
        toast.error("ไม่สามารถระบุตำแหน่งได้ กรุณาอนุญาตการเข้าถึงตำแหน่ง");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Search for location using Nominatim API
  const searchForLocation = async () => {
    if (!searchLocation.trim()) {
      toast.error("กรุณาใส่ชื่อสถานที่");
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchLocation)}&limit=1&countrycodes=th`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const location = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
        setUserLocation(location);
        toast.success(`พบตำแหน่ง: ${data[0].display_name}`);
        fetchHospitals(location);
      } else {
        toast.error("ไม่พบตำแหน่งที่ค้นหา");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      toast.error("เกิดข้อผิดพลาดในการค้นหาตำแหน่ง");
    } finally {
      setIsSearching(false);
    }
  };

  // Fetch hospitals from API
  const fetchHospitals = async (location?: UserLocation) => {
    setIsLoadingHospitals(true);
    
    try {
      const response = await fetch('https://hcode.moph.go.th/api/health_office/');
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        const hospitalData: Hospital[] = data
          .filter(item => item.lat && item.lng && item.name)
          .map(item => {
            const hospital: Hospital = {
              id: item.id || `${item.lat}-${item.lng}`,
              name: item.name || 'ไม่ระบุชื่อ',
              address: item.address || 'ไม่ระบุที่อยู่',
              phone: item.phone,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lng)
            };
            
            // Calculate distance if user location is available
            if (location) {
              hospital.distance = calculateDistance(
                location.lat, 
                location.lng, 
                hospital.lat, 
                hospital.lng
              );
            }
            
            return hospital;
          })
          .sort((a, b) => {
            if (a.distance && b.distance) {
              return a.distance - b.distance;
            }
            return 0;
          });
        
        setHospitals(hospitalData);
        toast.success(`พบโรงพยาบาล ${hospitalData.length} แห่ง`);
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      toast.error("ไม่สามารถโหลดข้อมูลโรงพยาบาลได้");
    } finally {
      setIsLoadingHospitals(false);
    }
  };

  // Find nearest hospital
  const findNearestHospital = () => {
    if (!userLocation || hospitals.length === 0) {
      toast.error("กรุณาระบุตำแหน่งและโหลดข้อมูลโรงพยาบาลก่อน");
      return;
    }

    const nearest = hospitals[0]; // Already sorted by distance
    setSelectedHospital(nearest);
    
    if (nearest.distance) {
      toast.success(`โรงพยาบาลใกล้ที่สุด: ${nearest.name} (${nearest.distance.toFixed(2)} กม.)`);
    }
  };

  useEffect(() => {
    // Load hospitals on component mount
    fetchHospitals();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-medical-blue mb-2">แผนที่โรงพยาบาลใกล้เคียง</h1>
          <p className="text-gray-600">ค้นหาโรงพยาบาลใกล้คุณ</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center">
                  <Navigation className="mr-2" size={20} />
                  ค้นหาตำแหน่ง
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search-location">ค้นหาจากชื่อสถานที่</Label>
                  <div className="flex gap-2">
                    <Input
                      id="search-location"
                      type="text"
                      placeholder="ใส่ชื่อเมือง, จังหวัด หรือสถานที่..."
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchForLocation()}
                    />
                    <Button 
                      onClick={searchForLocation}
                      disabled={isSearching}
                      size="sm"
                      className="px-3"
                    >
                      {isSearching ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <Search size={16} />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={() => fetchHospitals(userLocation || undefined)}
                  disabled={isLoadingHospitals}
                  variant="outline"
                  className="w-full"
                >
                  {isLoadingHospitals ? (
                    "กำลังโหลด..."
                  ) : (
                    <>
                      <Hospital className="mr-2" size={16} />
                      โหลดข้อมูลโรงพยาบาล
                    </>
                  )}
                </Button>

                <Button 
                  onClick={findNearestHospital}
                  disabled={!userLocation || hospitals.length === 0}
                  className="w-full bg-medical-green hover:bg-medical-green/90"
                >
                  หาโรงพยาบาลใกล้ที่สุด
                </Button>

                {userLocation && (
                  <div className="p-3 bg-medical-blue/10 rounded-md">
                    <p className="text-sm text-medical-blue font-medium">ตำแหน่งปัจจุบัน:</p>
                    <p className="text-xs text-gray-600">
                      {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                    </p>
                  </div>
                )}

                {selectedHospital && (
                  <div className="p-3 bg-medical-green/10 rounded-md">
                    <p className="text-sm text-medical-green font-medium">โรงพยาบาลใกล้ที่สุด:</p>
                    <p className="text-sm font-medium">{selectedHospital.name}</p>
                    {selectedHospital.distance && (
                      <p className="text-xs text-gray-600">
                        ระยะทาง: {selectedHospital.distance.toFixed(2)} กม.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <HospitalList 
              hospitals={hospitals.slice(0, 10)} 
              onSelectHospital={setSelectedHospital}
              selectedHospital={selectedHospital}
            />
          </div>

          {/* Map */}
          <div className="lg:col-span-2 relative">
            <Card>
              <CardContent className="p-0">
                <HospitalMapView 
                  hospitals={hospitals}
                  userLocation={userLocation}
                  selectedHospital={selectedHospital}
                  onSelectHospital={setSelectedHospital}
                />
              </CardContent>
            </Card>

            {/* Floating Location Button */}
            <Button 
              onClick={getUserLocation}
              disabled={isLoadingLocation}
              className="absolute bottom-4 right-4 z-[9999] bg-white hover:bg-gray-50 text-medical-blue border border-gray-300 shadow-lg rounded-full w-12 h-12 p-0"
              size="icon"
            >
              {isLoadingLocation ? (
                <div className="animate-spin h-5 w-5 border-2 border-medical-blue border-t-transparent rounded-full" />
              ) : (
                <Locate size={20} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalMap;