import ProductCard from "../common/ProductCard";

import "../../styles/products/product-grid.css";

function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="product-grid-empty">
        <h3>Không tìm thấy sản phẩm</h3>

        <p>Hãy thử tìm kiếm với từ khóa khác.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
