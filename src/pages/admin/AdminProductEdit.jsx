import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import api from "../../api/axios";
import { getProductById, updateProduct } from "../../api/product.api";

import "../../styles/admin/admin-product-form.css";

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category_id: "",
    description: "",
    price: "",
    status: "ACTIVE",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productResponse, categoryResponse] = await Promise.all([
          getProductById(id),
          api.get("/categories"),
        ]);

        const product = productResponse.data?.data;

        if (!product) {
          throw new Error("Không tìm thấy sản phẩm.");
        }

        if (cancelled) return;

        setForm({
          name: product.name || "",
          slug: product.slug || "",
          category_id: String(product.category_id ?? ""),
          description: product.description || "",
          price: String(product.price ?? ""),
          status: product.status || "ACTIVE",
        });

        setCategories(categoryResponse.data?.data || []);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Không thể tải dữ liệu sản phẩm.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Vui lòng nhập tên sản phẩm.");
      return;
    }

    if (!form.slug.trim()) {
      setError("Vui lòng nhập slug sản phẩm.");
      return;
    }

    if (!form.category_id) {
      setError("Vui lòng chọn danh mục.");
      return;
    }

    const price = Number(form.price);

    if (form.price === "" || !Number.isFinite(price) || price < 0) {
      setError("Giá sản phẩm không hợp lệ.");
      return;
    }

    try {
      setSaving(true);

      // Trang này chỉ sửa thông tin cơ bản.
      // Không gửi variants hoặc images để tránh thay đổi chúng.
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        category_id: Number(form.category_id),
        description: form.description.trim(),
        price,
        status: form.status,
      };

      await updateProduct(id, payload);

      alert("Cập nhật sản phẩm thành công!");
      navigate("/admin/products");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Không thể cập nhật sản phẩm.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-product-form">Đang tải dữ liệu sản phẩm...</div>
    );
  }

  return (
    <div className="admin-product-form">
      <button
        type="button"
        className="product-form-back"
        onClick={() => navigate("/admin/products")}
      >
        <ArrowLeft size={18} />
        Quay lại danh sách
      </button>

      <div className="product-form-heading">
        <h1>Chỉnh sửa sản phẩm</h1>
        <p>Cập nhật thông tin sản phẩm trong Lumi Shop.</p>
      </div>

      <form className="product-form-card" onSubmit={handleSubmit}>
        {error && (
          <div className="product-form-error" role="alert">
            {error}
          </div>
        )}

        <h2>Thông tin sản phẩm</h2>

        <div className="product-form-grid">
          <div className="product-form-field">
            <label htmlFor="name">Tên sản phẩm *</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              disabled={saving}
            />
          </div>

          <div className="product-form-field">
            <label htmlFor="slug">Slug *</label>
            <input
              id="slug"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              disabled={saving}
            />
          </div>

          <div className="product-form-field">
            <label htmlFor="category_id">Danh mục *</label>
            <select
              id="category_id"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
              disabled={saving}
            >
              <option value="">Chọn danh mục</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="product-form-field">
            <label htmlFor="price">Giá bán (VNĐ) *</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="1"
              value={form.price}
              onChange={handleChange}
              required
              disabled={saving}
            />
          </div>

          <div className="product-form-field">
            <label htmlFor="status">Trạng thái</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              disabled={saving}
            >
              <option value="ACTIVE">Đang bán</option>
              <option value="INACTIVE">Ngừng bán</option>
            </select>
          </div>

          <div className="product-form-field product-form-field-full">
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={form.description}
              onChange={handleChange}
              disabled={saving}
            />
          </div>
        </div>

        <div className="product-form-footer">
          <button
            type="button"
            className="product-form-cancel"
            onClick={() => navigate("/admin/products")}
            disabled={saving}
          >
            Hủy
          </button>

          <button
            type="submit"
            className="product-form-submit"
            disabled={saving}
          >
            <Save size={18} />
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
