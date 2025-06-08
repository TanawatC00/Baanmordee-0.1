
import React, { useEffect, useRef } from 'react';

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

interface HospitalMapViewProps {
  hospitals: Hospital[];
  userLocation: UserLocation | null;
  selectedHospital: Hospital | null;
  onSelectHospital: (hospital: Hospital) => void;
}

const HospitalMapView: React.FC<HospitalMapViewProps> = ({
  hospitals,
  userLocation,
  selectedHospital,
  onSelectHospital
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map with OpenStreetMap
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      const L = (window as any).L;
      
      // Create map
      const map = L.map(mapRef.current).setView([13.7563, 100.5018], 10); // Bangkok center
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      
      mapInstanceRef.current = map;
      
      // Update markers when data changes
      updateMarkers();
    };

    // Add CSS for Leaflet
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  const updateMarkers = () => {
    if (!mapInstanceRef.current || !(window as any).L) return;
    
    const L = (window as any).L;
    const map = mapInstanceRef.current;
    
    // Clear existing markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];
    
    // Add user location marker
    if (userLocation) {
      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: L.divIcon({
          html: `<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          className: 'custom-div-icon',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
      }).addTo(map);
      
      userMarker.bindPopup(`
        <div class="p-2">
          <strong>ตำแหน่งของคุณ</strong><br>
          <small>${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}</small>
        </div>
      `);
      
      markersRef.current.push(userMarker);
      
      // Center map on user location
      map.setView([userLocation.lat, userLocation.lng], 12);
    }
    
    // Add hospital markers
    hospitals.forEach(hospital => {
      const isSelected = selectedHospital?.id === hospital.id;
      const color = isSelected ? '#10b981' : '#ef4444';
      
      const hospitalMarker = L.marker([hospital.lat, hospital.lng], {
        icon: L.divIcon({
          html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 3px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          className: 'custom-div-icon',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })
      }).addTo(map);
      
      hospitalMarker.bindPopup(`
        <div class="p-3 max-w-xs">
          <strong class="text-medical-blue">${hospital.name}</strong><br>
          <div class="text-sm text-gray-600 mt-1">
            ${hospital.address}
          </div>
          ${hospital.phone ? `<div class="text-sm text-gray-600 mt-1">โทร: ${hospital.phone}</div>` : ''}
          ${hospital.distance ? `<div class="text-sm text-medical-green font-medium mt-1">ระยะทาง: ${hospital.distance.toFixed(2)} กม.</div>` : ''}
          <button onclick="window.selectHospital('${hospital.id}')" class="mt-2 px-3 py-1 bg-medical-blue text-white text-xs rounded hover:bg-medical-blue/90">
            เลือกโรงพยาบาลนี้
          </button>
        </div>
      `);
      
      hospitalMarker.on('click', () => {
        onSelectHospital(hospital);
      });
      
      markersRef.current.push(hospitalMarker);
    });
  };

  // Global function for popup buttons
  useEffect(() => {
    (window as any).selectHospital = (hospitalId: string) => {
      const hospital = hospitals.find(h => h.id === hospitalId);
      if (hospital) {
        onSelectHospital(hospital);
      }
    };
    
    return () => {
      delete (window as any).selectHospital;
    };
  }, [hospitals, onSelectHospital]);

  useEffect(() => {
    updateMarkers();
  }, [hospitals, userLocation, selectedHospital]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[600px] rounded-lg"
      style={{ minHeight: '600px' }}
    />
  );
};

export default HospitalMapView;