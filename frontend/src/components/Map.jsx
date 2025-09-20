import { ubicacion } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
export default function MapComponent() {
  const [locations, setLocations] = useState([]);
  const mapRef = useRef(null); // referencia al contenedor del mapa
  const mapInstance = useRef(null);

  useEffect(() => {
    const fetchUbicacion = async () => {
      const data = await ubicacion();
      console.log(data)
      setLocations(data);
    };

    fetchUbicacion(); 
    console.log("adios");
  }, []);


  useEffect(() => {
    // Función para cargar el script solo una vez
    const loadScript = () => {
      return new Promise((resolve, reject) => {
        if (document.getElementById("google-maps-script")) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD2xkNKHun9x2ibBsC403nzSWq-ksqC7aE`;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const initMap = async () => {
      await loadScript();

      if (!mapInstance.current) {
        // Crear mapa solo la primera vez
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          zoom: 5,
          center: { lat: 19.432608, lng: -99.133209 },
        });
      }

      // Agregar marcadores
      locations.forEach((loc) => {
        new window.google.maps.Marker({
          position: { lat: loc.lat, lng: loc.lng },
          map: mapInstance.current,
          title: loc.name,
        });
      });
    };

    if (locations.length > 0) {
      initMap();
    }
  }, [locations]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "500px" }}
    ></div>
  );
}
