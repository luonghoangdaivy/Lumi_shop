import { useEffect, useState } from "react";
import { addToCart } from "../../api/cart.api";

function ProductInfo({ product }) {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState("");

  const variants = product.variants || [];

  // ==========================
  // COLORS
  // ==========================

  const colors = [...new Set(variants.map((variant) => variant.color))];

  // ==========================
  // SET DEFAULT COLOR
  // ==========================

  useEffect(() => {
    if (variants.length > 0) {
      setSelectedColor(variants[0].color);
      setSelectedSize(variants[0].size);
    }
  }, [product]);

  // ==========================
  // SIZES
  // ==========================

  const sizes = [
    ...new Set(
      variants
        .filter((variant) => variant.color === selectedColor)
        .map((variant) => variant.size),
    ),
  ];

  // ==========================
  // SELECTED VARIANT
  // ==========================

  const selectedVariant = variants.find(
    (variant) =>
      variant.color === selectedColor && variant.size === selectedSize,
  );

  // ==========================
  // CHANGE COLOR
  // ==========================

  const handleColorChange = (color) => {
    setSelectedColor(color);

    const firstVariant = variants.find((variant) => variant.color === color);

    setSelectedSize(firstVariant?.size || "");

    setQuantity(1);
    setMessage("");
  };

  // ==========================
  // ADD TO CART
  // ==========================

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setMessage("Vui lòng chọn màu và kích thước");
      return;
    }

    if (selectedVariant.stock <= 0) {
      setMessage("Sản phẩm đã hết hàng");
      return;
    }

    if (quantity > selectedVariant.stock) {
      setMessage(`Chỉ còn ${selectedVariant.stock} sản phẩm`);
      return;
    }

    try {
      setAddingToCart(true);
      setMessage("");

      const response = await addToCart(selectedVariant.id, quantity);

      console.log("Add cart:", response);

      setMessage("Đã thêm sản phẩm vào giỏ hàng");
    } catch (error) {
      console.error("Add cart error:", error);

      setMessage(
        error.response?.data?.message || "Không thể thêm sản phẩm vào giỏ hàng",
      );
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="product-info">
      {/* Category */}
      <p className="product-category">{product.category?.name}</p>

      {/* Name */}
      <h1>{product.name}</h1>

      {/* Price */}
      <p className="product-price">
        {Number(product.price).toLocaleString("vi-VN")} ₫
      </p>

      {/* Color */}
      {colors.length > 0 && (
        <div className="product-option">
          <h3>Màu sắc</h3>

          <div className="product-options">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                className={selectedColor === color ? "selected" : ""}
                onClick={() => handleColorChange(color)}
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
          <h3>Kích thước</h3>

          <div className="product-options">
            {sizes.map((size) => {
              const variant = variants.find(
                (item) => item.color === selectedColor && item.size === size,
              );

              const outOfStock = !variant || variant.stock <= 0;

              return (
                <button
                  key={size}
                  type="button"
                  disabled={outOfStock}
                  className={selectedSize === size ? "selected" : ""}
                  onClick={() => {
                    setSelectedSize(size);
                    setQuantity(1);
                    setMessage("");
                  }}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock */}
      {selectedVariant && (
        <p className="product-stock">
          {selectedVariant.stock > 0
            ? `Còn ${selectedVariant.stock} sản phẩm`
            : "Hết hàng"}
        </p>
      )}

      {/* Quantity */}
      <div className="product-quantity">
        <h3>Số lượng</h3>

        <div className="quantity-control">
          <button
            type="button"
            disabled={quantity <= 1}
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          >
            -
          </button>

          <span>{quantity}</span>

          <button
            type="button"
            disabled={!selectedVariant || quantity >= selectedVariant.stock}
            onClick={() =>
              setQuantity((prev) => Math.min(selectedVariant.stock, prev + 1))
            }
          >
            +
          </button>
        </div>
      </div>

      {/* Add cart */}
      <button
        type="button"
        className="add-to-cart-button"
        disabled={
          addingToCart || !selectedVariant || selectedVariant.stock <= 0
        }
        onClick={handleAddToCart}
      >
        {addingToCart
          ? "Đang thêm..."
          : selectedVariant?.stock > 0
            ? "Thêm vào giỏ hàng"
            : "Hết hàng"}
      </button>

      {/* Message */}
      {message && <p className="cart-message">{message}</p>}
    </div>
  );
}

export default ProductInfo;
