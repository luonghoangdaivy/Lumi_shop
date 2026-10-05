import ProductCard from "../common/ProductCard";

import "../../styles/product-detail/related-products.css";

function RelatedProducts({ products = [], currentProductId }) {
  const relatedProducts = products
    .filter((product) => Number(product.id) !== Number(currentProductId))
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="related-products">
      <div className="related-products-header">
        <h2>Sản phẩm tương tự</h2>

        <p>Có thể bạn cũng sẽ thích</p>
      </div>

      <div className="related-products-grid">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;
