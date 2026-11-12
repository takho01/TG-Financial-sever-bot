import { useState } from 'react';

export default function Home() {
  const [balance, setBalance] = useState(15000);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Еда');

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!amount) return;
    setBalance(balance - Number(amount));
    setAmount('');
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "400px", margin: "0 auto", background: "#f5f5f7", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", color: "#1c1c1e" }}>💰 Мой Кошелек</h2>
      
      {/* Карточка баланса */}
      <div style={{ background: "#007aff", color: "white", padding: "20px", borderRadius: "16px", textAlign: "center", marginBottom: "20px", boxShadow: "0 4px 12px rgba(0,122,255,0.3)" }}>
        <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>Текущий баланс</p>
        <h1 style={{ margin: "10px 0 0 0", fontSize: "32px" }}>{balance} ₸</h1>
      </div>

      {/* Форма добавления расхода */}
      <form onSubmit={handleAddExpense} style={{ background: "white", padding: "16px", borderRadius: "16px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <h3>Добавить расход</h3>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", fontSize: "12px", color: "#8e8e93", marginBottom: "4px" }}>Сумма</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="0" 
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #c7c7cc", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "12px", color: "#8e8e93", marginBottom: "4px" }}>Категория</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #c7c7cc", background: "white", boxSizing: "border-box" }}
          >
            <option value="Еда">🍔 Еда</option>
            <option value="Транспорт">🚗 Транспорт</option>
            <option value="Развлечения">🎉 Развлечения</option>
            <option value="Прочее">📦 Прочее</option>
          </select>
        </div>
        <button type="submit" style={{ width: "100%", background: "#34c759", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
          Добавить
        </button>
      </form>

      {/* Заглушка под график / статистику */}
      <div style={{ background: "white", padding: "16px", borderRadius: "16px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <h3 style={{ margin: "0 0 10px 0" }}>📊 Аналитика расходов</h3>
        <p style={{ color: "#8e8e93", fontSize: "14px", margin: 0 }}>Здесь скоро появится графическое распределение по категориям.</p>
      </div>
    </div>
  );
}
