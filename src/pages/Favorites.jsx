import { useCallback, useEffect, useState } from "react";

import { Heart, ShoppingBag } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { getFavorites, removeFavorite } from "../api/favorite.api.js";

import "../styles/favorites/favorites.css";

const API_URL = "http://localhost:4000";

function Favorites() {
  const navigate = useNavigate();

  const { user, loading: authLoading } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD FAVORITES
  // =====================================================

  const loadFavorites = useCallback(async () => {
    // Chưa đăng nhập
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await getFavorites();

      console.log("FAVORITES RESPONSE:", response);

      /*
        API có thể trả:

        {
          success: true,
          data: [...]
        }

        hoặc:

        [...]
      */

      const data = response?.data ?? response ?? [];

      setFavorites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("GET FAVORITES ERROR:", error);

      console.error("STATUS:", error?.response?.status);

      console.error("DATA:", error?.response?.data);

      if (error?.response?.status === 401) {
        localStorage.removeItem("accessToken");

        localStorage.removeItem("user");

        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  // =====================================================
  // LOAD KHI USER ĐÃ XÁC THỰC
  // =====================================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    loadFavorites();
  }, [authLoading, loadFavorites]);

  // =====================================================
  // REMOVE FAVORITE
  // =====================================================

  const handleRemoveFavorite = async (productId) => {
    try {
      await removeFavorite(productId);

      /*
        Xóa ngay khỏi giao diện
        không cần gọi GET /favorites lại
      */

      setFavorites((prev) =>
        prev.filter((item) => {
          const id = item.product_id ?? item.product?.id ?? item.id;

          return String(id) !== String(productId);
        }),
      );
    } catch (error) {
      console.error("REMOVE FAVORITE ERROR:", error);

      alert(
        error?.response?.data?.message ||
          "Không thể xóa sản phẩm khỏi yêu thích",
      );
    }
  };

  // =====================================================
  // CHƯA ĐĂNG NHẬP
  // =====================================================

  if (!authLoading && !user) {
    return (
      <div className="favorites-page">
        <div className="favorites-container">
          <div className="favorites-login">
            <Heart size={48} />

            <h1>Danh sách yêu thích</h1>

            <p>Vui lòng đăng nhập để xem các sản phẩm bạn đã yêu thích.</p>

            <button onClick={() => navigate("/login")}>Đăng nhập</button>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (authLoading || loading) {
    return (
      <div className="favorites-page">
        <div className="favorites-container">
          <div className="favorites-loading">
            Đang tải sản phẩm yêu thích...
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // EMPTY
  // =====================================================

  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <div className="favorites-container">
          <div className="favorites-header">
            <div>
              <span>MY LUMI</span>

              <h1>Sản phẩm yêu thích</h1>

              <p>Những sản phẩm bạn đang quan tâm</p>
            </div>
          </div>

          <div className="favorites-empty">
            <div className="favorites-empty-icon">
              <Heart size={42} />
            </div>

            <h2>Chưa có sản phẩm yêu thích</h2>

            <p>Hãy thêm những sản phẩm bạn yêu thích để xem lại sau.</p>

            <button onClick={() => navigate("/products")}>
              <ShoppingBag size={17} />
              Khám phá sản phẩm
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // FAVORITES PAGE
  // =====================================================

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        {/* =========================================
            HEADER
        ========================================= */}

        <div className="favorites-header">
          <div>
            <span>MY LUMI</span>

            <h1>Sản phẩm yêu thích</h1>

            <p>{favorites.length} sản phẩm trong danh sách yêu thích</p>
          </div>
        </div>

        {/* =========================================
            PRODUCT GRID
        ========================================= */}

        <div className="favorites-grid">
          {favorites.map((item) => {
            /*
              Backend có thể trả:

              {
                product_id: 1,
                product: {...}
              }

              hoặc product trực tiếp.
            */

            const product = item.product ?? item;

            const productId = item.product_id ?? product.id;

            // =====================================
            // IMAGE
            // =====================================

            const images = Array.isArray(product.images) ? product.images : [];

            const primaryImage =
              images.find((image) => image.is_primary === true) ?? images[0];

            const imageUrl = primaryImage?.image_url
              ? primaryImage.image_url.startsWith("http")
                ? primaryImage.image_url
                : `${API_URL}${primaryImage.image_url}`
              : null;

            // =====================================
            // CARD
            // =====================================

            return (
              <div className="favorite-card" key={productId}>
                {/* IMAGE */}

                <div className="favorite-card-image">
                  <button
                    type="button"
                    className="favorite-remove"
                    title="Xóa khỏi yêu thích"
                    onClick={() => handleRemoveFavorite(productId)}
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>

                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name || "Sản phẩm"}
                      onClick={() => navigate(`/products/${productId}`)}
                    />
                  ) : (
                    <div
                      className="favorite-no-image"
                      onClick={() => navigate(`/products/${productId}`)}
                    >
                      Không có hình ảnh
                    </div>
                  )}
                </div>

                {/* INFO */}

                <div className="favorite-card-info">
                  <div className="favorite-card-category">
                    {product.category?.name || "Sản phẩm"}
                  </div>

                  <h3 onClick={() => navigate(`/products/${productId}`)}>
                    {product.name || "Sản phẩm"}
                  </h3>

                  <div className="favorite-card-bottom">
                    <strong>
                      {Number(product.price || 0).toLocaleString("vi-VN")}₫
                    </strong>

                    <button
                      type="button"
                      onClick={() => navigate(`/products/${productId}`)}
                    >
                      Xem sản phẩm
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Favorites;
