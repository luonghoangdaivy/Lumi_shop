import { ShoppingBag } from "lucide-react";

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
  onAddToCart,
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

      {/* Add cart */}

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
    </div>
  );
}

export default ProductInfo;
