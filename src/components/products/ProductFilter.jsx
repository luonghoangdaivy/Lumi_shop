function ProductFilter() {
  return (
    <aside className="product-filter">
      <div className="filter-group">
        <h3>Danh mục</h3>

        <label>
          <input type="checkbox" />
          Áo
        </label>

        <label>
          <input type="checkbox" />
          Quần
        </label>

        <label>
          <input type="checkbox" />
          Váy
        </label>

        <label>
          <input type="checkbox" />
          Áo khoác
        </label>

        <label>
          <input type="checkbox" />
          Phụ kiện
        </label>
      </div>

      <div className="filter-group">
        <h3>Thương hiệu</h3>

        <label>
          <input type="checkbox" />
          Adidas
        </label>

        <label>
          <input type="checkbox" />
          Zara
        </label>

        <label>
          <input type="checkbox" />
          Uniqlo
        </label>

        <label>
          <input type="checkbox" />
          Nike
        </label>
      </div>

      <div className="filter-group">
        <h3>Khoảng giá</h3>

        <label>
          <input type="checkbox" />
          Dưới 300.000đ
        </label>

        <label>
          <input type="checkbox" />
          300.000đ - 400.000đ
        </label>

        <label>
          <input type="checkbox" />
          400.000đ - 600.000đ
        </label>

        <label>
          <input type="checkbox" />
          Trên 600.000đ
        </label>
      </div>

      <div className="filter-group">
        <h3>Màu sắc</h3>

        <div className="color-options">
          <span className="color-dot black"></span>
          <span className="color-dot white"></span>
          <span className="color-dot brown"></span>
          <span className="color-dot blue"></span>
          <span className="color-dot red"></span>
        </div>
      </div>

      <div className="filter-group">
        <h3>Size</h3>

        <div className="size-options">
          <button>XS</button>
          <button>S</button>
          <button>M</button>
          <button>L</button>
          <button>XL</button>
          <button>XXL</button>
        </div>
      </div>

      <button className="filter-button">Lọc sản phẩm</button>
    </aside>
  );
}

export default ProductFilter;
