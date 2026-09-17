import ProductCard from "../product/ProductCard";

const products = [
  {
    id: 1,
    name: "Áo thun basic",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700",
    price: 199000,
    oldPrice: 250000,
    discount: 20,
  },
  {
    id: 2,
    name: "Quần jean ống rộng",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=700",
    price: 350000,
    oldPrice: 420000,
    discount: 17,
  },
  {
    id: 3,
    name: "Váy hai dây",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=700",
    price: 450000,
  },
  {
    id: 4,
    name: "Áo khoác bomber",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700",
    price: 599000,
  },
  {
    id: 5,
    name: "Áo hoodie basic",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700",
    price: 399000,
  },
  {
    id: 6,
    name: "Quần cargo",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700",
    price: 390000,
  },
];

function ProductGrid() {
  return (
    <div className="products-content">
      <div className="products-toolbar">
        <span>24 sản phẩm</span>

        <select defaultValue="newest">
          <option value="newest">Mới nhất</option>
          <option value="price-asc">Giá thấp đến cao</option>
          <option value="price-desc">Giá cao đến thấp</option>
          <option value="name">Tên A-Z</option>
        </select>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="pagination">
        <button>←</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>→</button>
      </div>
    </div>
  );
}

export default ProductGrid;
