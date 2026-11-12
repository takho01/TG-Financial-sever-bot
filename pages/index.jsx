import { useState } from 'react';

// Курсы валют относительно 1 USD
const RATES = {
  '$': 1,
  '€': 0.92,
  '₸': 495,
  '₼': 1.70,
  'USDT': 1,
  'TON': 0.18 // ~5.5 USD за 1 TON
};

// Словари для локализации интерфейса
const t = {
  ru: {
    title: "💰 Кошелек",
    balance: "Текущий баланс",
    addExpense: "Добавить расход",
    amount: "Сумма",
    category: "Категория",
    addBtn: "Добавить",
    analytics: "📊 Аналитика расходов",
    noExpenses: "Пока нет расходов. Добавьте первый!",
    totalSpent: "Всего потрачено",
    categories: { food: "🍔 Еда", transport: "🚗 Транспорт", fun: "🎉 Развлечения", other: "📦 Прочее" }
  },
  en: {
    title: "💰 Wallet",
    balance: "Current Balance",
    addExpense: "Add Expense",
    amount: "Amount",
    category: "Category",
    addBtn: "Add",
    analytics: "📊 Expense Analytics",
    noExpenses: "No expenses yet. Add your first one!",
    totalSpent: "Total Spent",
    categories: { food: "🍔 Food", transport: "🚗 Transport", fun: "🎉 Entertainment", other: "📦 Other" }
  },
  kz: {
    title: "💰 Әмиян",
    balance: "Ағымдағы баланс",
    addExpense: "Шығын қосу",
    amount: "Сомасы",
    category: "Санат",
    addBtn: "Қосу",
    analytics: "📊 Шығындар аналитикасы",
    noExpenses: "Әзірге шығындар жоқ. Біріншісін қосыңыз!",
    totalSpent: "Барлығы жұмсалды",
    categories: { food: "🍔 Тамақ", transport: "🚗 Көлік", fun: "🎉 Көңіл көтеру", other: "📦 Басқа" }
  },
  az: {
    title: "💰 Cüzdan",
    balance: "Cari Balans",
    addExpense: "Xərc əlavə et",
    amount: "Məbləğ",
    category: "Kateqoriya",
    addBtn: "Əlavə et",
    analytics: "📊 Xərc Analitikası",
    noExpenses: "Hələ xərc yoxdur. İlk xərcinizi əlavə edin!",
    totalSpent: "Ümumi xərc",
    categories: { food: "🍔 Yemək", transport: "🚗 Nəqliyyat", fun: "🎉 Əyləncə", other: "📦 Digər" }
  }
};

const CATEGORY_COLORS = {
  food: "#ff9f0a",      // Оранжевый
  transport: "#0a84ff", // Синий
  fun: "#bf5af2",       // Фиолетовый
  other: "#30d158"      // Зеленый
};

