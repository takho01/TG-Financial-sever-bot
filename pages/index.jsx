import { useState, useEffect } from 'react';

const RATES = {
  '$': 1,
  '€': 0.92,
  '₸': 495,
  '₼': 1.70,
  '฿': 35.5,
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
    noExpenses: "Пока нет расходов за выбранный период.",
    noHistory: "История операций пуста",
    totalSpent: "Всего потрачено",
    delete: "Удалить",
    resetFilter: "Сбросить фильтр",
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
    noExpenses: "No expenses for selected period.",
    noHistory: "No transactions yet",
    totalSpent: "Total Spent",
    delete: "Delete",
    resetFilter: "Reset filter",
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
    noExpenses: "Таңдалған кезеңде шығындар жоқ.",
    noHistory: "Транзакциялар жоқ",
    totalSpent: "Барлығы жұмсалды",
    delete: "Жою",
    resetFilter: "Сүзгіні тазарту",
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
    noExpenses: "Seçilmiş dövr üçün xərc yoxdur.",
    noHistory: "Əməliyyat yoxdur",
    totalSpent: "Ümumi xərc",
    delete: "Sil",
    resetFilter: "Filtri sıfırla",
    periods: { day: "Gün", week: "Həftə", month: "Ay", year: "İl" },
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
  housing: "#d48344",      
  utilities: "#4a7c59",   
  groceries: "#3b82f6",   
  restaurants: "#8c384a", 
  other: "#737a72"        
};

