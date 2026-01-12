import { useEffect, useRef } from 'react';

type Place = {
  id: number;
  name: string;
  category: string;
  rating: number;
  lat: number;
  lng: number;
};

type MapProps = {
  places: Place[];
  selectedPlaceId?: number | null;
  onPlaceClick?: (placeId: number) => void;
};

declare global {
  interface Window {
    ymaps: any;
  }
}

export default function Map({ places, selectedPlaceId, onPlaceClick }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const placeMarksRef = useRef<any[]>([]);

  useEffect(() => {
    const loadYandexMaps = () => {
      if (window.ymaps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=ru_RU';
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(initializeMap);
      };
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = new window.ymaps.Map(mapRef.current, {
        center: [55.7558, 37.6173],
        zoom: 12,
        controls: ['zoomControl', 'searchControl', 'typeSelector', 'fullscreenControl']
      });

      mapInstanceRef.current = map;
      updateMarkers();
    };

    const updateMarkers = () => {
      if (!mapInstanceRef.current) return;

      placeMarksRef.current.forEach(mark => {
        mapInstanceRef.current.geoObjects.remove(mark);
      });
      placeMarksRef.current = [];

      places.forEach(place => {
        const placemark = new window.ymaps.Placemark(
          [place.lat, place.lng],
          {
            balloonContentHeader: `<strong>${place.name}</strong>`,
            balloonContentBody: `
              <div style="padding: 8px;">
                <p style="margin: 4px 0;"><strong>Категория:</strong> ${place.category}</p>
                <p style="margin: 4px 0;"><strong>Рейтинг:</strong> ⭐ ${place.rating}</p>
              </div>
            `,
            iconCaption: place.name
          },
          {
            preset: selectedPlaceId === place.id ? 'islands#redDotIcon' : 'islands#blueDotIcon',
            iconCaptionMaxWidth: '200'
          }
        );

        placemark.events.add('click', () => {
          if (onPlaceClick) {
            onPlaceClick(place.id);
          }
        });

        mapInstanceRef.current.geoObjects.add(placemark);
        placeMarksRef.current.push(placemark);
      });

      if (places.length > 0) {
        mapInstanceRef.current.setBounds(
          mapInstanceRef.current.geoObjects.getBounds(),
          { checkZoomRange: true, zoomMargin: 50 }
        );
      }
    };

    loadYandexMaps();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && placeMarksRef.current.length > 0) {
      placeMarksRef.current.forEach((mark, index) => {
        const place = places[index];
        if (place) {
          mark.options.set(
            'preset',
            selectedPlaceId === place.id ? 'islands#redDotIcon' : 'islands#blueDotIcon'
          );
        }
      });
    }
  }, [selectedPlaceId, places]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      placeMarksRef.current.forEach(mark => {
        mapInstanceRef.current.geoObjects.remove(mark);
      });
      placeMarksRef.current = [];

      places.forEach(place => {
        const placemark = new window.ymaps.Placemark(
          [place.lat, place.lng],
          {
            balloonContentHeader: `<strong>${place.name}</strong>`,
            balloonContentBody: `
              <div style="padding: 8px;">
                <p style="margin: 4px 0;"><strong>Категория:</strong> ${place.category}</p>
                <p style="margin: 4px 0;"><strong>Рейтинг:</strong> ⭐ ${place.rating}</p>
              </div>
            `,
            iconCaption: place.name
          },
          {
            preset: selectedPlaceId === place.id ? 'islands#redDotIcon' : 'islands#blueDotIcon',
            iconCaptionMaxWidth: '200'
          }
        );

        placemark.events.add('click', () => {
          if (onPlaceClick) {
            onPlaceClick(place.id);
          }
        });

        mapInstanceRef.current.geoObjects.add(placemark);
        placeMarksRef.current.push(placemark);
      });

      if (places.length > 0) {
        mapInstanceRef.current.setBounds(
          mapInstanceRef.current.geoObjects.getBounds(),
          { checkZoomRange: true, zoomMargin: 50 }
        );
      }
    }
  }, [places, selectedPlaceId, onPlaceClick]);

  return <div ref={mapRef} className="w-full h-full" />;
}
