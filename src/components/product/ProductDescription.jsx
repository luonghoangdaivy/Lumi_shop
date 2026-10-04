function ProductDescription({ description }) {
  return (
    <section className="product-description">
      <h2>Mô tả sản phẩm</h2>

      <p>{description || "Chưa có mô tả sản phẩm."}</p>
    </section>
  );
}

export default ProductDescription;
