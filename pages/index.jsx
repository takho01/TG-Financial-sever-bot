import { useState } from 'react';

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
    analyticsDesc: "Здесь скоро появится графическое распределение по категориям.",
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
    analyticsDesc: "Graphical category breakdown coming soon.",
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
    analyticsDesc: "Жақында санаттар бойынша кестелер шығады.",
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
    analyticsDesc: "Tezliklə kateqoriyalar üzrə qrafiklər əlavə olunacaq.",
    categories: { food: "🍔 Yemək", transport: "🚗 Nəqliyyat", fun: "🎉 Əyləncə", other: "📦 Digər" }
  }
};

export default function Home() {
  const [balance, setBalance] = useState(1500);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('$');
  const [lang, setLang] = useState('ru');
  const [category, setCategory] = useState('food');

  const dict = t[lang];

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!amount) return;
    setBalance(balance - Number(amount));
    setAmount('');
  };

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
      
      {/* Премиальная карточка баланса */}
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
        <h1 style={{ margin: "10px 0 0 0", fontSize: "36px", fontWeight: "700" }}>{balance.toLocaleString()} {currency}</h1>
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
          <label style={{ display: "block", fontSize: "12px", color: "#8e8e93", marginBottom: "6px" }}>{dict.amount}</label>
          <input 
            type="number" 
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

      {/* Блок аналитики */}
      <div style={{ 
        background: "#1c1c1e", 
        border: "1px solid #2c2c2e",
        padding: "20px", 
        borderRadius: "20px", 
        textAlign: "center", 
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)" 
      }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "500" }}>{dict.analytics}</h3>
        <p style={{ color: "#8e8e93", fontSize: "13px", margin: 0, lineHeight: "1.4" }}>{dict.analyticsDesc}</p>
      </div>
    </div>
  );
}
