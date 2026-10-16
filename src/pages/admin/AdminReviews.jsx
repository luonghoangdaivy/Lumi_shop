import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Star,
  MessageSquareText,
  RefreshCw,
  Eye,
  X,
} from "lucide-react";
import api from "../../api/axios";
import "../../styles/admin/admin-reviews.css";

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime())
    ? "—"
    : parsedDate.toLocaleDateString("vi-VN");
};

function RatingStars({ rating }) {
  return (
    <span className="admin-reviews__stars" aria-label={`${rating} trên 5 sao`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={15}
          fill={star <= Number(rating) ? "currentColor" : "none"}
        />
      ))}
      <span>{rating}/5</span>
    </span>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/reviews/admin", {
        params: { search: search.trim(), rating },
      });

      const result = response.data;
      const list = Array.isArray(result) ? result : result.data;

      if (!Array.isArray(list)) {
        throw new Error("Dữ liệu đánh giá không hợp lệ.");
      }

      setReviews(list);
    } catch (err) {
      console.error("Load reviews error:", err);
      setReviews([]);
      setError(
        err.response?.data?.message ||
          "Không thể tải đánh giá. Hãy kiểm tra API và quyền Admin.",
      );
    } finally {
      setLoading(false);
    }
  }, [search, rating]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

  const fiveStarReviews = reviews.filter(
    (review) => Number(review.rating) === 5,
  ).length;

  return (
    <main className="admin-reviews">
      <header className="admin-reviews__header">
        <div>
          <span className="admin-reviews__eyebrow">QUẢN LÝ HỆ THỐNG</span>
          <h1>Đánh giá sản phẩm</h1>
          <p>Theo dõi phản hồi của khách hàng về sản phẩm Lumi Shop.</p>
        </div>

        <button
          type="button"
          className="admin-reviews__refresh"
          onClick={fetchReviews}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Làm mới
        </button>
      </header>

      <section className="admin-reviews__stats">
        <article>
          <div className="admin-reviews__stat-icon">
            <MessageSquareText size={22} />
          </div>
          <div>
            <span>Đánh giá tìm thấy</span>
            <strong>{reviews.length}</strong>
          </div>
        </article>

        <article>
          <div className="admin-reviews__stat-icon">
            <Star size={22} />
          </div>
          <div>
            <span>Điểm trung bình</span>
            <strong>{averageRating} / 5</strong>
          </div>
        </article>

        <article>
          <div className="admin-reviews__stat-icon">
            <Star size={22} />
          </div>
          <div>
            <span>Đánh giá 5 sao</span>
            <strong>{fiveStarReviews}</strong>
          </div>
        </article>
      </section>

      <section className="admin-reviews__panel">
        <div className="admin-reviews__panel-heading">
          <div>
            <h2>Danh sách đánh giá</h2>
            <p>Tìm theo khách hàng, sản phẩm hoặc nội dung phản hồi.</p>
          </div>
        </div>

        <div className="admin-reviews__filters">
          <label className="admin-reviews__search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm khách hàng, sản phẩm..."
              type="search"
            />
          </label>

          <select
            aria-label="Lọc theo số sao"
            value={rating}
            onChange={(event) => setRating(event.target.value)}
          >
            <option value="">Tất cả số sao</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
        </div>

        {error && (
          <div className="admin-reviews__error">
            <span>{error}</span>
            <button type="button" onClick={fetchReviews}>
              Thử lại
            </button>
          </div>
        )}

        <div className="admin-reviews__table-wrap">
          <table className="admin-reviews__table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Đánh giá</th>
                <th>Nội dung</th>
                <th>Ngày gửi</th>
                <th>Chi tiết</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="admin-reviews__empty">
                    <RefreshCw size={20} className="admin-reviews__spinner" />
                    Đang tải đánh giá...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="admin-reviews__empty">
                    Không thể hiển thị dữ liệu.
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="admin-reviews__empty">
                    Chưa có đánh giá phù hợp.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id}>
                    <td>
                      <div className="admin-reviews__customer">
                        <strong>{review.user?.name || "Người dùng"}</strong>
                        <span>{review.user?.email || "—"}</span>
                      </div>
                    </td>

                    <td className="admin-reviews__product">
                      {review.product?.name || `Sản phẩm #${review.product_id}`}
                    </td>

                    <td>
                      <RatingStars rating={review.rating} />
                    </td>

                    <td>
                      <p className="admin-reviews__comment">
                        {review.comment || "Không có nội dung"}
                      </p>
                    </td>

                    <td>{formatDate(review.createdAt || review.created_at)}</td>

                    <td>
                      <button
                        type="button"
                        className="admin-reviews__detail"
                        aria-label="Xem chi tiết đánh giá"
                        onClick={() => setSelectedReview(review)}
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="admin-reviews__footer">
          {loading ? 0 : reviews.length} đánh giá
        </footer>
      </section>

      {selectedReview && (
        <div
          className="admin-reviews__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedReview(null);
            }
          }}
        >
          <section
            className="admin-reviews__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-review-modal-title"
          >
            <header>
              <div>
                <span>CHI TIẾT PHẢN HỒI</span>
                <h2 id="admin-review-modal-title">
                  Đánh giá #{selectedReview.id}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setSelectedReview(null)}
              >
                <X size={20} />
              </button>
            </header>

            <div className="admin-reviews__modal-rating">
              <RatingStars rating={selectedReview.rating} />
            </div>

            <div className="admin-reviews__detail-block">
              <span>Khách hàng</span>
              <strong>{selectedReview.user?.name || "Người dùng"}</strong>
              <p>{selectedReview.user?.email || "—"}</p>
            </div>

            <div className="admin-reviews__detail-block">
              <span>Sản phẩm</span>
              <strong>
                {selectedReview.product?.name ||
                  `Sản phẩm #${selectedReview.product_id}`}
              </strong>
            </div>

            <div className="admin-reviews__detail-block">
              <span>Nội dung đánh giá</span>
              <p className="admin-reviews__full-comment">
                {selectedReview.comment || "Khách hàng không để lại nội dung."}
              </p>
            </div>

            <div className="admin-reviews__detail-block">
              <span>Ngày gửi</span>
              <strong>
                {formatDate(
                  selectedReview.createdAt || selectedReview.created_at,
                )}
              </strong>
            </div>

            <button
              type="button"
              className="admin-reviews__done"
              onClick={() => setSelectedReview(null)}
            >
              Đóng
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
