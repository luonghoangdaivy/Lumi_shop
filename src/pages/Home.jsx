import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import CategorySection from "../components/home/CategorySection";
import ProductSection from "../components/home/ProductSection";
import BestSellerSection from "../components/home/BestSellerSection";
import SaleBanner from "../components/home/SaleBanner";

function Home() {
  return (
    <>
      <Header />

      <main>
        <div className="container">
          <Hero />

          <CategorySection />

          <ProductSection />

          <BestSellerSection />

          <SaleBanner />
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Home;
