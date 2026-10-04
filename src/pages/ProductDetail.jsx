import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import { getProductById, getProducts } from "../api/product.api";
import { addToCart } from "../api/cart.api";

import {
  getProductReviews,
  createReview,
  deleteReview,
} from "../api/review.api";

const API_URL = "http://localhost:4000";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // PRODUCT
  // =====================================================

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // IMAGE
  // =====================================================

  const [selectedImage, setSelectedImage] = useState("");

  // =====================================================
  // VARIANT
  // =====================================================

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // =====================================================
  // CART
  // =====================================================

  const [addingToCart, setAddingToCart] = useState(false);

  // =====================================================
  // REVIEWS
  // =====================================================

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // =====================================================
  // TAB
  // =====================================================

  const [activeTab, setActiveTab] = useState("description");

  // =====================================================
  // SIMILAR PRODUCTS
  // =====================================================

  const [similarProducts, setSimilarProducts] = useState([]);

  // =====================================================
  // GET PRODUCT
  // =====================================================

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Không tìm thấy mã sản phẩm");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getProductById(id);

        console.log("Product detail:", response);

        const productData = response?.data;

        if (!productData) {
          setError("Không tìm thấy sản phẩm");
          return;
        }

        setProduct(productData);

        // -----------------------------
        // DEFAULT IMAGE
        // -----------------------------

        if (productData.images?.length > 0) {
          const primaryImage =
            productData.images.find((image) => image.is_primary === true) ||
            productData.images[0];

          setSelectedImage(primaryImage.image_url);
        }

        // -----------------------------
        // DEFAULT VARIANT
        // -----------------------------

        if (productData.variants?.length > 0) {
          const availableVariant =
            productData.variants.find((variant) => variant.stock > 0) ||
            productData.variants[0];

          setSelectedColor(availableVariant.color);
          setSelectedSize(availableVariant.size);
        }
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);

        setError(
          error.response?.data?.message || "Không thể tải thông tin sản phẩm",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =====================================================
  // GET REVIEWS
  // =====================================================

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;

      try {
        setReviewLoading(true);

        const response = await getProductReviews(id);

        setReviews(response?.data || []);
      } catch (error) {
        console.error("Lỗi lấy reviews:", error);
        setReviews([]);
      } finally {
        setReviewLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  // =====================================================
  // GET SIMILAR PRODUCTS
  // =====================================================

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!product) return;

      try {
        const response = await getProducts();

        const allProducts = response?.data || [];

        const related = allProducts
          .filter(
            (item) =>
              item.id !== product.id &&
              item.category_id === product.category_id,
          )
          .slice(0, 5);

        setSimilarProducts(related);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm liên quan:", error);

        setSimilarProducts([]);
      }
    };

    fetchSimilarProducts();
  }, [product]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <>
        <Header />

        <main className="product-detail-wrapper">
          <div className="product-detail-loading">Đang tải sản phẩm...</div>
        </main>

        <Footer />
      </>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !product) {
    return (
      <>
        <Header />

        <main className="product-detail-wrapper">
          <div className="product-detail-error">
            <h2>{error || "Không tìm thấy sản phẩm"}</h2>

            <button type="button" onClick={() => navigate("/products")}>
              Quay lại sản phẩm
            </button>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =====================================================
  // COLORS
  // =====================================================

  const colors = [
    ...new Set(product.variants?.map((variant) => variant.color)),
  ];

  // =====================================================
  // SIZES
  // =====================================================

  const sizes = [
    ...new Set(
      product.variants
        ?.filter((variant) => variant.color === selectedColor)
        .map((variant) => variant.size),
    ),
  ];

  // =====================================================
  // SELECTED VARIANT
  // =====================================================

  const selectedVariant = product.variants?.find(
    (variant) =>
      variant.color === selectedColor && variant.size === selectedSize,
  );

  // =====================================================
  // PRICE
  // =====================================================

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN") + " ₫";
  };

  // =====================================================
  // RATING
  // =====================================================

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) => total + Number(review.rating || 0),
            0,
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  // =====================================================
  // CURRENT USER
  // =====================================================

  let currentUser = null;

  try {
    currentUser = JSON.parse(localStorage.getItem("user"));
  } catch {
    currentUser = null;
  }

  // =====================================================
  // CHANGE COLOR
  // =====================================================

  const handleColorChange = (color) => {
    setSelectedColor(color);

    const firstVariant =
      product.variants?.find(
        (variant) => variant.color === color && variant.stock > 0,
      ) || product.variants?.find((variant) => variant.color === color);

    if (firstVariant) {
      setSelectedSize(firstVariant.size);
    } else {
      setSelectedSize("");
    }

    setQuantity(1);
  };

  // =====================================================
  // CHANGE SIZE
  // =====================================================

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  // =====================================================
  // QUANTITY
  // =====================================================

  const handleDecreaseQuantity = () => {
    setQuantity((current) => (current > 1 ? current - 1 : 1));
  };

  const handleIncreaseQuantity = () => {
    if (!selectedVariant) return;

    setQuantity((current) =>
      current < selectedVariant.stock ? current + 1 : current,
    );
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert("Vui lòng chọn màu và kích thước");
      return;
    }

    if (selectedVariant.stock <= 0) {
      alert("Sản phẩm đã hết hàng");
      return;
    }

    if (quantity > selectedVariant.stock) {
      alert(`Chỉ còn ${selectedVariant.stock} sản phẩm`);
      return;
    }

    try {
      setAddingToCart(true);

      await addToCart(selectedVariant.id, quantity);

      alert("Đã thêm sản phẩm vào giỏ hàng!");

      setQuantity(1);
    } catch (error) {
      console.error("Lỗi thêm giỏ hàng:", error);

      alert(error.response?.data?.message || "Không thể thêm vào giỏ hàng");
    } finally {
      setAddingToCart(false);
    }
  };

  // =====================================================
  // BUY NOW
  // =====================================================

  const handleBuyNow = async () => {
    if (!selectedVariant) {
      alert("Vui lòng chọn màu và kích thước");
      return;
    }

    if (selectedVariant.stock <= 0) {
      alert("Sản phẩm đã hết hàng");
      return;
    }

    try {
      setAddingToCart(true);

      await addToCart(selectedVariant.id, quantity);

      navigate("/cart");
    } catch (error) {
      console.error("Lỗi mua ngay:", error);

      alert(error.response?.data?.message || "Không thể mua sản phẩm");
    } finally {
      setAddingToCart(false);
    }
  };

  // =====================================================
  // REVIEW
  // =====================================================

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    if (!currentUser) {
      alert("Vui lòng đăng nhập để đánh giá sản phẩm");

      navigate("/login");

      return;
    }

    if (!reviewComment.trim()) {
      alert("Vui lòng nhập nội dung đánh giá");
      return;
    }

    try {
      setSubmittingReview(true);

      await createReview(id, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      const response = await getProductReviews(id);

      setReviews(response?.data || []);

      setReviewComment("");
      setReviewRating(5);

      alert("Đánh giá sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi tạo review:", error);

      alert(error.response?.data?.message || "Không thể gửi đánh giá");
    } finally {
      setSubmittingReview(false);
    }
  };

  // =====================================================
  // DELETE REVIEW
  // =====================================================

  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa đánh giá này?");

    if (!confirmed) return;

    try {
      await deleteReview(reviewId);

      setReviews((current) =>
        current.filter((review) => review.id !== reviewId),
      );
    } catch (error) {
      console.error("Lỗi xóa review:", error);

      alert(error.response?.data?.message || "Không thể xóa đánh giá");
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      <Header />

      <main className="product-detail-wrapper">
        {/* ==========================================
            BREADCRUMB
        ========================================== */}

        <div className="product-breadcrumb">
          <button type="button" onClick={() => navigate("/")}>
            Trang chủ
          </button>

          <span>/</span>

          <button type="button" onClick={() => navigate("/products")}>
            Sản phẩm
          </button>

          <span>/</span>

          <span>{product.name}</span>
        </div>

        {/* ==========================================
            MAIN PRODUCT
        ========================================== */}

        <section className="product-main">
          {/* LEFT */}
          <div className="product-gallery">
            <div className="product-thumbnails">
              {product.images?.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  className={selectedImage === image.image_url ? "active" : ""}
                  onClick={() => setSelectedImage(image.image_url)}
                >
                  <img
                    src={`${API_URL}${image.image_url}`}
                    alt={product.name}
                  />
                </button>
              ))}
            </div>

            <div className="product-main-image">
              {selectedImage ? (
                <img src={`${API_URL}${selectedImage}`} alt={product.name} />
              ) : (
                <div className="no-image">Không có ảnh</div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="product-information">
            {/* CATEGORY */}

            <p className="product-category">
              {product.category?.name || "SẢN PHẨM THỜI TRANG"}
            </p>

            {/* NAME */}

            <h1>{product.name}</h1>

            {/* RATING */}

            <div className="product-rating">
              <div className="stars">★★★★★</div>

              <span>
                {reviews.length > 0
                  ? `${averageRating} (${reviews.length} đánh giá)`
                  : "Chưa có đánh giá"}
              </span>
            </div>

            {/* PRICE */}

            <div className="product-price-row">
              <strong>{formatPrice(product.price)}</strong>

              {product.original_price &&
                Number(product.original_price) > Number(product.price) && (
                  <>
                    <del>{formatPrice(product.original_price)}</del>

                    <span className="discount-badge">
                      -
                      {Math.round(
                        (1 -
                          Number(product.price) /
                            Number(product.original_price)) *
                          100,
                      )}
                      %
                    </span>
                  </>
                )}
            </div>

            {/* DESCRIPTION */}

            {product.description && (
              <p className="product-short-description">{product.description}</p>
            )}

            {/* COLOR */}

            {colors.length > 0 && (
              <div className="product-selector">
                <div className="selector-title">
                  <strong>Màu sắc</strong>

                  <span>{selectedColor}</span>
                </div>

                <div className="color-options">
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

            {/* SIZE */}

            {sizes.length > 0 && (
              <div className="product-selector">
                <div className="selector-title">
                  <strong>Size</strong>

                  <span>{selectedSize}</span>
                </div>

                <div className="size-options">
                  {sizes.map((size) => {
                    const variant = product.variants?.find(
                      (item) =>
                        item.color === selectedColor && item.size === size,
                    );

                    const outOfStock = !variant || variant.stock <= 0;

                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={outOfStock}
                        className={selectedSize === size ? "selected" : ""}
                        onClick={() => handleSizeChange(size)}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* QUANTITY */}

            <div className="product-quantity-row">
              <strong>Số lượng</strong>

              <div className="quantity-box">
                <button
                  type="button"
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={handleIncreaseQuantity}
                  disabled={
                    !selectedVariant || quantity >= selectedVariant.stock
                  }
                >
                  +
                </button>
              </div>

              {selectedVariant && (
                <span className="stock-text">
                  Còn <strong>{selectedVariant.stock}</strong> sản phẩm
                </span>
              )}
            </div>

            {/* ACTION */}

            <div className="product-actions">
              <button
                type="button"
                className="btn-add-cart"
                disabled={
                  !selectedVariant || selectedVariant.stock <= 0 || addingToCart
                }
                onClick={handleAddToCart}
              >
                {addingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
              </button>

              <button
                type="button"
                className="btn-buy-now"
                disabled={
                  !selectedVariant || selectedVariant.stock <= 0 || addingToCart
                }
                onClick={handleBuyNow}
              >
                Mua ngay
              </button>
            </div>

            {/* BENEFITS */}

            <div className="product-benefits">
              <div className="benefit-item">
                <span>↻</span>

                <div>
                  <strong>Đổi trả dễ dàng</strong>

                  <p>Hỗ trợ đổi trả sản phẩm</p>
                </div>
              </div>

              <div className="benefit-item">
                <span>♧</span>

                <div>
                  <strong>Chất lượng đảm bảo</strong>

                  <p>Sản phẩm được kiểm tra</p>
                </div>
              </div>

              <div className="benefit-item">
                <span>♧</span>

                <div>
                  <strong>Giao hàng nhanh</strong>

                  <p>Đóng gói cẩn thận</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            TABS
        ========================================== */}

        <section className="product-tabs">
          <div className="tabs-header">
            <button
              type="button"
              className={activeTab === "description" ? "active" : ""}
              onClick={() => setActiveTab("description")}
            >
              Mô tả sản phẩm
            </button>

            <button
              type="button"
              className={activeTab === "reviews" ? "active" : ""}
              onClick={() => setActiveTab("reviews")}
            >
              Đánh giá ({reviews.length})
            </button>

            <button
              type="button"
              className={activeTab === "similar" ? "active" : ""}
              onClick={() => setActiveTab("similar")}
            >
              Sản phẩm liên quan
            </button>
          </div>

          {/* =====================================
              DESCRIPTION
          ===================================== */}

          {activeTab === "description" && (
            <div className="tab-content description-content">
              <h3>Thông tin sản phẩm</h3>

              <p>
                {product.description ||
                  "Sản phẩm thời trang Lumi được thiết kế theo phong cách hiện đại, tối giản và dễ phối đồ."}
              </p>

              <ul>
                <li>Thiết kế unisex phù hợp nhiều phong cách.</li>

                <li>Chất liệu thoải mái, phù hợp sử dụng hằng ngày.</li>

                <li>Form dáng hiện đại, dễ phối với nhiều trang phục.</li>

                <li>Sản phẩm được kiểm tra trước khi đóng gói.</li>
              </ul>
            </div>
          )}

          {/* =====================================
              REVIEWS
          ===================================== */}

          {activeTab === "reviews" && (
            <div className="tab-content reviews-content">
              <div className="review-summary-box">
                <div className="review-score">
                  <strong>{averageRating}</strong>

                  <div className="review-stars">★★★★★</div>

                  <span>{reviews.length} đánh giá</span>
                </div>
              </div>

              {/* FORM */}

              {!currentUser ? (
                <div className="review-login-box">
                  <p>Vui lòng đăng nhập để đánh giá sản phẩm.</p>

                  <button type="button" onClick={() => navigate("/login")}>
                    Đăng nhập
                  </button>
                </div>
              ) : (
                <form className="review-form" onSubmit={handleSubmitReview}>
                  <h3>Viết đánh giá</h3>

                  <div className="review-rating-input">
                    <span>Đánh giá</span>

                    <div>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className={rating <= reviewRating ? "active" : ""}
                          onClick={() => setReviewRating(rating)}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={reviewComment}
                    onChange={(event) => setReviewComment(event.target.value)}
                    placeholder="Chia sẻ cảm nhận của bạn..."
                    rows="5"
                  />

                  <button type="submit" disabled={submittingReview}>
                    {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                  </button>
                </form>
              )}

              {/* LIST */}

              <div className="review-list">
                {reviewLoading ? (
                  <p>Đang tải đánh giá...</p>
                ) : reviews.length === 0 ? (
                  <div className="empty-review">Chưa có đánh giá nào.</div>
                ) : (
                  reviews.map((review) => (
                    <article key={review.id} className="review-item">
                      <div className="review-user">
                        <strong>{review.user?.username || "Khách hàng"}</strong>

                        <div className="review-stars">
                          {"★".repeat(Number(review.rating))}
                        </div>
                      </div>

                      <p>{review.comment}</p>

                      <div className="review-footer">
                        <span>
                          {review.created_at
                            ? new Date(review.created_at).toLocaleDateString(
                                "vi-VN",
                              )
                            : ""}
                        </span>

                        {currentUser?.id === review.user_id && (
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          )}

          {/* =====================================
              SIMILAR PRODUCTS
          ===================================== */}

          {activeTab === "similar" && (
            <div className="tab-content similar-content">
              {similarProducts.length === 0 ? (
                <div className="empty-similar">Chưa có sản phẩm liên quan.</div>
              ) : (
                <div className="similar-products-grid">
                  {similarProducts.map((item) => {
                    const image =
                      item.images?.find((image) => image.is_primary === true) ||
                      item.images?.[0];

                    return (
                      <article
                        key={item.id}
                        className="similar-product-card"
                        onClick={() => navigate(`/products/${item.id}`)}
                      >
                        <div className="similar-product-image">
                          {image ? (
                            <img
                              src={`${API_URL}${image.image_url}`}
                              alt={item.name}
                            />
                          ) : (
                            <div>Không có ảnh</div>
                          )}
                        </div>

                        <div className="similar-product-info">
                          <p>{item.category?.name || "Lumi"}</p>

                          <h3>{item.name}</h3>

                          <strong>{formatPrice(item.price)}</strong>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ProductDetail;
