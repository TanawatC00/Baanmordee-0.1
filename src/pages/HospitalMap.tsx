import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from '../components/Layout/Navbar';
import LocationSearch from '../components/LocationSearch';
import { MapPin, Navigation, Hospital, Search, Building } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom red icon for hospitals
const hospitalIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Create custom green icon for clinics
const clinicIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface HealthFacility {
  name: string;
  lat: number;
  lng: number;
  distance?: number;
  type: 'hospital' | 'clinic';
}

const Maps = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const bangkokMarkerRef = useRef<L.Marker | null>(null);
  const currentLocationMarkerRef = useRef<L.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number, name: string} | null>(null);
  const [nearbyFacilities, setNearbyFacilities] = useState<HealthFacility[]>([]);
  const { t, language } = useLanguage();

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };
  const clearAllMarkers = () => {
    markersRef.current.forEach(marker => {
      if (mapInstance.current) {
        mapInstance.current.removeLayer(marker);
      }
    });
    markersRef.current = [];
  };

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Bangkok coordinates
    const bangkokLat = 13.7563;
    const bangkokLng = 100.5018;

    // Initialize the map with custom zoom control position
    mapInstance.current = L.map(mapRef.current, {
      zoomControl: false // Disable default zoom control
    }).setView([bangkokLat, bangkokLng], 10);

    // Add zoom control to top-right
    L.control.zoom({
      position: 'topright'
    }).addTo(mapInstance.current);
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance.current);

    // Add a marker for Bangkok and store the reference
    bangkokMarkerRef.current = L.marker([bangkokLat, bangkokLng])
      .addTo(mapInstance.current)
      .bindPopup('กรุงเทพมหานคร<br>Bangkok, Thailand')
      .openPopup();

    // Add some sample markers for hospitals
    const hospitals = [
      { name: 'โรงพยาบาลจุฬาลงกรณ์', lat: 13.7326, lng: 100.5262 },
      { name: 'โรงพยาบาลศิริราช', lat: 13.7581, lng: 100.4797 },
      { name: 'โรงพยาบาลรามาธิบดี', lat: 13.7596, lng: 100.5296 },
      { name: 'โรงพยาบาลเวชศาสตร์เขตร้อน', lat: 13.7297, lng: 100.5215 }
    ];

    // Create facilities array with distance calculation
    const facilitiesWithDistance = hospitals.map(hospital => ({
      ...hospital,
      distance: calculateDistance(bangkokLat, bangkokLng, hospital.lat, hospital.lng),
      type: 'hospital' as const
    }));

    // Sort by distance and set initial nearby facilities
    facilitiesWithDistance.sort((a, b) => a.distance - b.distance);
    setNearbyFacilities(facilitiesWithDistance);
    setSelectedLocation({ lat: bangkokLat, lng: bangkokLng, name: 'กรุงเทพมหานคร' });

    // Clear all markers before adding new ones
    clearAllMarkers();

    facilitiesWithDistance.forEach((facility) => {
      const marker = L.marker([facility.lat, facility.lng], { icon: hospitalIcon })
        .addTo(mapInstance.current!)
        .bindPopup(`
          <div style="min-width: 200px;">
            <strong>${facility.name}</strong><br>
            <small style="color: #666;">โรงพยาบาล</small><br>
            <span style="color: #0066cc;">ระยะทาง: ${facility.distance.toFixed(1)} กม.</span><br>
            <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}', '_blank')"
                    style="margin-top: 8px; padding: 4px 8px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
              นำทาง
            </button>
          </div>
        `);

      // Add click event to center map on marker and handle facility click
      marker.on('click', () => {
        mapInstance.current?.setView([facility.lat, facility.lng], 16);
        console.log(`Clicked on ${facility.name}`);
      });

      markersRef.current.push(marker); // <--- ต้องเก็บ marker ด้วย
    });

    // Cleanup function
    return () => {
      if (mapInstance.current) {
        clearAllMarkers();
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // ฟังก์ชันค้นหาตำแหน่ง
  const centerToCurrentLocation = () => {
    if (!mapInstance.current) return;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapInstance.current!.setView([latitude, longitude], 15);
          
          // Remove Bangkok marker when using current location
          if (bangkokMarkerRef.current) {
            mapInstance.current!.removeLayer(bangkokMarkerRef.current);
            bangkokMarkerRef.current = null;
          }

          // Remove existing current location marker if any
          if (currentLocationMarkerRef.current) {
            mapInstance.current!.removeLayer(currentLocationMarkerRef.current);
          }

          // Add current location marker
          currentLocationMarkerRef.current = L.marker([latitude, longitude])
            .addTo(mapInstance.current!)
            .bindPopup(t('maps.currentLocation')) // <-- ใช้ t() สำหรับแปลภาษา
            .openPopup();

          // Search for health facilities near current location
          searchNearbyHealthFacilities(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('ไม่สามารถหาตำแหน่งปัจจุบันได้');
        }
      );
    } else {
      alert('เบราว์เซอร์ของคุณไม่รองรับการหาตำแหน่ง');
    }
  };

  const searchNearbyHealthFacilities = async (lat: number, lng: number) => {
    try {
      // Search for hospitals
      const hospitalResponse = await fetch(
        `https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];(node["amenity"="hospital"](around:30000,${lat},${lng});way["amenity"="hospital"](around:30000,${lat},${lng});relation["amenity"="hospital"](around:30000,${lat},${lng}););out center;`
      );
      if (!hospitalResponse.ok) {
        throw new Error('Failed to fetch hospital data');
      }
      
      const hospitalData = await hospitalResponse.json();

      // Search for clinics and health centers
      const clinicResponse = await fetch(
        `https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];(node["amenity"="clinic"](around:30000,${lat},${lng});way["amenity"="clinic"](around:30000,${lat},${lng});relation["amenity"="clinic"](around:30000,${lat},${lng});node["healthcare"="centre"](around:30000,${lat},${lng});way["healthcare"="centre"](around:30000,${lat},${lng}););out center;`
      );
      
      if (!clinicResponse.ok) {
        throw new Error('Failed to fetch clinic data');
      }
      
      const clinicData = await clinicResponse.json();
      
      const facilities: HealthFacility[] = [];

      // Process hospitals
      hospitalData.elements.forEach((element: any) => {
        const facilityLat = element.lat || element.center?.lat;
        const facilityLng = element.lon || element.center?.lon;
        if (facilityLat && facilityLng) {
          const distance = calculateDistance(lat, lng, facilityLat, facilityLng);
          
          facilities.push({
            name: element.tags?.name || 'โรงพยาบาลไม่ระบุชื่อ',
            lat: facilityLat,
            lng: facilityLng,
            distance: distance,
            type: 'hospital'
          });
        }
      });

      // Process clinics
      clinicData.elements.forEach((element: any) => {
        const facilityLat = element.lat || element.center?.lat;
        const facilityLng = element.lon || element.center?.lon;
        if (facilityLat && facilityLng) {
          const distance = calculateDistance(lat, lng, facilityLat, facilityLng);
          
          facilities.push({
            name: element.tags?.name || 'คลินิกไม่ระบุชื่อ',
            lat: facilityLat,
            lng: facilityLng,
            distance: distance,
            type: 'clinic'
          });
        }
      });

      // Sort by distance (closest first)
      facilities.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      setNearbyFacilities(facilities);
      
      // Clear existing markers
       clearAllMarkers();

      // Add new markers
      facilities.forEach(facility => {
        const icon = facility.type === 'hospital' ? hospitalIcon : clinicIcon;
        const facilityType = facility.type === 'hospital' ? 'โรงพยาบาล' : 'คลินิก/ศูนย์สุขภาพ';
        
        const marker = L.marker([facility.lat, facility.lng], { icon })
          .addTo(mapInstance.current!)
          .bindPopup(`
            <div style="min-width: 200px;">
              <strong>${facility.name}</strong><br>
              <small style="color: #666;">${facilityType}</small><br>
              <span style="color: #0066cc;">ระยะทาง: ${facility.distance?.toFixed(1)} กม.</span><br>
              <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}', '_blank')" 
                      style="margin-top: 8px; padding: 4px 8px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
                นำทาง
              </button>
            </div>
          `);
        
        // Add click event to center map on marker
        marker.on('click', () => {
          mapInstance.current?.setView([facility.lat, facility.lng], 16);
        });
        
        markersRef.current.push(marker);
      });

    } catch (error) {
      console.error('Error searching health facilities:', error);
      alert('เกิดข้อผิดพลาดในการค้นหาสถานพยาบาล กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleLocationSelect = (lat: number, lng: number, placeName: string) => {
    if (!mapInstance.current) return;

    // Remove Bangkok marker when a new location is selected
    if (bangkokMarkerRef.current) {
      mapInstance.current.removeLayer(bangkokMarkerRef.current);
      bangkokMarkerRef.current = null;
    }

    // Remove existing current location marker if any
    if (currentLocationMarkerRef.current) {
      mapInstance.current.removeLayer(currentLocationMarkerRef.current);
      currentLocationMarkerRef.current = null;
    }

    // Set the selected location
    setSelectedLocation({ lat, lng, name: placeName });
    
    // Center map on selected location
    mapInstance.current.setView([lat, lng], 14);
    
    // Add marker for selected location
    L.marker([lat, lng])
      .addTo(mapInstance.current)
      .bindPopup(`<strong>ตำแหน่งที่เลือก</strong><br>${placeName}`)
      .openPopup();

    // Search for nearby health facilities
    searchNearbyHealthFacilities(lat, lng);
  };

  const handleFacilityClick = (facility: HealthFacility) => {
    if (!mapInstance.current) return;
    
    // Center map on the facility and zoom in
    mapInstance.current.setView([facility.lat, facility.lng], 16);
    
    // Find and open the popup for this facility
    const marker = markersRef.current.find(m => {
      const pos = m.getLatLng();
      return Math.abs(pos.lat - facility.lat) < 0.0001 && Math.abs(pos.lng - facility.lng) < 0.0001;
    });
    
    if (marker) {
      marker.openPopup();
    }
  };

  const openInGoogleMaps = (facility: HealthFacility) => {
    const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(facility.name)}`;
    window.open(googleMapsUrl, '_blank');
  };

  // อัปเดต popup content เมื่อเปลี่ยนภาษา
  useEffect(() => {
    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.setPopupContent(t('maps.currentLocation'));
    }
  }, [language, t]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-medical-light">
        <div className="container-custom py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-medical-dark">{t('maps.title')}</h1>
                <p className="text-gray-600">{t('maps.subtitle')}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center gap-2 text-medical-blue">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">{t('maps.interactiveMap')}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {t('maps.selectLocation')}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  *{t('maps.type')}: <span className="text-red-500">{t('maps.typeHospital')}</span>, <span className="text-green-500">{t('maps.typeClinic')}</span>
                </p>
              </div>
              
              <div className="relative">
                <div 
                  ref={mapRef} 
                  className="w-full h-[600px]"
                  style={{ zIndex: 1 }}
                />
                
                {/* Location Search in top-left corner */}
                <div className="absolute top-4 left-4 z-[1000] w-80">
                  <LocationSearch onLocationSelect={handleLocationSelect} />
                </div>

                {/* Current Location Button in bottom-right */}
                <button
                  onClick={centerToCurrentLocation}
                  className="absolute bottom-7 right-4 w-12 h-12 bg-white hover:bg-gray-50 border-2 border-gray-300 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:shadow-xl z-[1000]"
                  title={t('maps.myLocation')}
                >
                  <Navigation className="h-5 w-5 text-medical-blue" />
                </button>
              </div>
            </div>

            {nearbyFacilities.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border mt-6">
                <div className="p-4 border-b">
                  <div className="flex items-center gap-2 text-medical-blue">
                    <Hospital className="h-5 w-5" />
                    <span className="font-medium">
                      {t('maps.nearbyFacilities')}{selectedLocation && ` - ${selectedLocation.name}`}
                    </span>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {nearbyFacilities.map((facility, index) => (
                    <div key={index} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer" onClick={() => handleFacilityClick(facility)}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {facility.type === 'hospital' ? (
                              <Hospital className="h-4 w-4 text-red-500" />
                            ) : (
                              <Building className="h-4 w-4 text-green-500" />
                            )}
                            <h4 className="font-medium text-medical-dark">{facility.name}</h4>
                          </div>
                          <p className="text-sm text-gray-600">
                            {facility.type === 'hospital'
                              ? t('maps.type') + t('maps.typeHospital')
                              : t('maps.type') + t('maps.typeClinic')
                            }
                            • {t('maps.distance')}: {facility.distance?.toFixed(1)} {t('maps.distance').includes('km') ? '' : 'กิโลเมตร'}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openInGoogleMaps(facility);
                          }}
                          className="text-medical-blue hover:text-medical-dark text-sm"
                        >
                          {t('maps.viewOnMap')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 text-center text-sm text-gray-500">
              <p>
                <strong>{t('common.warning')}</strong>: {t('symptom.disclaimer')}
              </p>
            </div>
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

export default Maps;