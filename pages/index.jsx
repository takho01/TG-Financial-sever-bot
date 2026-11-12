import { useState } from 'react';

// Курсы валют относительно 1 USD
const RATES = {
  '$': 1,
  '€': 0.92,
  '₸': 495,
  '₼': 1.70,
  'USDT': 1,
  'TON': 5.5 // 1 TON = 5.5 USD
};

// Словари для локализации интерфейса в теплой эстетике
const t = {
  ru: {
    title: "Финансовый трекер",
    balance: "Текущий баланс",
    addExpense: "Добавить расход",
    addIncome: "Пополнить",
    amount: "Сумма",
    category: "Категория",
    addBtn: "Добавить расход",
    incomeBtn: "Внести доход",
    analytics: "Аналитика расходов",
    history: "История операций",
    noExpenses: "Пока нет расходов. Добавьте первый!",
    noHistory: "История операций пуста",
    totalSpent: "Всего потрачено",
    categories: { food: "Еда и продукты", transport: "Транспорт", fun: "Досуг и отдых", other: "Прочее" }
  },
  en: {
    title: "Financial Tracker",
    balance: "Current Balance",
    addExpense: "Add Expense",
    addIncome: "Add Income",
    amount: "Amount",
    category: "Category",
    addBtn: "Add Expense",
    incomeBtn: "Add Income",
    analytics: "Expense Analytics",
    history: "Transaction History",
    noExpenses: "No expenses yet.",
    noHistory: "No transactions yet",
    totalSpent: "Total Spent",
    categories: { food: "Food & Groceries", transport: "Transport", fun: "Leisure & Fun", other: "Other" }
  },
  kz: {
    title: "Қаржы трекері",
    balance: "Ағымдағы баланс",
    addExpense: "Шығын қосу",
    addIncome: "Кіріс қосу",
    amount: "Сомасы",
    category: "Санат",
    addBtn: "Шығын қосу",
    incomeBtn: "Кіріс қосу",
    analytics: "Шығындар аналитикасы",
    history: "Операциялар тарихы",
    noExpenses: "Әзірге шығындар жоқ.",
    noHistory: "Транзакциялар жоқ",
    totalSpent: "Барлығы жұмсалды",
    categories: { food: "Тамақ", transport: "Көлік", fun: "Ойын-сауық", other: "Басқа" }
  },
  az: {
    title: "Maliyyə İzləyicisi",
    balance: "Cari Balans",
    addExpense: "Xərc əlavə et",
    addIncome: "Gəlir əlavə et",
    amount: "Məbləğ",
    category: "Kateqoriya",
    addBtn: "Xərc əlavə et",
    incomeBtn: "Gəlir əlavə et",
    analytics: "Xərc Analitikası",
    history: "Əməliyyat tarixçəsi",
    noExpenses: "Hələ xərc yoxdur.",
    noHistory: "Əməliyyat yoxdur",
    totalSpent: "Ümumi xərc",
    categories: { food: "Yemək", transport: "Nəqliyyat", fun: "Əyləncə", other: "Digər" }
  }
};

const CATEGORY_COLORS = {
  food: "#d48344",      // Теплый охристый / пряный
  transport: "#4a7c59", // Приглушенный болотный акцент
  fun: "#8c384a",       // Бордово-винный
  other: "#737a72"      // Матовый серо-зеленый
};

