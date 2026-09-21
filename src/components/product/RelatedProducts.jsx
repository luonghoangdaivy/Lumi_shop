import ProductCard from "./ProductCard";

function RelatedProducts() {
  const products = [
    {
      id: 1,
      name: "Áo thun basic",
      price: "199.000đ",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    },
    {
      id: 2,
      name: "Áo thun form rộng",
      price: "249.000đ",
      image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1",
    },
    {
      id: 3,
      name: "Áo thun classic",
      price: "299.000đ",
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    },
    {
      id: 4,
      name: "Áo polo basic",
      price: "350.000đ",
      image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e",
    },
  ];

  return (
    <section className="related-products">
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">Bạn có thể thích</span>

          <h2>Sản phẩm liên quan</h2>
        </div>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;
