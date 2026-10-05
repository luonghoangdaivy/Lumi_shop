import "../../styles/products/product-filter.css";

function ProductFilter({
  searchValue,
  onSearchChange,
  category,
  onCategoryChange,
  productCount,
}) {
  const categories = [
    {
      value: "all",
      label: "Tất cả",
    },
    {
      value: "ao",
      label: "Áo",
    },
    {
      value: "quan",
      label: "Quần",
    },
    {
      value: "vay",
      label: "Váy",
    },
    {
      value: "ao-khoac",
      label: "Áo khoác",
    },
  ];

  return (
    <div className="product-filter">
      <div className="product-filter-left">
        <span className="product-filter-count">{productCount} sản phẩm</span>
      </div>

      <div className="product-filter-right">
        <div className="product-filter-search">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
          />
        </div>

        <div className="product-filter-categories">
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              className={
                category === item.value
                  ? "product-filter-category active"
                  : "product-filter-category"
              }
              onClick={() => onCategoryChange(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductFilter;