export default function Home() {
  const [chatId, setChatId] = useState('default_user');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('$');
  const [lang, setLang] = useState('ru');
  const [category, setCategory] = useState('groceries');
  const [activeTab, setActiveTab] = useState('expense');
  const [period, setPeriod] = useState('month');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(null);
  const [showAllModal, setShowAllModal] = useState(false);

  // Получаем Telegram ID пользователя при запуске
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      if (tg.initDataUnsafe?.user?.id) {
        setChatId(String(tg.initDataUnsafe.user.id));
      }
    }
  }, []);

  // Загрузка транзакций из базы Neon
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch('/api/transactions');
        const json = await res.json();
        if (json.success) {
          // Фильтруем транзакции конкретно для текущего пользователя (или показываем все, если бэкенд возвращает общие, но лучше по chatId)
          const userTxs = json.data.filter(tx => !tx.chat_id || tx.chat_id === chatId || chatId === 'default_user');
          setTransactions(userTxs);
        }
      } catch (err) {
        console.error("Ошибка загрузки транзакций:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, [chatId]);

  const dict = t[lang];
  const rate = RATES[currency];

  const formatVal = (valUSD) => {
    const converted = valUSD * rate;
    if (['TON', '€', '$', 'USDT'].includes(currency)) {
      return converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return Math.round(converted).toLocaleString('en-US');
  };

  // Расчет текущего баланса на основе истории (стартовый баланс 0 + доходы - расходы)
  const totalIncomeUSD = transactions.filter(tx => tx.type === 'income').reduce((acc, tx) => acc + Number(tx.amount_usd || tx.amountUSD), 0);
  const totalExpenseUSD = transactions.filter(tx => tx.type === 'expense').reduce((acc, tx) => acc + Number(tx.amount_usd || tx.amountUSD), 0);
  const currentBalanceUSD = totalIncomeUSD - totalExpenseUSD;

  // Фильтрация по периоду
  const filteredByPeriodTransactions = transactions.filter(tx => {
    if (!tx.timestamp) return true;
    const now = Date.now();
    const diff = now - Number(tx.timestamp);
    const dayMs = 24 * 60 * 60 * 1000;

    if (period === 'day') return diff <= dayMs;
    if (period === 'week') return diff <= 7 * dayMs;
    if (period === 'month') return diff <= 30 * dayMs;
    if (period === 'year') return diff <= 365 * dayMs;
    return true;
  });

  // Расходы по категориям
  const periodExpenses = { housing: 0, utilities: 0, groceries: 0, restaurants: 0, other: 0 };
  filteredByPeriodTransactions.forEach(tx => {
    if (tx.type === 'expense') {
      const cat = tx.category_key || tx.categoryKey || 'other';
      periodExpenses[cat] = (periodExpenses[cat] || 0) + Number(tx.amount_usd || tx.amountUSD);
    }
  });

  const totalSpentUSD = Object.values(periodExpenses).reduce((a, b) => a + b, 0);
  const categoryKeys = ['housing', 'utilities', 'groceries', 'restaurants', 'other'];
  
  let cumulativePercent = 0;
  const chartSegments = categoryKeys.map(key => {
    const val = periodExpenses[key] || 0;
    const percent = totalSpentUSD > 0 ? (val / totalSpentUSD) * 100 : 0;
    const strokeDasharray = `${percent} ${100 - percent}`;
    const strokeDashoffset = -cumulativePercent;
    cumulativePercent += percent;
    return { key, val, percent, strokeDasharray, strokeDashoffset, color: CATEGORY_COLORS[key] };
  });

  const displayedTransactions = filteredByPeriodTransactions.filter(tx => {
    if (selectedCategoryFilter) {
      return tx.type === 'expense' && (tx.category_key === selectedCategoryFilter || tx.categoryKey === selectedCategoryFilter);
    }
    return true;
  });

  // Добавление транзакции через API в Neon
  const handleAction = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) return;

    const valInUSD = numAmount / rate;
    const newTxData = {
      chatId: chatId,
      type: activeTab,
      categoryKey: activeTab === 'expense' ? category : null,
      title: activeTab === 'expense' ? dict.categories[category] : dict.addIncome,
      amountUSD: valInUSD,
      date: 'Только что'
    };

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTxData)
      });
      const json = await res.json();
      if (json.success) {
        setTransactions(prev => [json.data, ...prev]);
        setAmount('');
      }
    } catch (err) {
      console.error("Ошибка сохранения транзакции:", err);
    }
  };

  // Удаление транзакции через API из Neon
  const deleteTransaction = async (id) => {
    try {
      const res = await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setTransactions(prev => prev.filter(tx => tx.id !== id));
      }
    } catch (err) {
      console.error("Ошибка удаления:", err);
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px", color: "#eae4d9", background: "#141715", minHeight: "100vh" }}>Загрузка...</div>;
  }

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
          <option value="฿">THB (฿)</option>
          <option value="USDT">USDT</option>
          <option value="TON">TON</option>
        </select>
      </div>

      <h2 style={{ textAlign: "center", marginBottom: "16px", fontWeight: "700", fontSize: "22px", color: "#f2ece1" }}>{dict.title}</h2>
      
      {/* Баланс (теперь по умолчанию 0) */}
      <div style={{ 
        background: "linear-gradient(145deg, #1f2622 0%, #171c19 100%)", 
        border: "1px solid #2b3530", color: "#eae4d9", padding: "24px", borderRadius: "22px", 
        textAlign: "center", marginBottom: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.35)" 
      }}>
        <p style={{ margin: 0, fontSize: "12px", color: "#9da6a0", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>{dict.balance}</p>
        <h1 style={{ margin: "10px 0 0 0", fontSize: "34px", fontWeight: "700", color: "#fff" }}>{formatVal(currentBalanceUSD)} {currency}</h1>
      </div>

      {/* Таймлайн периодов */}
      <div style={{ display: "flex", background: "#1b211e", padding: "4px", borderRadius: "14px", marginBottom: "16px", border: "1px solid #2b3530" }}>
        {['day', 'week', 'month', 'year'].map(p => (
          <button 
            key={p} type="button" onClick={() => setPeriod(p)}
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
          type="button" onClick={() => setActiveTab('expense')}
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
          type="button" onClick={() => setActiveTab('income')}
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#f2ece1" }}>{dict.analytics}</h3>
          {selectedCategoryFilter && (
            <button 
              onClick={() => setSelectedCategoryFilter(null)}
              style={{ background: "#2b3530", border: "none", color: "#d48344", fontSize: "11px", fontWeight: "600", padding: "4px 8px", borderRadius: "8px", cursor: "pointer" }}
            >
              ✕ {dict.resetFilter}
            </button>
          )}
        </div>

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
                      onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === seg.key ? null : seg.key)}
                      style={{ transition: "all 0.4s ease", cursor: "pointer", opacity: selectedCategoryFilter && selectedCategoryFilter !== seg.key ? 0.3 : 1 }}
                    />
                  )
                ))}
              </svg>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <span style={{ fontSize: "10px", color: "#9da6a0", fontWeight: "600" }}>{dict.totalSpent}</span>
                <span style={{ fontSize: "13px", fontWeight: "700", marginTop: "2px", color: "#fff" }}>{formatVal(totalSpentUSD)} {currency}</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {chartSegments.map(seg => (
                <div 
                  key={seg.key} 
                  onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === seg.key ? null : seg.key)}
                  style={{ 
                    display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", 
                    padding: "6px 8px", borderRadius: "10px", cursor: "pointer",
                    background: selectedCategoryFilter === seg.key ? "#25302b" : "transparent",
                    border: selectedCategoryFilter === seg.key ? "1px solid #3b4d44" : "1px solid transparent"
                  }}
                >
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

      {/* История транзакций */}
      <div style={{ 
        background: "#1a201d", border: "1px solid #2b3530", padding: "18px", borderRadius: "22px", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" 
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#f2ece1" }}>
            {selectedCategoryFilter ? `История: ${dict.categories[selectedCategoryFilter]}` : dict.history}
          </h3>
          {filteredByPeriodTransactions.length > 3 && (
            <button 
              onClick={() => setShowAllModal(true)}
              style={{ background: "transparent", border: "none", color: "#d48344", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
            >
              {dict.viewAll} →
            </button>
          )}
        </div>

        {displayedTransactions.length === 0 ? (
          <p style={{ color: "#9da6a0", fontSize: "13px", textAlign: "center", margin: 0 }}>{dict.noHistory}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {displayedTransactions.slice(0, 3).map(tx => (
              <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "8px", borderBottom: "1px solid #242c27" }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "13px", color: "#eae4d9" }}>{tx.title}</div>
                  <div style={{ fontSize: "10px", color: "#9da6a0", marginTop: "2px" }}>{tx.date}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ fontWeight: "700", fontSize: "14px", color: tx.type === 'income' ? "#4a7c59" : "#e56b73" }}>
                    {tx.type === 'income' ? '+' : '-'}{formatVal(tx.amount_usd || tx.amountUSD)} {currency}
                  </div>
                  <button 
                    onClick={() => deleteTransaction(tx.id)}
                    style={{ background: "transparent", border: "none", color: "#8c384a", cursor: "pointer", fontSize: "12px", padding: "2px" }}
                    title={dict.delete}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модальное окно */}
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
            {displayedTransactions.length === 0 ? (
              <p style={{ color: "#9da6a0", fontSize: "13px", textAlign: "center", margin: "20px 0" }}>{dict.noHistory}</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {displayedTransactions.map(tx => (
                  <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "10px", borderBottom: "1px solid #242c27" }}>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "14px", color: "#eae4d9" }}>{tx.title}</div>
                      <div style={{ fontSize: "11px", color: "#9da6a0", marginTop: "2px" }}>{tx.date}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ fontWeight: "700", fontSize: "15px", color: tx.type === 'income' ? "#4a7c59" : "#e56b73" }}>
                        {tx.type === 'income' ? '+' : '-'}{formatVal(tx.amount_usd || tx.amountUSD)} {currency}
                      </div>
                      <button 
                        onClick={() => deleteTransaction(tx.id)}
                        style={{ background: "#2a1e20", border: "1px solid #4a272b", color: "#e56b73", borderRadius: "8px", cursor: "pointer", fontSize: "12px", padding: "4px 8px" }}
                      >
                        {dict.delete}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
