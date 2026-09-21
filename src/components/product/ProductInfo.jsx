import { Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import Button from "../common/Button";

function ProductInfo() {
  return (
    <div className="product-info">
      <span className="product-category">Áo thun</span>

      <h1>Áo thun basic</h1>

      <div className="product-rating">
        <span>★★★★★</span>
        <span>(128 đánh giá)</span>
      </div>

      <div className="product-price">
        <strong>199.000đ</strong>

        <span className="old-price">250.000đ</span>

        <span className="discount">-20%</span>
      </div>

      <p className="product-short-description">
        Áo thun basic form rộng với chất liệu cotton mềm mại, thoáng mát. Thiết
        kế tối giản phù hợp với phong cách unisex.
      </p>

      {/* Color */}
      <div className="product-option">
        <div className="option-header">
          <span>Màu sắc</span>
          <strong>Trắng</strong>
        </div>

        <div className="color-options">
          <button className="color-option white"></button>
          <button className="color-option black"></button>
          <button className="color-option brown"></button>
        </div>
      </div>

      {/* Size */}
      <div className="product-option">
        <div className="option-header">
          <span>Kích thước</span>

          <button className="size-guide">Hướng dẫn chọn size</button>
        </div>

        <div className="size-options">
          <button>XS</button>
          <button>S</button>
          <button className="active">M</button>
          <button>L</button>
          <button>XL</button>
        </div>
      </div>

      {/* Quantity */}
      <div className="product-option">
        <div className="option-header">
          <span>Số lượng</span>

          <span className="stock">Còn 15 sản phẩm</span>
        </div>

        <div className="quantity">
          <button>
            <Minus size={16} />
          </button>

          <span>1</span>

          <button>
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="product-actions">
        <Button className="add-cart">
          <ShoppingBag size={18} />
          Thêm vào giỏ hàng
        </Button>

        <Button className="buy-now">
          <Zap size={18} />
          Mua ngay
        </Button>
      </div>

      <div className="product-benefits">
        <span>✓ Miễn phí vận chuyển</span>
        <span>✓ Đổi trả trong 7 ngày</span>
        <span>✓ Kiểm tra hàng khi nhận</span>
      </div>
    </div>
  );
}

export default ProductInfo;
