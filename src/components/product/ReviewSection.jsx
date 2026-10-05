import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import { createReview, getProductReviews } from "../../api/review.api";

import Button from "../common/Button";

import "../../styles/product-detail/review-section.css";

function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const response = await getProductReviews(productId);

      setReviews(response?.data || response?.reviews || []);
    } catch (error) {
      console.error("Get reviews error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!productId) return;

    fetchReviews();
  }, [productId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!comment.trim()) {
      setError("Vui lòng nhập nội dung đánh giá.");

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await createReview(productId, {
        rating,
        comment: comment.trim(),
      });

      setComment("");
      setRating(5);

      await fetchReviews();
    } catch (error) {
      console.error("Create review error:", error);

      setError(error.response?.data?.message || "Không thể gửi đánh giá.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="review-section">
      <div className="review-section-header">
        <h2>Đánh giá sản phẩm</h2>

        <span>{reviews.length} đánh giá</span>
      </div>

      {/* Form */}

      <form className="review-form" onSubmit={handleSubmit}>
        <h3>Viết đánh giá</h3>

        <div className="review-rating-input">
          <span>Đánh giá:</span>

          <div className="review-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                aria-label={`${star} sao`}
              >
                <Star
                  size={20}
                  fill={star <= rating ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Chia sẻ cảm nhận của bạn..."
          rows={5}
        />

        {error && <p className="review-error">{error}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Đang gửi..." : "Gửi đánh giá"}
        </Button>
      </form>

      {/* Reviews */}

      <div className="review-list">
        {loading ? (
          <p className="text-muted">Đang tải đánh giá...</p>
        ) : reviews.length === 0 ? (
          <p className="text-muted">Chưa có đánh giá nào.</p>
        ) : (
          reviews.map((review) => (
            <article className="review-item" key={review.id}>
              <div className="review-item-header">
                <strong>
                  {review.user?.name || review.user?.username || "Khách hàng"}
                </strong>

                <div className="review-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={15}
                      fill={
                        star <= Number(review.rating) ? "currentColor" : "none"
                      }
                    />
                  ))}
                </div>
              </div>

              <p className="review-comment">{review.comment}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default ReviewSection;
