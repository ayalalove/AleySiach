import { useState } from "react";

import Navbar from "./components/Navbar/Navbar";

import FoodPage from "./pages/FoodPage/FoodPage";
import ShoppingPage from "./pages/ShoppingPage/ShoppingPage";
import SchedulePage from "./pages/SchedulePage/SchedulePage";

type Page = "schedule" | "food" | "shopping";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("schedule");

  const renderPage = () => {
    switch (currentPage) {
      case "schedule":
        return <SchedulePage />;

      case "food":
        return <FoodPage />;

      case "shopping":
        return <ShoppingPage />;

      default:
        return <SchedulePage />;
    }
  };

  return (
    <div dir="rtl" className="app">
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />

      <main>{renderPage()}</main>
    </div>
  );
}

export default App;
