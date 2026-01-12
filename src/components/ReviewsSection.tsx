import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

type Review = {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
  helpful: number;
};

type ReviewsSectionProps = {
  placeId: number;
  placeName: string;
  overallRating: number;
  totalReviews: number;
};

const mockReviews: Record<number, Review[]> = {
  1: [
    {
      id: 1,
      author: 'Анна Петрова',
      rating: 5,
      date: '2 дня назад',
      text: 'Прекрасное место! Кофе просто божественный, особенно капучино. Атмосфера уютная, персонал очень дружелюбный. Обязательно вернусь!',
      helpful: 12
    },
    {
      id: 2,
      author: 'Дмитрий Иванов',
      rating: 4,
      date: '5 дней назад',
      text: 'Хорошая кофейня, но в выходные много людей и приходится ждать место. Кофе вкусный, цены адекватные.',
      helpful: 8
    },
    {
      id: 3,
      author: 'Елена Смирнова',
      rating: 5,
      date: '1 неделю назад',
      text: 'Лучшая кофейня в районе! Выпечка свежая каждый день, кофе ароматный. Отличное место для работы с ноутбуком.',
      helpful: 15
    }
  ],
  2: [
    {
      id: 4,
      author: 'Михаил Козлов',
      rating: 5,
      date: '3 дня назад',
      text: 'Отличный ресторан! Кухня превосходная, обслуживание на высоте. Рекомендую попробовать стейк - готовят идеально!',
      helpful: 20
    },
    {
      id: 5,
      author: 'Ольга Волкова',
      rating: 4,
      date: '1 неделю назад',
      text: 'Очень красивый вид из окон, интерьер стильный. Еда вкусная, но цены выше среднего.',
      helpful: 10
    }
  ],
  3: [
    {
      id: 6,
      author: 'Александр Попов',
      rating: 5,
      date: '4 дня назад',
      text: 'Лучший фитнес-клуб в городе! Современное оборудование, чистый бассейн, профессиональные тренеры. Полностью оправдывает цену.',
      helpful: 25
    },
    {
      id: 7,
      author: 'Наталья Белова',
      rating: 5,
      date: '1 неделю назад',
      text: 'Хожу уже полгода, очень довольна! Удобное расписание групповых занятий, просторный зал.',
      helpful: 18
    }
  ],
  4: [
    {
      id: 8,
      author: 'Виктория Морозова',
      rating: 5,
      date: '2 дня назад',
      text: 'Отличный салон! Мастера - профессионалы своего дела. Делала стрижку и окрашивание, результат превзошёл ожидания!',
      helpful: 14
    },
    {
      id: 9,
      author: 'Екатерина Павлова',
      rating: 4,
      date: '1 неделю назад',
      text: 'Хороший салон, приятная атмосфера. Единственный минус - нужно записываться заранее, свободных мест мало.',
      helpful: 9
    }
  ],
  5: [
    {
      id: 10,
      author: 'Сергей Никитин',
      rating: 4,
      date: '3 дня назад',
      text: 'Большой выбор книг, можно найти редкие издания. Персонал поможет с выбором. Уютное место, есть зона для чтения.',
      helpful: 11
    },
    {
      id: 11,
      author: 'Мария Соколова',
      rating: 5,
      date: '2 недели назад',
      text: 'Обожаю этот магазин! Провожу здесь часы, читая книги в уютном кресле. Отличная коллекция современной литературы.',
      helpful: 16
    }
  ]
};

export default function ReviewsSection({ placeId, placeName, overallRating, totalReviews }: ReviewsSectionProps) {
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');

  const reviews = mockReviews[placeId] || [];

  const ratingDistribution = {
    5: Math.floor(totalReviews * 0.6),
    4: Math.floor(totalReviews * 0.25),
    3: Math.floor(totalReviews * 0.1),
    2: Math.floor(totalReviews * 0.03),
    1: Math.floor(totalReviews * 0.02)
  };

  const handleSubmitReview = () => {
    if (newReviewRating > 0 && newReviewText.trim()) {
      setNewReviewText('');
      setNewReviewRating(0);
      setShowWriteReview(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-primary">{overallRating}</div>
              <div className="flex items-center justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={20}
                    className={i < Math.floor(overallRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{totalReviews} отзывов</p>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{rating}</span>
                  <Icon name="Star" size={14} className="fill-yellow-400 text-yellow-400" />
                </div>
                <Progress 
                  value={(ratingDistribution[rating as keyof typeof ratingDistribution] / totalReviews) * 100} 
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {ratingDistribution[rating as keyof typeof ratingDistribution]}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {!showWriteReview ? (
        <Button 
          onClick={() => setShowWriteReview(true)} 
          className="w-full" 
          size="lg"
        >
          <Icon name="Edit" size={18} className="mr-2" />
          Написать отзыв
        </Button>
      ) : (
        <Card className="border-primary">
          <CardHeader>
            <h3 className="font-semibold">Ваш отзыв о {placeName}</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Оценка</p>
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setNewReviewRating(i + 1)}
                    className="hover:scale-110 transition-transform"
                  >
                    <Icon
                      name="Star"
                      size={32}
                      className={i < newReviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Комментарий</p>
              <Textarea
                placeholder="Поделитесь впечатлениями..."
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleSubmitReview}
                disabled={newReviewRating === 0 || !newReviewText.trim()}
                className="flex-1"
              >
                Опубликовать
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowWriteReview(false);
                  setNewReviewRating(0);
                  setNewReviewText('');
                }}
              >
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Отзывы посетителей</h3>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4 pr-4">
            {reviews.map(review => (
              <Card key={review.id} className="animate-fade-in">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {review.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{review.author}</p>
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Icon
                              key={i}
                              name="Star"
                              size={14}
                              className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed">{review.text}</p>

                      <div className="flex items-center gap-4 pt-2">
                        <Button variant="ghost" size="sm" className="h-8 gap-1">
                          <Icon name="ThumbsUp" size={14} />
                          <span className="text-xs">Полезно ({review.helpful})</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
