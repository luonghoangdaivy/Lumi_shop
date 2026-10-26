import { ShoppingBag, Zap, Minus, Plus } from "lucide-react";

import Button from "../common/Button";

import "../../styles/product-detail/product-info.css";

function ProductInfo({
  product,
  colors,
  sizes,
  selectedColor,
  selectedSize,
  selectedVariant,
  onColorChange,
  onSizeChange,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
}) {
  const price = Number(product?.price || 0);

  return (
    <div className="product-info">
      <div className="product-info-category">
        {product?.category?.name || "Sản phẩm"}
      </div>

      <h1 className="product-info-name">{product?.name}</h1>

      <div className="product-info-price">{price.toLocaleString("vi-VN")}₫</div>

      <div className="product-info-divider" />

      {/* Color */}

      {colors.length > 0 && (
        <div className="product-option">
          <div className="product-option-header">
            <span>Màu sắc</span>

            <strong>{selectedColor}</strong>
          </div>

          <div className="product-color-options">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                className={
                  selectedColor === color
                    ? "product-color-option active"
                    : "product-color-option"
                }
                onClick={() => onColorChange(color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size */}

      {sizes.length > 0 && (
        <div className="product-option">
          <div className="product-option-header">
            <span>Kích thước</span>

            <strong>{selectedSize}</strong>
          </div>

          <div className="product-size-options">
            {sizes.map((size) => {
              const variant = product?.variants?.find(
                (item) => item.color === selectedColor && item.size === size,
              );

              const outOfStock = !variant || Number(variant.stock) <= 0;

              return (
                <button
                  key={size}
                  type="button"
                  disabled={outOfStock}
                  className={[
                    "product-size-option",
                    selectedSize === size ? "active" : "",
                    outOfStock ? "disabled" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => onSizeChange(size)}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock */}

      <div className="product-stock">
        {selectedVariant ? (
          Number(selectedVariant.stock) > 0 ? (
            <>Còn {selectedVariant.stock} sản phẩm</>
          ) : (
            <span className="out-of-stock">Hết hàng</span>
          )
        ) : (
          "Vui lòng chọn phân loại"
        )}
      </div>

      {/* Quantity */}

      <div className="product-option product-quantity-option">
        <div className="product-option-header">
          <span>Số lượng</span>
          <strong>
            {selectedVariant ? `Tối đa ${selectedVariant.stock}` : "—"}
          </strong>
        </div>

        <div className="product-quantity-control">
          <button
            type="button"
            aria-label="Giảm số lượng"
            disabled={
              !selectedVariant ||
              Number(selectedVariant.stock) <= 0 ||
              quantity <= 1
            }
            onClick={() => onQuantityChange(quantity - 1)}
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            min="1"
            max={Number(selectedVariant?.stock) || 1}
            value={quantity}
            aria-label="Số lượng sản phẩm"
            disabled={!selectedVariant || Number(selectedVariant.stock) <= 0}
            onChange={(event) => onQuantityChange(event.target.value)}
          />
          <button
            type="button"
            aria-label="Tăng số lượng"
            disabled={
              !selectedVariant ||
              Number(selectedVariant.stock) <= 0 ||
              quantity >= Number(selectedVariant.stock)
            }
            onClick={() => onQuantityChange(quantity + 1)}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Purchase actions */}

      <div className="product-purchase-actions">
        <Button
          variant="primary"
          size="large"
          fullWidth
          disabled={!selectedVariant || Number(selectedVariant.stock) <= 0}
          onClick={onAddToCart}
        >
          <ShoppingBag size={18} />
          Thêm vào giỏ hàng
        </Button>

        <Button
          variant="secondary"
          size="large"
          fullWidth
          disabled={!selectedVariant || Number(selectedVariant.stock) <= 0}
          onClick={onBuyNow}
        >
          <Zap size={18} />
          Mua ngay
        </Button>
      </div>
    </div>
  );
}

export default ProductInfo;
