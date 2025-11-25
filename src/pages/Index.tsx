import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

type Screen = 'chat' | 'menu' | 'payment';

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Привет! 👋 Я твой дружелюбный бот-помощник. Чем могу быть полезен?',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [screen, setScreen] = useState<Screen>('chat');
  const [inputValue, setInputValue] = useState('');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    amount: '500',
  });

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
        text: 'Отличный вопрос! Давай я помогу тебе с этим 😊',
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 800);
  };

  const handleMenuClick = (option: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: option,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      let botResponse = '';
      if (option === '💳 Оплатить услугу') {
        setScreen('payment');
        botResponse = 'Отлично! Перехожу к оплате...';
      } else if (option === 'ℹ️ Информация') {
        botResponse = 'Я бот-помощник, который поможет тебе с любыми вопросами! Работаю 24/7 🌟';
      } else if (option === '📞 Поддержка') {
        botResponse = 'Наша поддержка всегда на связи! Напиши свой вопрос, и я передам его специалистам 🚀';
      }

      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 600);
  };

  const handlePayment = () => {
    if (
      !paymentData.cardNumber ||
      !paymentData.expiryDate ||
      !paymentData.cvv
    ) {
      toast.error('Заполни все поля карты');
      return;
    }

    toast.success('Оплата успешно прошла! 🎉');
    setScreen('chat');

    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 1,
        text: `Платёж на ${paymentData.amount}₽ успешно обработан! Спасибо за доверие 💙`,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setPaymentData({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        amount: '500',
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-telegram-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md h-[600px] flex flex-col shadow-2xl overflow-hidden">
        <div className="bg-telegram-blue text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="Bot" size={24} />
            </div>
            <div>
              <h1 className="font-semibold text-lg">Дружелюбный Бот</h1>
              <p className="text-xs text-white/80">всегда онлайн</p>
            </div>
          </div>
          {screen !== 'chat' && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setScreen('chat')}
            >
              <Icon name="X" size={20} />
            </Button>
          )}
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
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Главное меню
            </h2>
            {[
              { icon: 'CreditCard', text: '💳 Оплатить услугу' },
              { icon: 'Info', text: 'ℹ️ Информация' },
              { icon: 'Headphones', text: '📞 Поддержка' },
            ].map((item) => (
              <Button
                key={item.text}
                variant="outline"
                className="w-full justify-start h-14 text-base hover:bg-telegram-blue/10 hover:border-telegram-blue transition-all"
                onClick={() => {
                  handleMenuClick(item.text);
                  setScreen('chat');
                }}
              >
                <Icon name={item.icon as any} size={20} className="mr-3" />
                {item.text}
              </Button>
            ))}
          </div>
        )}

        {screen === 'payment' && (
          <div className="flex-1 p-6 space-y-4 overflow-y-auto animate-slide-up">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Оплата услуги
            </h2>
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
                      setPaymentData({
                        ...paymentData,
                        expiryDate: e.target.value,
                      })
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
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Сумма к оплате
                </label>
                <Input
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, amount: e.target.value })
                  }
                  className="text-lg font-semibold"
                />
              </div>
              <Button
                onClick={handlePayment}
                className="w-full h-12 bg-telegram-blue hover:bg-telegram-blue/90 text-base font-semibold"
              >
                <Icon name="Lock" size={18} className="mr-2" />
                Оплатить {paymentData.amount}₽
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
