import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductDescription from "../components/product/ProductDescription";
import RelatedProducts from "../components/product/RelatedProducts";

function ProductDetail() {
  return (
    <>
      <Header />

      <main className="product-detail-page">
        <div className="container">
          {/* Breadcrumb */}
          <div className="product-breadcrumb">
            Trang chủ / Sản phẩm / Áo thun basic
          </div>

          {/* Product */}
          <section className="product-detail">
            <ProductGallery />

            <ProductInfo />
          </section>

          {/* Description */}
          <ProductDescription />

          {/* Related */}
          <RelatedProducts />
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ProductDetail;
