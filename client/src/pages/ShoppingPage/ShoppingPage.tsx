import { useEffect, useState } from "react";
import { api } from "../../api/api";
import "./ShoppingPage.css";

type ShoppingItem = {
  _id: string;
  name: string;
  category: string;
  missing: boolean;
};

const CATEGORY_ORDER = [
  "מוצרי חלב וביצים",
  "מאפים",
  "ירקות ופירות",
  "מזון יבש",
  "ניקיון והיגיינה",
  "אחר",
];

const CATEGORY_ICONS: Record<string, string> = {
  "מוצרי חלב וביצים": "🥛",
  מאפים: "🍞",
  "ירקות ופירות": "🥕",
  "מזון יבש": "🍝",
  "ניקיון והיגיינה": "🧼",
  אחר: "📦",
};

const groupByCategory = (items: ShoppingItem[]) => {
  const groups: Record<string, ShoppingItem[]> = {};

  items.forEach((item) => {
    const category = item.category || "אחר";
    groups[category] = groups[category] ?? [];
    groups[category].push(item);
  });

  return Object.entries(groups).sort(
    ([a], [b]) =>
      (CATEGORY_ORDER.indexOf(a) + 1 || 99) -
      (CATEGORY_ORDER.indexOf(b) + 1 || 99),
  );
};

