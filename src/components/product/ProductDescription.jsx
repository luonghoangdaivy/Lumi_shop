function ProductDescription() {
  return (
    <section className="product-description">
      <div className="description-tabs">
        <button className="active">Mô tả sản phẩm</button>

        <button>Đánh giá (128)</button>

        <button>Chính sách sản phẩm</button>
      </div>

      <div className="description-content">
        <h3>Áo thun basic</h3>

        <p>
          Thiết kế basic tối giản, phù hợp với phong cách unisex và dễ dàng kết
          hợp với nhiều loại trang phục.
        </p>

        <ul>
          <li>Chất liệu cotton mềm mại</li>
          <li>Form áo thoải mái</li>
          <li>Thiết kế unisex</li>
          <li>Phù hợp mặc hàng ngày</li>
          <li>Dễ dàng phối đồ</li>
        </ul>
      </div>
    </section>
  );
}

export default ProductDescription;
