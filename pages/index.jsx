import { useState, useEffect } from 'react';

const RATES = {
  '$': 1,
  '€': 0.92,
  '₸': 495,
  '₼': 1.70,
  'USDT': 1,
  'TON': 5.5
};

const t = {
  ru: {
    title: "Мои Финансы",
    balance: "Текущий баланс",
    addExpense: "Расход",
    addIncome: "Доход",
    amount: "Сумма",
    category: "Категория",
    addBtn: "Добавить расход",
    incomeBtn: "Внести доход",
    analytics: "Аналитика расходов",
    history: "История операций",
    viewAll: "Подробнее",
    close: "Закрыть",
    noExpenses: "Пока нет расходов. Добавьте первый!",
    noHistory: "История операций пуста",
    totalSpent: "Всего потрачено",
    periods: { day: "День", week: "Неделя", month: "Месяц", year: "Год" },
    categories: { 
      housing: "🏡 Жилье", 
      utilities: "💡 ЖКХ (вода, свет)", 
      groceries: "🛒 Продукты (магазин/рынок)", 
      restaurants: "☕ Кафе / рестораны",
      other: "📦 Прочее" 
    }
  },
  en: {
    title: "My Finances",
    balance: "Current Balance",
    addExpense: "Expense",
    addIncome: "Income",
    amount: "Amount",
    category: "Category",
    addBtn: "Add Expense",
    incomeBtn: "Add Income",
    analytics: "Expense Analytics",
    history: "Transaction History",
    viewAll: "View All",
    close: "Close",
    noExpenses: "No expenses yet.",
    noHistory: "No transactions yet",
    totalSpent: "Total Spent",
    periods: { day: "Day", week: "Week", month: "Month", year: "Year" },
    categories: { 
      housing: "🏡 Housing", 
      utilities: "💡 Utilities", 
      groceries: "🛒 Groceries", 
      restaurants: "☕ Restaurants",
      other: "📦 Other" 
    }
  },
  kz: {
    title: "Менің қаржым",
    balance: "Ағымдағы баланс",
    addExpense: "Шығыс",
    addIncome: "Кіріс",
    amount: "Сомасы",
    category: "Санат",
    addBtn: "Шығын қосу",
    incomeBtn: "Кіріс қосу",
    analytics: "Шығындар аналитикасы",
    history: "Операциялар тарихы",
    viewAll: "Толығырақ",
    close: "Жабу",
    noExpenses: "Әзірге шығындар жоқ.",
    noHistory: "Транзакциялар жоқ",
    totalSpent: "Барлығы жұмсалды",
    periods: { day: "Күн", week: "Апта", month: "Ай", year: "Жыл" },
    categories: { 
      housing: "🏡 Тұрғын үй", 
      utilities: "💡 Коммуналдық қызмет", 
      groceries: "🛒 Өнімдер (дүкен/базар)", 
      restaurants: "☕ Кафе / мейрамхана",
      other: "📦 Басқа" 
    }
  },
  az: {
    title: "Mənim Maliyyəm",
    balance: "Cari Balans",
    addExpense: "Xərc",
    addIncome: "Gəlir",
    amount: "Məbləğ",
    category: "Kateqoriya",
    addBtn: "Xərc əlavə et",
    incomeBtn: "Gəlir əlavə et",
    analytics: "Xərc Analitikası",
    history: "Əməliyyat tarixçəsi",
    viewAll: "Ətraflı",
    close: "Bağla",
    noExpenses: "Hələ xərc yoxdur.",
    noHistory: "Əməliyyat yoxdur",
    totalSpent: "Ümumi xərc",
    periods: { day: "Gün", week: " Həftə", month: "Ay", year: "İl" },
    categories: { 
      housing: "🏡 Mənzil", 
      utilities: "💡 Kommunal", 
      groceries: "🛒 Ərzaq (mağaza/bazar)", 
      restaurants: "☕ Kafe / restoran",
      other: "📦 Digər" 
    }
  }
};

const CATEGORY_COLORS = {
  housing: "#d48344",     // Охристый
  utilities: "#4a7c59",   // Болотный
  groceries: "#3b82f6",   // Яркий синий
  restaurants: "#8c384a", // Бордовый
  other: "#737a72"        // Серый
};

