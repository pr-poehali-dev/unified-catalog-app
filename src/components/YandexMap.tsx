import { useEffect, useRef, useState } from 'react';

type YandexMapProps = {
  places: Array<{
    id: number;
    name: string;
    lat: number;
    lng: number;
    category: string;
    rating: number;
  }>;
  selectedPlaceId?: number | null;
  onPlaceClick?: (id: number) => void;
  centerLat?: number;
  centerLng?: number;
};

declare global {
  interface Window {
    ymaps: any;
  }
}

export default function YandexMap({ 
  places, 
  selectedPlaceId, 
  onPlaceClick,
  centerLat = 55.7558,
  centerLng = 37.6173
}: YandexMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const placemarksRef = useRef<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadYandexMap = () => {
      if (window.ymaps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=&lang=ru_RU';
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(initMap);
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      mapInstanceRef.current = new window.ymaps.Map(mapRef.current, {
        center: [centerLat, centerLng],
        zoom: 13,
        controls: ['zoomControl', 'geolocationControl']
      });

      setIsLoading(false);
      updatePlacemarks();
    };

    loadYandexMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && !isLoading) {
      updatePlacemarks();
    }
  }, [places, isLoading]);

  useEffect(() => {
    if (selectedPlaceId && mapInstanceRef.current) {
      const selectedPlace = places.find(p => p.id === selectedPlaceId);
      if (selectedPlace) {
        mapInstanceRef.current.setCenter([selectedPlace.lat, selectedPlace.lng], 15, {
          duration: 300
        });

        placemarksRef.current.forEach(pm => {
          const placemarkData = pm.properties.get('placeData');
          if (placemarkData.id === selectedPlaceId) {
            pm.options.set('iconColor', '#0EA5E9');
          } else {
            pm.options.set('iconColor', getCategoryColor(placemarkData.category));
          }
        });
      }
    }
  }, [selectedPlaceId, places]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Кафе': '#F97316',
      'Ресторан': '#EF4444',
      'Спорт': '#10B981',
      'Красота': '#EC4899',
      'Магазин': '#8B5CF6'
    };
    return colors[category] || '#0EA5E9';
  };

  const updatePlacemarks = () => {
    if (!mapInstanceRef.current || !window.ymaps) return;

    placemarksRef.current.forEach(pm => mapInstanceRef.current.geoObjects.remove(pm));
    placemarksRef.current = [];

    places.forEach(place => {
      const placemark = new window.ymaps.Placemark(
        [place.lat, place.lng],
        {
          balloonContent: `
            <div style="padding: 8px; font-family: Inter, sans-serif;">
              <strong style="font-size: 16px; display: block; margin-bottom: 8px;">${place.name}</strong>
              <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
                <span style="color: #FFA500;">⭐</span>
                <span style="font-weight: 600;">${place.rating}</span>
              </div>
              <span style="color: #0EA5E9; font-size: 12px; background: #F0F9FF; padding: 2px 8px; border-radius: 12px;">
                ${place.category}
              </span>
            </div>
          `,
          placeData: place
        },
        {
          preset: 'islands#circleDotIcon',
          iconColor: selectedPlaceId === place.id ? '#0EA5E9' : getCategoryColor(place.category)
        }
      );

      placemark.events.add('click', () => {
        if (onPlaceClick) {
          onPlaceClick(place.id);
        }
      });

      mapInstanceRef.current.geoObjects.add(placemark);
      placemarksRef.current.push(placemark);
    });

    if (places.length > 0) {
      mapInstanceRef.current.setBounds(
        mapInstanceRef.current.geoObjects.getBounds(),
        { checkZoomRange: true, zoomMargin: 50 }
      );
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm rounded-lg">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Загрузка карты...</p>
          </div>
        </div>
      )}
    </div>
  );
}
