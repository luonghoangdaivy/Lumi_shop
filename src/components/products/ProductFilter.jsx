function ProductFilter({
  category,
  onCategoryChange,
  priceRange,
  onPriceChange,
  onReset,
}) {
  return (
    <div className="product-filter">
      {/* DANH MỤC */}
      <div className="product-filter-group">
        <div className="product-filter-heading">
          <span className="product-filter-label">Danh mục</span>
        </div>

        <div className="product-filter-options">
          <button
            type="button"
            className={
              category === ""
                ? "product-filter-option active"
                : "product-filter-option"
            }
            onClick={() => onCategoryChange("")}
          >
            Tất cả
          </button>

          <button
            type="button"
            className={
              category === "ao"
                ? "product-filter-option active"
                : "product-filter-option"
            }
            onClick={() => onCategoryChange("ao")}
          >
            Áo
          </button>

          <button
            type="button"
            className={
              category === "quan"
                ? "product-filter-option active"
                : "product-filter-option"
            }
            onClick={() => onCategoryChange("quan")}
          >
            Quần
          </button>

          <button
            type="button"
            className={
              category === "vay"
                ? "product-filter-option active"
                : "product-filter-option"
            }
            onClick={() => onCategoryChange("vay")}
          >
            Váy
          </button>

          <button
            type="button"
            className={
              category === "ao-khoac"
                ? "product-filter-option active"
                : "product-filter-option"
            }
            onClick={() => onCategoryChange("ao-khoac")}
          >
            Áo khoác
          </button>
        </div>
      </div>

      {/* KHOẢNG GIÁ */}
      <div className="product-filter-group">
        <div className="product-filter-heading">
          <span className="product-filter-label">Khoảng giá</span>
        </div>

        <div className="product-filter-options">
          <button
            type="button"
            className={
              priceRange === "all"
                ? "product-filter-option active"
                : "product-filter-option"
            }
            onClick={() => onPriceChange("all")}
          >
            Tất cả
          </button>

          <button
            type="button"
            className={
              priceRange === "under-300"
                ? "product-filter-option active"
                : "product-filter-option"
            }
            onClick={() => onPriceChange("under-300")}
          >
            Dưới 300.000đ
          </button>

          <button
            type="button"
            className={
              priceRange === "300-500"
                ? "product-filter-option active"
                : "product-filter-option"
            }
            onClick={() => onPriceChange("300-500")}
          >
            300.000đ - 500.000đ
          </button>

          <button
            type="button"
            className={
              priceRange === "500-1000"
                ? "product-filter-option active"
                : "product-filter-option"
            }
            onClick={() => onPriceChange("500-1000")}
          >
            500.000đ - 1.000.000đ
          </button>

          <button
            type="button"
            className={
              priceRange === "over-1000"
                ? "product-filter-option active"
                : "product-filter-option"
            }
            onClick={() => onPriceChange("over-1000")}
          >
            Trên 1.000.000đ
          </button>
        </div>
      </div>

      {/* XÓA BỘ LỌC */}
      {(category || priceRange !== "all") && (
        <button
          type="button"
          className="product-filter-reset"
          onClick={onReset}
        >
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
}

export default ProductFilter;