export default function Home() {
  // Загружаем данные из localStorage, если они есть, иначе используем дефолтные
  const [baseBalanceUSD, setBaseBalanceUSD] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fin_balance');
      return saved !== null ? Number(saved) : 1500;
    }
    return 1500;
  });

  const [expensesUSD, setExpensesUSD] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fin_expenses');
      return saved !== null ? JSON.parse(saved) : { housing: 300, utilities: 80, groceries: 450, restaurants: 200, other: 50 };
    }
    return { housing: 300, utilities: 80, groceries: 450, restaurants: 200, other: 50 };
  });

  const [transactions, setTransactions] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fin_txs');
      return saved !== null ? JSON.parse(saved) : [
        { id: 1, type: 'expense', title: '🛒 Продукты (магазин/рынок)', amountUSD: 120, date: 'Сегодня' },
        { id: 2, type: 'income', title: 'Пополнение', amountUSD: 500, date: 'Вчера' }
      ];
    }
    return [];
  });

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('$');
  const [lang, setLang] = useState('ru');
  const [category, setCategory] = useState('groceries');
  const [activeTab, setActiveTab] = useState('expense');
  const [period, setPeriod] = useState('month');
  const [showAllModal, setShowAllModal] = useState(false);

  // Сохраняем в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('fin_balance', baseBalanceUSD);
    localStorage.setItem('fin_expenses', JSON.stringify(expensesUSD));
    localStorage.setItem('fin_txs', JSON.stringify(transactions));
  }, [baseBalanceUSD, expensesUSD, transactions]);

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
        [category]: (prev[category] || 0) + valInUSD
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
  const categoryKeys = ['housing', 'utilities', 'groceries', 'restaurants', 'other'];
  
  let cumulativePercent = 0;
  const chartSegments = categoryKeys.map(key => {
    const val = expensesUSD[key] || 0;
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
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", gap: "12px" }}>
        <select 
          value={lang} onChange={(e) => setLang(e.target.value)}
          style={{ background: "#1e2320", color: "#eae4d9", border: "1px solid #2f3833", padding: "12px 14px", borderRadius: "14px", fontSize: "15px", fontWeight: "600", outline: "none", flex: 1, cursor: "pointer" }}
        >
          <option value="ru">🇷🇺 Русский</option>
          <option value="en">🇬🇧 English</option>
          <option value="kz">🇰🇿 Қазақша</option>
          <option value="az">🇦🇿 Azərbaycanca</option>
        </select>

        <select 
          value={currency} onChange={(e) => setCurrency(e.target.value)}
          style={{ background: "#1e2320", color: "#eae4d9", border: "1px solid #2f3833", padding: "12px 14px", borderRadius: "14px", fontSize: "15px", fontWeight: "600", outline: "none", flex: 1, cursor: "pointer" }}
        >
          <option value="$">USD ($)</option>
          <option value="€">EUR (€)</option>
          <option value="₸">KZT (₸)</option>
          <option value="₼">AZN (₼)</option>
          <option value="USDT">USDT</option>
          <option value="TON">TON</option>
        </select>
      </div>

      <h2 style={{ textAlign: "center", marginBottom: "16px", fontWeight: "700", fontSize: "22px", color: "#f2ece1" }}>{dict.title}</h2>
      
      {/* Баланс */}
      <div style={{ 
        background: "linear-gradient(145deg, #1f2622 0%, #171c19 100%)", 
        border: "1px solid #2b3530", color: "#eae4d9", padding: "24px", borderRadius: "22px", 
        textAlign: "center", marginBottom: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.35)" 
      }}>
        <p style={{ margin: 0, fontSize: "12px", color: "#9da6a0", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>{dict.balance}</p>
        <h1 style={{ margin: "10px 0 0 0", fontSize: "34px", fontWeight: "700", color: "#fff" }}>{formatVal(baseBalanceUSD)} {currency}</h1>
      </div>

      {/* Таймлайн периодов (День, Неделя, Месяц, Год) как на референсах */}
      <div style={{ display: "flex", background: "#1b211e", padding: "4px", borderRadius: "14px", marginBottom: "16px", border: "1px solid #2b3530" }}>
        {['day', 'week', 'month', 'year'].map(p => (
          <button 
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            style={{ 
              flex: 1, padding: "8px 0", borderRadius: "10px", border: "none", fontWeight: "600", fontSize: "12px", cursor: "pointer",
              background: period === p ? "#2b3530" : "transparent", 
              color: period === p ? "#fff" : "#9da6a0",
              transition: "all 0.2s ease"
            }}
          >
            {dict.periods[p]}
          </button>
        ))}
      </div>

      {/* Переключатель вкладки Расход / Доход */}
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

      {/* Форма ввода */}
      <form onSubmit={handleAction} style={{ 
        background: "#1a201d", border: "1px solid #2b3530", padding: "18px", borderRadius: "22px", 
        marginBottom: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" 
      }}>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", fontSize: "12px", color: "#9da6a0", marginBottom: "6px", fontWeight: "600", textTransform: "uppercase" }}>{dict.amount} ({currency})</label>
          <input 
            type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" 
            style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid #303d36", background: "#141715", color: "white", fontSize: "16px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {activeTab === 'expense' && (
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#9da6a0", marginBottom: "6px", fontWeight: "600", textTransform: "uppercase" }}>{dict.category}</label>
            <select 
              value={category} onChange={(e) => setCategory(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid #303d36", background: "#141715", color: "white", fontSize: "14px", outline: "none", cursor: "pointer", boxSizing: "border-box" }}
            >
              <option value="housing">{dict.categories.housing}</option>
              <option value="utilities">{dict.categories.utilities}</option>
              <option value="groceries">{dict.categories.groceries}</option>
              <option value="restaurants">{dict.categories.restaurants}</option>
              <option value="other">{dict.categories.other}</option>
            </select>
          </div>
        )}

        <button type="submit" style={{ 
          width: "100%", background: activeTab === 'expense' ? "#8c384a" : "#4a7c59", color: "white", 
          border: "none", padding: "12px", borderRadius: "14px", fontWeight: "700", fontSize: "15px", cursor: "pointer",
          boxShadow: activeTab === 'expense' ? "0 4px 14px rgba(140,56,74,0.4)" : "0 4px 14px rgba(74,124,89,0.4)"
        }}>
          {activeTab === 'expense' ? dict.addBtn : dict.incomeBtn}
        </button>
      </form>

      {/* График аналитики */}
      <div style={{ 
        background: "#1a201d", border: "1px solid #2b3530", padding: "18px", borderRadius: "22px", 
        marginBottom: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" 
      }}>
        <h3 style={{ margin: "0 0 14px 0", fontSize: "15px", fontWeight: "600", textAlign: "center", color: "#f2ece1" }}>{dict.analytics}</h3>
        {totalSpentUSD === 0 ? (
          <p style={{ color: "#9da6a0", fontSize: "13px", textAlign: "center", margin: 0 }}>{dict.noExpenses}</p>
        ) : (
          <div>
            <div style={{ position: "relative", width: "140px", height: "140px", margin: "0 auto 16px auto" }}>
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

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {chartSegments.map(seg => (
                <div key={seg.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: seg.color, display: "inline-block" }}></span>
                    <span style={{ color: "#d2cbc0" }}>{dict.categories[seg.key]}</span>
                  </div>
                  <div style={{ fontWeight: "600", color: "#fff" }}>
                    {formatVal(seg.val)} {currency} <span style={{ color: "#9da6a0", fontWeight: "400", fontSize: "11px" }}>({Math.round(seg.percent)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* История транзакций + кнопка Подробнее */}
      <div style={{ 
        background: "#1a201d", border: "1px solid #2b3530", padding: "18px", borderRadius: "22px", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" 
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#f2ece1" }}>{dict.history}</h3>
          {transactions.length > 3 && (
            <button 
              onClick={() => setShowAllModal(true)}
              style={{ background: "transparent", border: "none", color: "#d48344", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
            >
              {dict.viewAll} →
            </button>
          )}
        </div>

        {transactions.length === 0 ? (
          <p style={{ color: "#9da6a0", fontSize: "13px", textAlign: "center", margin: 0 }}>{dict.noHistory}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {transactions.slice(0, 3).map(tx => (
              <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "8px", borderBottom: "1px solid #242c27" }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "13px", color: "#eae4d9" }}>{tx.title}</div>
                  <div style={{ fontSize: "10px", color: "#9da6a0", marginTop: "2px" }}>{tx.date}</div>
                </div>
                <div style={{ fontWeight: "700", fontSize: "14px", color: tx.type === 'income' ? "#4a7c59" : "#e56b73" }}>
                  {tx.type === 'income' ? '+' : '-'}{formatVal(tx.amountUSD)} {currency}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модальное окно «Подробнее» со всей историей */}
      {showAllModal && (
        <div style={{ 
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
          background: "rgba(10, 12, 11, 0.85)", backdropFilter: "blur(5px)",
          zIndex: 100, display: "flex", justifyContent: "center", alignItems: "flex-end"
        }}>
          <div style={{ 
            background: "#1a201d", border: "1px solid #2b3530", borderTopLeftRadius: "24px", borderTopRightRadius: "24px",
            width: "100%", maxWidth: "440px", maxHeight: "80vh", padding: "20px", boxSizing: "border-box", overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#f2ece1" }}>{dict.history}</h3>
              <button 
                onClick={() => setShowAllModal(false)}
                style={{ background: "#2b3530", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
              >
                {dict.close}
              </button>
            </div>
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
          </div>
        </div>
      )}
    </div>
  );
}
