import React, { useState } from 'react';
import { MessageCircle, X, Send, Phone, MapPin, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const DimosLiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'agent' | 'user'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: 'مرحباً بك في مفروشات ديموس! 🛋️ أنا زيد من خدمة العملاء. هل ترغب بمساعدتك في اختيار المقاس المناسب لصالتك أو تفعيل كود الخصم ND96؟',
      time: 'الآن',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    soundFx.playClick();
    const userMsg = inputText.trim();
    const newMsgs = [...messages, { sender: 'user' as const, text: userMsg, time: 'الآن' }];
    setMessages(newMsgs);
    setInputText('');

    // Automated smart assistant replies
    setTimeout(() => {
      soundFx.playSuccess();
      let reply = 'يسعدنا خدمتك! يمكنك التواصل معنا مباشرة أيضاً عبر الرقم المجاني 920008317 أو زيارة استوديو مستودع الرياض لتجربة الكنب على الطبيعة 🤍';

      const lower = userMsg.toLowerCase();
      if (lower.includes('كود') || lower.includes('خصم') || lower.includes('عرض')) {
        reply = 'أهلاً بك! استخدم كود ND96 لخصم 55% + 96 ريال إضافية عند الدفع، أو كود NEWDM لخصم 5% للعملاء الجدد ✨';
      } else if (lower.includes('تقسيط') || lower.includes('تابي') || lower.includes('تمارا')) {
        reply = 'نعم! نوفر تقسيط ميسر بدون أي فوائد على 4 دفعات عبر تابي (Tabby) وتمارا (Tamara) 💳';
      } else if (lower.includes('توصيل') || lower.includes('شحن')) {
        reply = 'التوصيل مجاني بالكامل داخل الرياض، القصيم، جدة والدمام 🚚 مع إمكانية التوصيل لباقي مدن المملكة.';
      } else if (lower.includes('معاينة') || lower.includes('ار') || lower.includes('واقع') || lower.includes('ar')) {
        reply = 'يمكنك الضغط على زر "معاينة بالواقع المعزز AR" أعلى الصفحة لرؤية أي كنب في صالتك بكاميرا الجوال بالأبعاد الحقيقية 1:1!';
      }

      setMessages((prev) => [...prev, { sender: 'agent', text: reply, time: 'الآن' }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-5 left-5 z-40 text-right select-none">
      
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col h-[450px] animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header with Zaid Profile */}
          <div className="p-4 bg-gradient-to-r from-red-950 via-neutral-900 to-red-950 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-red-600 border-2 border-amber-400 flex items-center justify-center text-white font-black text-sm">
                  Z
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-neutral-900" />
              </div>

              <div>
                <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-100">
                  <span>Zaid (زيد)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Online
                  </span>
                </div>
                <div className="text-[10px] text-neutral-400">
                  خدمة عملاء ديموس • Dimos Customer Care
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                setIsOpen(false);
              }}
              className="p-1.5 rounded-xl bg-neutral-800/80 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Help Action Bar */}
          <div className="px-3 py-2 bg-neutral-950/80 border-b border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-400">
            <a href="tel:920008317" className="hover:text-red-400 flex items-center gap-1">
              <Phone className="w-3 h-3 text-red-500" />
              <span>920008317</span>
            </a>
            <span className="text-neutral-700">•</span>
            <span className="text-emerald-400">رد فوري خلال دقيقة</span>
            <span className="text-neutral-700">•</span>
            <span className="text-amber-400">كود ND96 متاح</span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed text-right ${
                    m.sender === 'user'
                      ? 'bg-red-600 text-white rounded-br-none'
                      : 'bg-neutral-800 text-neutral-200 border border-neutral-700/60 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-neutral-500 mt-1 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 bg-neutral-950 border-t border-neutral-800 flex gap-2">
            <input
              type="text"
              placeholder="اكتب استفسارك هنا..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-red-500 text-right"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-colors shadow-md shadow-red-900/40"
            >
              <Send className="w-3.5 h-3.5 rotate-180" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => {
          soundFx.playClick();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs shadow-2xl shadow-red-900/60 transition-transform active:scale-95 group"
      >
        <div className="relative">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">
            Z
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-neutral-950 animate-ping" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-neutral-950" />
        </div>

        <div className="text-right">
          <div className="text-xs font-black">Zaid • خدمة عملاء ديموس</div>
          <div className="text-[10px] text-red-200 font-medium">مرحباً، كيف أقدر أساعدك؟</div>
        </div>

        <MessageCircle className="w-4 h-4 ml-1" />
      </button>

    </div>
  );
};
