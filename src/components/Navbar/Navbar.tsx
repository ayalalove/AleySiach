import "./Navbar.css";
type Page = "schedule" | "food" | "shopping";

type NavbarProps = {
  currentPage: Page;
  onPageChange: (page: Page) => void;
};

function Navbar({ currentPage, onPageChange }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">🏠</span>

        <div>
          <strong>ניהול דירה 516</strong>
          <span> רכז דירה יאיר טל</span>
        </div>
      </div>

      <div className="navbar-links">
        <button
          className={`nav-button ${
            currentPage === "schedule" ? "active" : ""
          }`}
          onClick={() => onPageChange("schedule")}
        >
          <span>📅</span>
          <span>שיבוץ מדריכים</span>
        </button>

        <button
          className={`nav-button ${currentPage === "food" ? "active" : ""}`}
          onClick={() => onPageChange("food")}
        >
          <span>🍽️</span>
          <span>תפריט אוכל</span>
        </button>

        <button
          className={`nav-button ${
            currentPage === "shopping" ? "active" : ""
          }`}
          onClick={() => onPageChange("shopping")}
        >
          <span>🛒</span>
          <span>קניות</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;