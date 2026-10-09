import Hero from "../components/home/Hero";
import CategorySection from "../components/home/CategorySection";
import ProductSection from "../components/home/ProductSection";
import BestSellerSection from "../components/home/BestSellerSection";
import SaleBanner from "../components/home/SaleBanner";

import "../styles/home/home.css";

function Home() {
  return (
    <>
      <main className="home-page">
        <Hero />

        <CategorySection />

        <ProductSection />

        <BestSellerSection />

        <SaleBanner />
      </main>
    </>
  );
}

export default Home;
