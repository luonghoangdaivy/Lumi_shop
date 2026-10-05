import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import Hero from "../components/home/Hero";
import CategorySection from "../components/home/CategorySection";
import ProductSection from "../components/home/ProductSection";
import BestSellerSection from "../components/home/BestSellerSection";
import SaleBanner from "../components/home/SaleBanner";

import "../styles/home/home.css";

function Home() {
  return (
    <>
      <Header />

      <main className="home-page">
        <Hero />

        <CategorySection />

        <ProductSection />

        <BestSellerSection />

        <SaleBanner />
      </main>

      <Footer />
    </>
  );
}

export default Home;
