import "./ShoppingPage.css";

function ShoppingPage() {
  return (
    <div className="shopping-page">
      <div className="shopping-header">
        <div>
          <h1>🛒 רשימת קניות</h1>
          <p>ניהול הקניות של הדירה</p>
        </div>

        <div className="shopping-counter">
          <strong>0</strong>
          <span>פריטים</span>
        </div>
      </div>

      <div className="shopping-card">
        <h2>רשימת קניות</h2>

        <div className="empty-shopping">
          <div className="empty-icon">🛍️</div>
          <h3>אין עדיין פריטים ברשימה</h3>
          <p>כאן יופיעו כל הדברים שצריך לקנות לדירה.</p>

          <button className="add-shopping-button">
            + הוספת פריט
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingPage;