import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductFilter from "../components/products/ProductFilter";
import ProductGrid from "../components/products/ProductGrid";

function Products() {
  return (
    <>
      <Header />

      <main className="products-page">
        <div className="container">
          <div className="products-breadcrumb">Trang chủ / Sản phẩm</div>

          <div className="products-title">
            <span className="section-eyebrow">Lumi Collection</span>

            <h1>Tất cả sản phẩm</h1>

            <p>Khám phá những thiết kế mới nhất của Lumi.</p>
          </div>

          <div className="products-layout">
            <ProductFilter />

            <ProductGrid />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Products;