function ShoppingPage() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState("");
  const [addingItem, setAddingItem] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await api.shopping.getAll();
      setItems(data ?? []);
    } catch (error) {
      console.error("Error loading shopping items:", error);
    } finally {
      setLoading(false);
    }
  };

  const missingItems = items.filter((item) => item.missing);
  const availableItems = items.filter((item) => !item.missing);

  // =========================
  // העברה בין הרשימות
  // =========================

  const toggleItem = async (item: ShoppingItem) => {
    const missing = !item.missing;

    setItems((current) =>
      current.map((other) =>
        other._id === item._id ? { ...other, missing } : other,
      ),
    );

    try {
      const data = await api.shopping.setMissing(item._id, missing);

      if (!data?._id) {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      alert("שגיאה בעדכון הפריט");

      setItems((current) =>
        current.map((other) =>
          other._id === item._id ? { ...other, missing: item.missing } : other,
        ),
      );
    }
  };

  // =========================
  // הוספת פריט חדש
  // =========================

  const addItem = async () => {
    const name = newItemName.trim();

    if (!name) return;

    const existing = items.find((item) => item.name === name);

    if (existing) {
      if (!existing.missing) {
        toggleItem(existing);
      }

      setNewItemName("");
      return;
    }

    setAddingItem(true);

    try {
      const data = await api.shopping.create(name);

      if (!data?._id) {
        alert(data?.message || "שגיאה בהוספת הפריט");
        return;
      }

      setItems((current) => [...current, data]);
      setNewItemName("");
    } catch (error) {
      console.error("Error adding item:", error);
      alert("שגיאה בהוספת הפריט");
    } finally {
      setAddingItem(false);
    }
  };

  // =========================
  // מחיקת פריט
  // =========================

  const deleteItem = async (item: ShoppingItem) => {
    const confirmed = window.confirm(
      `האם את בטוחה שאת רוצה למחוק את "${item.name}" לגמרי מהרשימות?`,
    );

    if (!confirmed) return;

    try {
      const result = await api.shopping.delete(item._id);

      if (result?.success === false) {
        alert(result.message || "שגיאה במחיקת הפריט");
        return;
      }

      setItems((current) => current.filter((other) => other._id !== item._id));
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("שגיאה במחיקת הפריט");
    }
  };

  // =========================
  // קניתי הכל
  // =========================

  const markAllAvailable = async () => {
    const confirmed = window.confirm(
      "לסמן שכל הפריטים נקנו ולהחזיר אותם למצרכים הבסיסיים?",
    );

    if (!confirmed) return;

    try {
      await api.shopping.markAllAvailable();

      setItems((current) =>
        current.map((item) => ({ ...item, missing: false })),
      );
    } catch (error) {
      console.error("Error marking all available:", error);
      alert("שגיאה בעדכון הרשימה");
    }
  };

  return (
    <div className="shopping-page">
      {/* =========================
          HEADER
      ========================= */}

      <header className="shopping-header">
        <div className="shopping-title-area">
          <div className="shopping-title-icon">🛒</div>

          <div>
            <h1>רשימת קניות</h1>

            <p>לחצי על מצרך כדי להעביר אותו לרשימת החסרים, ולהפך</p>
          </div>
        </div>

        <div className="shopping-counter">
          <strong>{missingItems.length}</strong>

          <span>פריטים חסרים</span>
        </div>
      </header>

      {loading ? (
        <div className="shopping-loading">טוען...</div>
      ) : (
        <div className="shopping-layout">
          {/* =========================
              MISSING ITEMS
          ========================= */}

          <section className="shopping-card missing-card">
            <div className="shopping-card-header">
              <div className="shopping-card-icon missing">📝</div>

              <div className="shopping-card-title">
                <h2>חסר בדירה</h2>

                <p>{missingItems.length} פריטים לקנות</p>
              </div>

              {missingItems.length > 0 && (
                <button
                  className="mark-all-button"
                  onClick={markAllAvailable}
                >
                  ✓ קניתי הכל
                </button>
              )}
            </div>

            <div className="add-item-area">
              <input
                value={newItemName}
                onChange={(event) => setNewItemName(event.target.value)}
                placeholder="הוספת פריט שחסר..."
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    addItem();
                  }
                }}
              />

              <button
                className="add-item-button"
                onClick={addItem}
                disabled={addingItem || !newItemName.trim()}
              >
                + הוספה
              </button>
            </div>

            {missingItems.length === 0 ? (
              <div className="missing-empty">
                <div className="missing-empty-icon">🎉</div>

                <strong>לא חסר כלום!</strong>

                <span>לחצי על מצרך מהרשימה כדי לסמן שהוא חסר</span>
              </div>
            ) : (
              <div className="missing-list">
                {missingItems.map((item) => (
                  <div key={item._id} className="missing-item">
                    <button
                      className="missing-item-main"
                      onClick={() => toggleItem(item)}
                      title="סימון שנקנה"
                    >
                      <span className="missing-item-check" />

                      <span className="missing-item-icon">
                        {CATEGORY_ICONS[item.category] ?? "📦"}
                      </span>

                      <span className="missing-item-name">{item.name}</span>
                    </button>

                    {item.category === "אחר" && (
                      <button
                        className="missing-item-delete"
                        onClick={() => deleteItem(item)}
                        title="מחיקת הפריט"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* =========================
              BASIC ITEMS
          ========================= */}

          <section className="shopping-card basics-card">
            <div className="shopping-card-header">
              <div className="shopping-card-icon">🧺</div>

              <div className="shopping-card-title">
                <h2>מצרכים בסיסיים</h2>

                <p>יש בדירה · לחצי על מצרך שנגמר</p>
              </div>
            </div>

            {availableItems.length === 0 ? (
              <div className="missing-empty">
                <strong>כל המצרכים ברשימת החסרים</strong>
              </div>
            ) : (
              <div className="basics-groups">
                {groupByCategory(availableItems).map(
                  ([category, categoryItems]) => (
                    <div key={category} className="basics-group">
                      <div className="basics-group-title">
                        <span>{CATEGORY_ICONS[category] ?? "📦"}</span>

                        <span>{category}</span>
                      </div>

                      <div className="basics-chips">
                        {categoryItems.map((item) => (
                          <button
                            key={item._id}
                            className="basic-chip"
                            onClick={() => toggleItem(item)}
                            title="סימון שחסר"
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default ShoppingPage;
