import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import {
  getCategoryById,
  createCategory,
  updateCategory,
} from "../../api/category.api";

import "../../styles/admin/admin-categories.css";

export default function AdminCategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Tạo slug từ tên danh mục
  const generateSlug = (value) => {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // Nếu có id thì lấy dữ liệu danh mục cần sửa
  useEffect(() => {
    if (!isEditing) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCategoryById(id);
        const category = response.data?.data ?? response.data;

        if (!category || !category.id) {
          throw new Error("Không tìm thấy danh mục.");
        }

        setName(category.name ?? "");
        setSlug(category.slug ?? "");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Không thể tải danh mục.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, isEditing]);

  const handleNameChange = (value) => {
    setName(value);

    // Tự tạo slug theo tên khi thêm mới.
    // Khi sửa, không tự ghi đè slug đã có.
    if (!isEditing) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !slug.trim()) {
      setError("Vui lòng nhập đầy đủ tên và slug danh mục.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: name.trim(),
        slug: slug.trim(),
      };

      if (isEditing) {
        await updateCategory(id, payload);
      } else {
        await createCategory(payload);
      }

      navigate("/admin/categories");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể lưu danh mục. Vui lòng kiểm tra lại.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-categories">
        <div className="category-state">Đang tải danh mục...</div>
      </div>
    );
  }

  return (
    <div className="admin-categories">
      <div className="admin-categories-header">
        <div>
          <h1>{isEditing ? "Chỉnh sửa danh mục" : "Thêm danh mục"}</h1>
          <p>
            {isEditing
              ? "Cập nhật thông tin danh mục sản phẩm."
              : "Tạo danh mục mới cho cửa hàng Lumi."}
          </p>
        </div>

        <button
          type="button"
          className="category-refresh-btn"
          onClick={() => navigate("/admin/categories")}
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>
      </div>

      <form className="category-form-card" onSubmit={handleSubmit}>
        {error && (
          <div className="category-error" role="alert">
            {error}
          </div>
        )}

        <div className="category-form-fields">
          <div className="category-form-field">
            <label htmlFor="category-name">Tên danh mục *</label>
            <input
              id="category-name"
              type="text"
              placeholder="Ví dụ: Áo thun"
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div className="category-form-field">
            <label htmlFor="category-slug">Slug *</label>
            <input
              id="category-slug"
              type="text"
              placeholder="Ví dụ: ao-thun"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              required
              maxLength={100}
            />
            <small>Slug dùng trong URL, nên viết thường và không dấu.</small>
          </div>
        </div>

        <div className="category-form-actions">
          <button
            type="button"
            className="category-refresh-btn"
            onClick={() => navigate("/admin/categories")}
          >
            Hủy
          </button>

          <button
            type="submit"
            className="category-primary-btn"
            disabled={saving}
          >
            <Save size={18} />
            {saving
              ? "Đang lưu..."
              : isEditing
                ? "Lưu thay đổi"
                : "Tạo danh mục"}
          </button>
        </div>
      </form>
    </div>
  );
}