export default function Home() {
  // Храним базовый баланс и расходы в USD для точной конвертации
  const [baseBalanceUSD, setBaseBalanceUSD] = useState(1500);
  const [expensesUSD, setExpensesUSD] = useState({
    food: 120,
    transport: 45,
    fun: 80,
    other: 25
  });

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('$');
  const [lang, setLang] = useState('ru');
  const [category, setCategory] = useState('food');

  const dict = t[lang];
  const rate = RATES[currency];

  // Форматирование числа в зависимости от валюты
  const formatVal = (valUSD) => {
    const converted = valUSD * rate;
    if (currency === 'TON' || currency === '€' || currency === '$' || currency === 'USDT') {
      return converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return Math.round(converted).toLocaleString('en-US');
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) return;

    // Конвертируем введенный расход обратно в базовый USD
    const spentInUSD = numAmount / rate;

    setBaseBalanceUSD(prev => prev - spentInUSD);
    setExpensesUSD(prev => ({
      ...prev,
      [category]: prev[category] + spentInUSD
    }));
    setAmount('');
  };

  // Расчет данных для кругового графика
  const totalSpentUSD = Object.values(expensesUSD).reduce((a, b) => a + b, 0);
  const categoryKeys = ['food', 'transport', 'fun', 'other'];
  
  let cumulativePercent = 0;
  const chartSegments = categoryKeys.map(key => {
    const val = expensesUSD[key];
    const percent = totalSpentUSD > 0 ? (val / totalSpentUSD) * 100 : 0;
    const strokeDasharray = `${percent} ${100 - percent}`;
    const strokeDashoffset = -cumulativePercent;
    cumulativePercent += percent;
    return { key, val, percent, strokeDasharray, strokeDashoffset, color: CATEGORY_COLORS[key] };
  });

  return (
    <div style={{ 
      padding: "16px", 
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", 
      maxWidth: "440px", 
      margin: "0 auto", 
      background: "#0f0f11", 
      color: "#f5f5f7",
      minHeight: "100vh",
      boxSizing: "border-box"
    }}>
      {/* Верхняя панель: Переключатель языков и валют */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", gap: "8px" }}>
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
          style={{ background: "#1c1c1e", color: "white", border: "1px solid #3a3a3c", padding: "8px 12px", borderRadius: "10px", fontSize: "14px", outline: "none", flex: 1 }}
        >
          <option value="ru">🇷🇺 Русский</option>
          <option value="en">🇬🇧 English</option>
          <option value="kz">🇰🇿 Қазақша</option>
          <option value="az">🇦🇿 Azərbaycanca</option>
        </select>

        <select 
          value={currency} 
          onChange={(e) => setCurrency(e.target.value)}
          style={{ background: "#1c1c1e", color: "white", border: "1px solid #3a3a3c", padding: "8px 12px", borderRadius: "10px", fontSize: "14px", outline: "none", flex: 1 }}
        >
          <option value="$">USD ($)</option>
          <option value="€">EUR (€)</option>
          <option value="₸">KZT (₸)</option>
          <option value="₼">AZN (₼)</option>
          <option value="USDT">USDT</option>
          <option value="TON">TON</option>
        </select>
      </div>

      <h2 style={{ textAlign: "center", marginBottom: "20px", fontWeight: "600", fontSize: "22px" }}>{dict.title}</h2>
      
      {/* Карточка баланса с автоконвертацией */}
      <div style={{ 
        background: "linear-gradient(135deg, #2c2c2e 0%, #1c1c1e 100%)", 
        border: "1px solid #3a3a3c",
        color: "white", 
        padding: "24px", 
        borderRadius: "20px", 
        textAlign: "center", 
        marginBottom: "20px", 
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)" 
      }}>
        <p style={{ margin: 0, fontSize: "13px", color: "#8e8e93", textTransform: "uppercase", letterSpacing: "0.5px" }}>{dict.balance}</p>
        <h1 style={{ margin: "10px 0 0 0", fontSize: "34px", fontWeight: "700" }}>{formatVal(baseBalanceUSD)} {currency}</h1>
      </div>

      {/* Форма добавления расхода */}
      <form onSubmit={handleAddExpense} style={{ 
        background: "#1c1c1e", 
        border: "1px solid #2c2c2e",
        padding: "20px", 
        borderRadius: "20px", 
        marginBottom: "20px", 
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)" 
      }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "500" }}>{dict.addExpense}</h3>
        
        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "12px", color: "#8e8e93", marginBottom: "6px" }}>{dict.amount} ({currency})</label>
          <input 
            type="number" 
            step="any"
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="0.00" 
            style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #3a3a3c", background: "#2c2c2e", color: "white", fontSize: "16px", boxSizing: "border-box", outline: "none" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "12px", color: "#8e8e93", marginBottom: "6px" }}>{dict.category}</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #3a3a3c", background: "#2c2c2e", color: "white", fontSize: "16px", boxSizing: "border-box", outline: "none" }}
          >
            <option value="food">{dict.categories.food}</option>
            <option value="transport">{dict.categories.transport}</option>
            <option value="fun">{dict.categories.fun}</option>
            <option value="other">{dict.categories.other}</option>
          </select>
        </div>

        <button type="submit" style={{ 
          width: "100%", 
          background: "#0a84ff", 
          color: "white", 
          border: "none", 
          padding: "14px", 
          borderRadius: "12px", 
          fontWeight: "600", 
          fontSize: "16px", 
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(10, 132, 255, 0.3)"
        }}>
          {dict.addBtn}
        </button>
      </form>

      {/* Блок аналитики с интерактивным круговым графиком */}
      <div style={{ 
        background: "#1c1c1e", 
        border: "1px solid #2c2c2e",
        padding: "20px", 
        borderRadius: "20px", 
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)" 
      }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "500", textAlign: "center" }}>{dict.analytics}</h3>
        
        {totalSpentUSD === 0 ? (
          <p style={{ color: "#8e8e93", fontSize: "13px", textAlign: "center", margin: 0 }}>{dict.noExpenses}</p>
        ) : (
          <div>
            {/* Круговая диаграмма (Donut Chart) */}
            <div style={{ position: "relative", width: "160px", height: "160px", margin: "0 auto 20px auto" }}>
              <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                {chartSegments.map(seg => (
                  seg.percent > 0 && (
                    <circle
                      key={seg.key}
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth="3.5"
                      strokeDasharray={seg.strokeDasharray}
                      strokeDashoffset={seg.strokeDashoffset}
                      style={{ transition: "all 0.4s ease" }}
                    />
                  )
                ))}
              </svg>
              {/* Текст внутри бублика */}
              <div style={{ 
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0, 
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" 
              }}>
                <span style={{ fontSize: "10px", color: "#8e8e93" }}>{dict.totalSpent}</span>
                <span style={{ fontSize: "14px", fontWeight: "700", marginTop: "2px" }}>{formatVal(totalSpentUSD)} {currency}</span>
              </div>
            </div>

            {/* Легенда по категориям */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {chartSegments.map(seg => (
                <div key={seg.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: seg.color, display: "inline-block" }}></span>
                    <span>{dict.categories[seg.key]}</span>
                  </div>
                  <div style={{ fontWeight: "600" }}>
                    {formatVal(seg.val)} {currency} <span style={{ color: "#8e8e93", fontWeight: "400", fontSize: "12px" }}>({Math.round(seg.percent)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
