import "../../styles/product-detail/product-description.css";

function ProductDescription({ description }) {
  return (
    <section className="product-description">
      <h2>Mô tả sản phẩm</h2>

      <div className="product-description-content">
        {description ? (
          <p>{description}</p>
        ) : (
          <p className="text-muted">Chưa có mô tả cho sản phẩm này.</p>
        )}
      </div>
    </section>
  );
}

export default ProductDescription;
