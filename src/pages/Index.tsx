import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import Map from '@/components/Map';

type Place = {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  address: string;
  phone: string;
  hours: string;
  description: string;
  lat: number;
  lng: number;
  image: string;
};

const mockPlaces: Place[] = [
  {
    id: 1,
    name: 'Кофейня "Утро"',
    category: 'Кафе',
    rating: 4.8,
    reviews: 234,
    address: 'ул. Ленина, 45',
    phone: '+7 (495) 123-45-67',
    hours: '08:00 - 22:00',
    description: 'Уютная кофейня с авторскими напитками и домашней выпечкой',
    lat: 55.7558,
    lng: 37.6173,
    image: '/placeholder.svg'
  },
  {
    id: 2,
    name: 'Ресторан "Вкус"',
    category: 'Ресторан',
    rating: 4.6,
    reviews: 189,
    address: 'пр. Мира, 12',
    phone: '+7 (495) 234-56-78',
    hours: '11:00 - 23:00',
    description: 'Европейская кухня и панорамный вид на город',
    lat: 55.7620,
    lng: 37.6140,
    image: '/placeholder.svg'
  },
  {
    id: 3,
    name: 'Фитнес-клуб "Энергия"',
    category: 'Спорт',
    rating: 4.9,
    reviews: 456,
    address: 'ул. Советская, 78',
    phone: '+7 (495) 345-67-89',
    hours: '06:00 - 23:00',
    description: 'Современный тренажерный зал с бассейном и сауной',
    lat: 55.7496,
    lng: 37.6206,
    image: '/placeholder.svg'
  },
  {
    id: 4,
    name: 'Салон красоты "Стиль"',
    category: 'Красота',
    rating: 4.7,
    reviews: 321,
    address: 'ул. Пушкина, 23',
    phone: '+7 (495) 456-78-90',
    hours: '09:00 - 21:00',
    description: 'Профессиональные мастера и качественные материалы',
    lat: 55.7584,
    lng: 37.6252,
    image: '/placeholder.svg'
  },
  {
    id: 5,
    name: 'Книжный магазин "Чтение"',
    category: 'Магазин',
    rating: 4.5,
    reviews: 167,
    address: 'пр. Победы, 56',
    phone: '+7 (495) 567-89-01',
    hours: '10:00 - 20:00',
    description: 'Большой выбор книг и уютная атмосфера для чтения',
    lat: 55.7532,
    lng: 37.6098,
    image: '/placeholder.svg'
  }
];

const categories = ['Все', 'Кафе', 'Ресторан', 'Спорт', 'Красота', 'Магазин'];

export default function Index() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('catalog');

  const filteredPlaces = mockPlaces.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         place.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || place.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const favoritePlaces = mockPlaces.filter(place => favorites.includes(place.id));

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex flex-col w-full md:w-96 border-r border-border bg-card">
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Каталог мест</h1>
            <Button variant="ghost" size="icon">
              <Icon name="User" size={20} />
            </Button>
          </div>

          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск мест и услуг..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="catalog">Каталог</TabsTrigger>
              <TabsTrigger value="favorites">
                Избранное {favorites.length > 0 && `(${favorites.length})`}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <TabsContent value="catalog" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              <div className="flex gap-2 flex-wrap">
                {categories.map(category => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "secondary"}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>

              <div className="space-y-3 animate-fade-in">
                {filteredPlaces.map(place => (
                  <Card
                    key={place.id}
                    className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
                    onClick={() => setSelectedPlace(place)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{place.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {place.category}
                            </Badge>
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(place.id);
                          }}
                        >
                          <Icon
                            name={favorites.includes(place.id) ? "Heart" : "Heart"}
                            size={18}
                            className={favorites.includes(place.id) ? "fill-red-500 text-red-500" : ""}
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{place.rating}</span>
                        <span className="text-muted-foreground">({place.reviews} отзывов)</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Icon name="MapPin" size={16} className="mt-0.5 shrink-0" />
                        <span>{place.address}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="favorites" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              {favoritePlaces.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Icon name="Heart" size={48} className="text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Нет избранных мест</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Добавляйте места в избранное, чтобы быстро находить их
                  </p>
                </div>
              ) : (
                <div className="space-y-3 animate-fade-in">
                  {favoritePlaces.map(place => (
                    <Card
                      key={place.id}
                      className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
                      onClick={() => setSelectedPlace(place)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{place.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {place.category}
                              </Badge>
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(place.id);
                            }}
                          >
                            <Icon
                              name="Heart"
                              size={18}
                              className="fill-red-500 text-red-500"
                            />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Icon name="Star" size={16} className="fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{place.rating}</span>
                          <span className="text-muted-foreground">({place.reviews} отзывов)</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Icon name="MapPin" size={16} className="mt-0.5 shrink-0" />
                          <span>{place.address}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </div>

      <div className="flex-1 relative bg-muted">
        <Map
          places={filteredPlaces}
          selectedPlaceId={selectedPlace?.id}
          onPlaceClick={(id) => {
            const place = mockPlaces.find(p => p.id === id);
            if (place) setSelectedPlace(place);
          }}
        />
      </div>

      <Sheet open={!!selectedPlace} onOpenChange={() => setSelectedPlace(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto animate-slide-in-right">
          {selectedPlace && (
            <>
              <SheetHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <SheetTitle className="text-2xl">{selectedPlace.name}</SheetTitle>
                    <SheetDescription className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{selectedPlace.category}</Badge>
                    </SheetDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(selectedPlace.id);
                    }}
                  >
                    <Icon
                      name="Heart"
                      size={20}
                      className={favorites.includes(selectedPlace.id) ? "fill-red-500 text-red-500" : ""}
                    />
                  </Button>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={selectedPlace.image}
                    alt={selectedPlace.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Icon name="Star" size={20} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-bold">{selectedPlace.rating}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {selectedPlace.reviews} отзывов
                  </span>
                  <Button variant="link" size="sm" className="ml-auto">
                    Все отзывы
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Icon name="FileText" size={18} />
                      Описание
                    </h3>
                    <p className="text-muted-foreground">{selectedPlace.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Icon name="MapPin" size={18} />
                      Адрес
                    </h3>
                    <p className="text-muted-foreground">{selectedPlace.address}</p>
                    <Button variant="link" size="sm" className="px-0 mt-1">
                      Показать на карте
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Icon name="Phone" size={18} />
                      Телефон
                    </h3>
                    <p className="text-muted-foreground">{selectedPlace.phone}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Icon name="Clock" size={18} />
                      Часы работы
                    </h3>
                    <p className="text-muted-foreground">{selectedPlace.hours}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <Button className="w-full" size="lg">
                    <Icon name="Phone" size={18} className="mr-2" />
                    Позвонить
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Icon name="Navigation" size={18} className="mr-2" />
                    Построить маршрут
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}