export default function Home() {
  const [baseBalanceUSD, setBaseBalanceUSD] = useState(1500);
  const [expensesUSD, setExpensesUSD] = useState({
    food: 120,
    transport: 45,
    fun: 80,
    other: 25
  });

  // История транзакций
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'expense', title: 'Еда и продукты', amountUSD: 120, date: 'Сегодня' },
    { id: 2, type: 'income', title: 'Пополнение', amountUSD: 500, date: 'Вчера' }
  ]);

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('$');
  const [lang, setLang] = useState('ru');
  const [category, setCategory] = useState('food');
  const [activeTab, setActiveTab] = useState('expense');

  const dict = t[lang];
  const rate = RATES[currency];

  const formatVal = (valUSD) => {
    const converted = valUSD * rate;
    if (['TON', '€', '$', 'USDT'].includes(currency)) {
      return converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return Math.round(converted).toLocaleString('en-US');
  };

  const handleAction = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) return;

    const valInUSD = numAmount / rate;

    if (activeTab === 'expense') {
      setBaseBalanceUSD(prev => prev - valInUSD);
      setExpensesUSD(prev => ({
        ...prev,
        [category]: prev[category] + valInUSD
      }));
      setTransactions(prev => [
        { id: Date.now(), type: 'expense', title: dict.categories[category], amountUSD: valInUSD, date: 'Только что' },
        ...prev
      ]);
    } else {
      setBaseBalanceUSD(prev => prev + valInUSD);
      setTransactions(prev => [
        { id: Date.now(), type: 'income', title: dict.addIncome, amountUSD: valInUSD, date: 'Только что' },
        ...prev
      ]);
    }
    setAmount('');
  };

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
      padding: "20px 16px", 
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", 
      maxWidth: "440px", 
      margin: "0 auto", 
      background: "#141715", 
      color: "#eae4d9", 
      minHeight: "100vh",
      boxSizing: "border-box"
    }}>
      {/* Шапка: Селекторы */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", gap: "12px" }}>
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
          style={{ 
            background: "#1e2320", color: "#eae4d9", border: "1px solid #2f3833", 
            padding: "12px 14px", borderRadius: "14px", fontSize: "15px", fontWeight: "600",
            outline: "none", flex: 1, cursor: "pointer"
          }}
        >
          <option value="ru">🇷🇺 Русский</option>
          <option value="en">🇬🇧 English</option>
          <option value="kz">🇰🇿 Қазақша</option>
          <option value="az">🇦🇿 Azərbaycanca</option>
        </select>

        <select 
          value={currency} 
          onChange={(e) => setCurrency(e.target.value)}
          style={{ 
            background: "#1e2320", color: "#eae4d9", border: "1px solid #2f3833", 
            padding: "12px 14px", borderRadius: "14px", fontSize: "15px", fontWeight: "600",
            outline: "none", flex: 1, cursor: "pointer"
          }}
        >
          <option value="$">USD ($)</option>
          <option value="€">EUR (€)</option>
          <option value="₸">KZT (₸)</option>
          <option value="₼">AZN (₼)</option>
          <option value="USDT">USDT</option>
          <option value="TON">TON</option>
        </select>
      </div>

      <h2 style={{ textAlign: "center", marginBottom: "20px", fontWeight: "700", fontSize: "22px", color: "#f2ece1" }}>{dict.title}</h2>
      
      {/* Баланс */}
      <div style={{ 
        background: "linear-gradient(145deg, #1f2622 0%, #171c19 100%)", 
        border: "1px solid #2b3530", color: "#eae4d9", padding: "26px", borderRadius: "22px", 
        textAlign: "center", marginBottom: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.35)" 
      }}>
        <p style={{ margin: 0, fontSize: "12px", color: "#9da6a0", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>{dict.balance}</p>
        <h1 style={{ margin: "10px 0 0 0", fontSize: "36px", fontWeight: "700", color: "#fff" }}>{formatVal(baseBalanceUSD)} {currency}</h1>
      </div>

      {/* Переключатель вкладки */}
      <div style={{ display: "flex", background: "#1b211e", padding: "4px", borderRadius: "14px", marginBottom: "16px", border: "1px solid #2b3530" }}>
        <button 
          type="button"
          onClick={() => setActiveTab('expense')}
          style={{ 
            flex: 1, padding: "10px", borderRadius: "10px", border: "none", fontWeight: "600", fontSize: "14px", cursor: "pointer",
            background: activeTab === 'expense' ? "#8c384a" : "transparent", 
            color: activeTab === 'expense' ? "#fff" : "#9da6a0",
            transition: "all 0.2s ease"
          }}
        >
          {dict.addExpense}
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('income')}
          style={{ 
            flex: 1, padding: "10px", borderRadius: "10px", border: "none", fontWeight: "600", fontSize: "14px", cursor: "pointer",
            background: activeTab === 'income' ? "#4a7c59" : "transparent", 
            color: activeTab === 'income' ? "#fff" : "#9da6a0",
            transition: "all 0.2s ease"
          }}
        >
          {dict.addIncome}
        </button>
      </div>

      {/* Форма */}
      <form onSubmit={handleAction} style={{ 
        background: "#1a201d", border: "1px solid #2b3530", padding: "20px", borderRadius: "22px", 
        marginBottom: "20px", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" 
      }}>
        <div style={{ marginBottom: "14px" }}>
          <label style={{ display: "block", fontSize: "12px", color: "#9da6a0", marginBottom: "6px", fontWeight: "600", textTransform: "uppercase" }}>{dict.amount} ({currency})</label>
          <input 
            type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" 
            style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #303d36", background: "#141715", color: "white", fontSize: "16px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {activeTab === 'expense' && (
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#9da6a0", marginBottom: "6px", fontWeight: "600", textTransform: "uppercase" }}>{dict.category}</label>
            <select 
              value={category} onChange={(e) => setCategory(e.target.value)}
              style={{ width: "100%", padding: "14px", borderRadius: "14px", border: "1px solid #303d36", background: "#141715", color: "white", fontSize: "15px", outline: "none", cursor: "pointer", boxSizing: "border-box" }}
            >
              <option value="food">🍔 {dict.categories.food}</option>
              <option value="transport">🚗 {dict.categories.transport}</option>
              <option value="fun">🎉 {dict.categories.fun}</option>
              <option value="other">📦 {dict.categories.other}</option>
            </select>
          </div>
        )}

        <button type="submit" style={{ 
          width: "100%", background: activeTab === 'expense' ? "#8c384a" : "#4a7c59", color: "white", 
          border: "none", padding: "14px", borderRadius: "14px", fontWeight: "700", fontSize: "15px", cursor: "pointer",
          boxShadow: activeTab === 'expense' ? "0 4px 14px rgba(140,56,74,0.4)" : "0 4px 14px rgba(74,124,89,0.4)"
        }}>
          {activeTab === 'expense' ? dict.addBtn : dict.incomeBtn}
        </button>
      </form>

      {/* График */}
      <div style={{ 
        background: "#1a201d", border: "1px solid #2b3530", padding: "20px", borderRadius: "22px", 
        marginBottom: "20px", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" 
      }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600", textAlign: "center", color: "#f2ece1" }}>{dict.analytics}</h3>
        {totalSpentUSD === 0 ? (
          <p style={{ color: "#9da6a0", fontSize: "13px", textAlign: "center", margin: 0 }}>{dict.noExpenses}</p>
        ) : (
          <div>
            <div style={{ position: "relative", width: "150px", height: "150px", margin: "0 auto 20px auto" }}>
              <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                {chartSegments.map(seg => (
                  seg.percent > 0 && (
                    <circle
                      key={seg.key} cx="18" cy="18" r="15.915" fill="transparent"
                      stroke={seg.color} strokeWidth="3.8" strokeDasharray={seg.strokeDasharray} strokeDashoffset={seg.strokeDashoffset}
                      style={{ transition: "all 0.4s ease" }}
                    />
                  )
                ))}
              </svg>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "10px", color: "#9da6a0", fontWeight: "600" }}>{dict.totalSpent}</span>
                <span style={{ fontSize: "13px", fontWeight: "700", marginTop: "2px", color: "#fff" }}>{formatVal(totalSpentUSD)} {currency}</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {chartSegments.map(seg => (
                <div key={seg.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: seg.color, display: "inline-block" }}></span>
                    <span style={{ color: "#d2cbc0" }}>{dict.categories[seg.key]}</span>
                  </div>
                  <div style={{ fontWeight: "600", color: "#fff" }}>
                    {formatVal(seg.val)} {currency} <span style={{ color: "#9da6a0", fontWeight: "400", fontSize: "12px" }}>({Math.round(seg.percent)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* История */}
      <div style={{ 
        background: "#1a201d", border: "1px solid #2b3530", padding: "20px", borderRadius: "22px", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" 
      }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600", color: "#f2ece1" }}>{dict.history}</h3>
        {transactions.length === 0 ? (
          <p style={{ color: "#9da6a0", fontSize: "13px", textAlign: "center", margin: 0 }}>{dict.noHistory}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {transactions.map(tx => (
              <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "10px", borderBottom: "1px solid #242c27" }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "14px", color: "#eae4d9" }}>{tx.title}</div>
                  <div style={{ fontSize: "11px", color: "#9da6a0", marginTop: "2px" }}>{tx.date}</div>
                </div>
                <div style={{ fontWeight: "700", fontSize: "15px", color: tx.type === 'income' ? "#4a7c59" : "#e56b73" }}>
                  {tx.type === 'income' ? '+' : '-'}{formatVal(tx.amountUSD)} {currency}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
