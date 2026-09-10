import "./FoodPage.css";
import menuImage from "./menu.png";

function FoodPage() {
  return (
    <div className="food-page">
      <img
        src={menuImage}
        alt="תפריט האוכל של הדירה"
        className="food-menu-image"
      />

      <a
        href={menuImage}
        download="תפריט-אוכל.jpg"
        className="download-menu-button"
      >
        ⬇️ הורדת התפריט
      </a>
    </div>
  );
}

export default FoodPage;
