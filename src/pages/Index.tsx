import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  image?: string;
}

interface Photo {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem {
  photo: Photo;
  quantity: number;
}

type Screen = 'chat' | 'menu' | 'gallery' | 'cart' | 'payment';

const PHOTOS: Photo[] = [
  {
    id: 1,
    title: 'Горный закат',
    price: 990,
    image: 'https://cdn.poehali.dev/projects/b12bdc6a-2bcb-4f7f-aa16-08884c737943/files/34fdedb1-04dd-4bb4-ad24-3fae3a1f66f3.jpg',
    category: 'Природа',
  },
  {
    id: 2,
    title: 'Ночной город',
    price: 1290,
    image: 'https://cdn.poehali.dev/projects/b12bdc6a-2bcb-4f7f-aa16-08884c737943/files/febd228a-3226-4abe-a4d9-d4dc2b3a9349.jpg',
    category: 'Город',
  },
  {
    id: 3,
    title: 'Минимализм',
    price: 890,
    image: 'https://cdn.poehali.dev/projects/b12bdc6a-2bcb-4f7f-aa16-08884c737943/files/6a5839f3-8463-4345-8781-22d0c495a1f2.jpg',
    category: 'Натюрморт',
  },
];

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Привет! 📸 Я продаю крутые фотографии. Давай покажу тебе коллекцию?',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [screen, setScreen] = useState<Screen>('chat');
  const [inputValue, setInputValue] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const addToCart = (photo: Photo) => {
    const existingItem = cart.find((item) => item.photo.id === photo.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.photo.id === photo.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { photo, quantity: 1 }]);
    }
    toast.success(`${photo.title} добавлено в корзину!`);
  };

  const removeFromCart = (photoId: number) => {
    setCart(cart.filter((item) => item.photo.id !== photoId));
    toast.success('Удалено из корзины');
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.photo.price * item.quantity, 0);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: 'Конечно! Открываю галерею... 📸',
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setScreen('gallery');
    }, 800);
  };

  const handleMenuClick = (option: string) => {
    if (option === '📸 Галерея фото') {
      setScreen('gallery');
    } else if (option === '🛒 Корзина') {
      setScreen('cart');
    } else if (option === 'ℹ️ О магазине') {
      const botMessage: Message = {
        id: messages.length + 1,
        text: 'Я продаю эксклюзивные фотографии высокого качества! Все права на использование передаются после покупки 🎨',
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setScreen('chat');
    }
  };

  const handlePayment = () => {
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv) {
      toast.error('Заполни все поля карты');
      return;
    }

    toast.success('Оплата прошла! Фото отправлены на email 🎉');
    setCart([]);
    setScreen('chat');

    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 1,
        text: `Спасибо за покупку на ${getTotalPrice()}₽! Фото в высоком качестве отправлены тебе на почту 💙`,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setPaymentData({ cardNumber: '', expiryDate: '', cvv: '' });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-telegram-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md h-[600px] flex flex-col shadow-2xl overflow-hidden">
        <div className="bg-telegram-blue text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="Camera" size={24} />
            </div>
            <div>
              <h1 className="font-semibold text-lg">Фото Магазин</h1>
              <p className="text-xs text-white/80">онлайн</p>
            </div>
          </div>
          <div className="flex gap-2">
            {cart.length > 0 && screen !== 'cart' && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 relative"
                onClick={() => setScreen('cart')}
              >
                <Icon name="ShoppingCart" size={20} />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                  {cart.length}
                </Badge>
              </Button>
            )}
            {screen !== 'chat' && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setScreen('chat')}
              >
                <Icon name="MessageCircle" size={20} />
              </Button>
            )}
          </div>
        </div>

        {screen === 'chat' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      msg.isBot
                        ? 'bg-white text-gray-800 rounded-tl-none'
                        : 'bg-telegram-blue text-white rounded-tr-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.isBot ? 'text-gray-400' : 'text-white/70'
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t">
              <div className="flex gap-2 mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-telegram-blue border-telegram-blue hover:bg-telegram-blue/10"
                  onClick={() => setScreen('menu')}
                >
                  <Icon name="Menu" size={16} className="mr-1" />
                  Меню
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Напиши сообщение..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-telegram-blue hover:bg-telegram-blue/90"
                >
                  <Icon name="Send" size={18} />
                </Button>
              </div>
            </div>
          </>
        )}

        {screen === 'menu' && (
          <div className="flex-1 p-6 space-y-3 animate-slide-up">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Главное меню</h2>
            {[
              { icon: 'Camera', text: '📸 Галерея фото' },
              { icon: 'ShoppingCart', text: '🛒 Корзина' },
              { icon: 'Info', text: 'ℹ️ О магазине' },
            ].map((item) => (
              <Button
                key={item.text}
                variant="outline"
                className="w-full justify-start h-14 text-base hover:bg-telegram-blue/10 hover:border-telegram-blue transition-all"
                onClick={() => handleMenuClick(item.text)}
              >
                <Icon name={item.icon as any} size={20} className="mr-3" />
                {item.text}
              </Button>
            ))}
          </div>
        )}

        {screen === 'gallery' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Галерея фото
            </h2>
            {PHOTOS.map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{photo.title}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {photo.category}
                      </Badge>
                    </div>
                    <p className="text-xl font-bold text-telegram-blue">
                      {photo.price}₽
                    </p>
                  </div>
                  <Button
                    onClick={() => addToCart(photo)}
                    className="w-full bg-telegram-blue hover:bg-telegram-blue/90"
                  >
                    <Icon name="ShoppingCart" size={16} className="mr-2" />
                    В корзину
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {screen === 'cart' && (
          <div className="flex-1 flex flex-col animate-slide-up">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Корзина ({cart.length})
              </h2>
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Icon name="ShoppingCart" size={48} className="mx-auto mb-3 opacity-30" />
                  <p>Корзина пуста</p>
                </div>
              ) : (
                cart.map((item) => (
                  <Card key={item.photo.id} className="p-3 flex gap-3">
                    <img
                      src={item.photo.image}
                      alt={item.photo.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.photo.title}</h3>
                      <p className="text-sm text-gray-600">
                        {item.photo.price}₽ × {item.quantity}
                      </p>
                      <p className="text-telegram-blue font-bold">
                        {item.photo.price * item.quantity}₽
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.photo.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Icon name="Trash2" size={18} />
                    </Button>
                  </Card>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-4 bg-white border-t space-y-3">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Итого:</span>
                  <span className="text-telegram-blue">{getTotalPrice()}₽</span>
                </div>
                <Button
                  onClick={() => setScreen('payment')}
                  className="w-full h-12 bg-telegram-blue hover:bg-telegram-blue/90"
                >
                  Оформить заказ
                </Button>
              </div>
            )}
          </div>
        )}

        {screen === 'payment' && (
          <div className="flex-1 p-6 space-y-4 overflow-y-auto animate-slide-up">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Оплата</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Номер карты
                </label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, cardNumber: e.target.value })
                  }
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Срок действия
                  </label>
                  <Input
                    placeholder="MM/YY"
                    value={paymentData.expiryDate}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, expiryDate: e.target.value })
                    }
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    CVV
                  </label>
                  <Input
                    placeholder="123"
                    type="password"
                    value={paymentData.cvv}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, cvv: e.target.value })
                    }
                    maxLength={3}
                  />
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Сумма к оплате:</p>
                <p className="text-2xl font-bold text-telegram-blue">
                  {getTotalPrice()}₽
                </p>
              </div>
              <Button
                onClick={handlePayment}
                className="w-full h-12 bg-telegram-blue hover:bg-telegram-blue/90 text-base font-semibold"
              >
                <Icon name="Lock" size={18} className="mr-2" />
                Оплатить {getTotalPrice()}₽
              </Button>
              <p className="text-xs text-gray-500 text-center">
                🔒 Платёж защищён и полностью безопасен
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
