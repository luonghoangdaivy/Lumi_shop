import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2, X } from "lucide-react";

import api from "../../api/axios";
import { getProductById, updateProduct } from "../../api/product.api";

import "../../styles/admin/admin-product-form.css";

const API_URL = "http://localhost:4000";

const createEmptyVariant = () => ({
  color: "",
  size: "",
  stock: "0",
});

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${API_URL}${imageUrl}`;
};

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

  // Ảnh đã lưu trong database.
  const [existingImages, setExistingImages] = useState([]);

  // ID ảnh cũ được chọn làm ảnh chính.
  const [primaryExistingImageId, setPrimaryExistingImageId] = useState(null);

  // Ảnh mới: { file, preview }.
  const [images, setImages] = useState([]);

  // Index ảnh mới được chọn làm ảnh chính.
  const [primaryImageIndex, setPrimaryImageIndex] = useState(-1);

  // Các biến thể màu sắc, size, tồn kho.
  const [variants, setVariants] = useState([createEmptyVariant()]);

  // Tải sản phẩm và danh mục.
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

        const responseData = productResponse.data;

        const product =
          responseData?.data?.product ??
          responseData?.data ??
          responseData?.product ??
          responseData;

        if (!product || product.id == null || typeof product !== "object") {
          throw new Error(
            "Không tìm thấy sản phẩm hoặc dữ liệu API không hợp lệ.",
          );
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

        const categoryData = categoryResponse.data;

        setCategories(
          Array.isArray(categoryData?.data)
            ? categoryData.data
            : Array.isArray(categoryData)
              ? categoryData
              : [],
        );

        const savedImages = Array.isArray(product.images) ? product.images : [];

        setExistingImages(savedImages);

        const primaryImage = savedImages.find((image) => image.is_primary);

        setPrimaryExistingImageId(primaryImage?.id ?? null);

        setPrimaryImageIndex(-1);

        const savedVariants = Array.isArray(product.variants)
          ? product.variants
          : [];

        setVariants(
          savedVariants.length > 0
            ? savedVariants.map((variant) => ({
                color: variant.color || "",
                size: variant.size || "",
                stock: String(variant.stock ?? 0),
              }))
            : [createEmptyVariant()],
        );
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Không thể tải dữ liệu sản phẩm.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Thu hồi URL preview khi component bị hủy.
  useEffect(() => {
    return () => {
      images.forEach(({ preview }) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [images]);

  // Cập nhật thông tin cơ bản.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Chọn nhiều ảnh mới.
  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    const maxSize = 5 * 1024 * 1024;
    const validFiles = [];
    const errors = [];

    for (const file of selectedFiles) {
      if (!validTypes.includes(file.type)) {
        errors.push(`"${file.name}": chỉ chấp nhận JPG, PNG hoặc WEBP.`);
        continue;
      }

      if (file.size > maxSize) {
        errors.push(`"${file.name}": dung lượng vượt quá 5 MB.`);
        continue;
      }

      validFiles.push(file);
    }

    const remainingSlots = Math.max(
      0,
      10 - existingImages.length - images.length,
    );

    const acceptedFiles = validFiles.slice(0, remainingSlots);

    if (validFiles.length > remainingSlots) {
      errors.push("Mỗi sản phẩm chỉ được giữ tối đa 10 ảnh.");
    }

    if (errors.length > 0) {
      setError(errors.join(" "));
    } else {
      setError("");
    }

    if (acceptedFiles.length > 0) {
      setImages((prev) => [
        ...prev,
        ...acceptedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        })),
      ]);
    }

    // Cho phép chọn lại cùng một file.
    event.target.value = "";
  };

  // Xóa ảnh mới.
  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));

    setPrimaryImageIndex((current) => {
      if (current === index) {
        return existingImages.length > 0 ? -1 : 0;
      }

      if (current > index) {
        return current - 1;
      }

      return current;
    });
  };

  // Bỏ ảnh cũ khỏi danh sách giữ lại.
  const removeExistingImage = (imageId) => {
    const remainingImages = existingImages.filter(
      (image) => image.id !== imageId,
    );

    setExistingImages(remainingImages);

    if (primaryExistingImageId === imageId) {
      setPrimaryExistingImageId(null);
      setPrimaryImageIndex(images.length > 0 ? 0 : -1);
    }
  };

  // Chọn ảnh cũ làm ảnh chính.
  const selectExistingPrimary = (imageId) => {
    setPrimaryExistingImageId(imageId);
    setPrimaryImageIndex(-1);
  };

  // Chọn ảnh mới làm ảnh chính.
  const selectNewPrimary = (index) => {
    setPrimaryImageIndex(index);
    setPrimaryExistingImageId(null);
  };

  // Cập nhật biến thể.
  const updateVariant = (index, field, value) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant,
      ),
    );
  };

  // Thêm biến thể.
  const addVariant = () => {
    setVariants((prev) => [...prev, createEmptyVariant()]);
  };

  // Xóa biến thể.
  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const name = form.name.trim();
    const slug = form.slug.trim();
    const price = Number(form.price);

    if (!name) {
      setError("Vui lòng nhập tên sản phẩm.");
      return;
    }

    if (!slug) {
      setError("Vui lòng nhập slug sản phẩm.");
      return;
    }

    if (!form.category_id) {
      setError("Vui lòng chọn danh mục.");
      return;
    }

    if (form.price === "" || !Number.isFinite(price) || price < 0) {
      setError("Giá sản phẩm không hợp lệ.");
      return;
    }

    if (existingImages.length + images.length > 10) {
      setError("Mỗi sản phẩm chỉ được có tối đa 10 ảnh.");
      return;
    }

    if (existingImages.length + images.length === 0) {
      setError(
        "Sản phẩm phải có ít nhất một ảnh. Hãy giữ lại ảnh cũ hoặc tải ảnh mới.",
      );
      return;
    }

    // Kiểm tra và chuẩn hóa biến thể.
    const normalizedVariants = [];

    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      const color = variant.color.trim();
      const size = variant.size.trim();
      const stock = Number(variant.stock);

      // Bỏ qua dòng biến thể chưa nhập.
      if (!color && !size && variant.stock === "0") {
        continue;
      }

      if (!color || !size) {
        setError(`Biến thể ${i + 1}: vui lòng nhập màu sắc và size.`);
        return;
      }

      if (variant.stock === "" || !Number.isInteger(stock) || stock < 0) {
        setError(`Biến thể ${i + 1}: tồn kho phải là số nguyên không âm.`);
        return;
      }

      normalizedVariants.push({
        color,
        size,
        stock,
      });
    }

    // Kiểm tra ảnh chính.
    const validOldPrimaryId = existingImages.some(
      (image) => image.id === primaryExistingImageId,
    )
      ? primaryExistingImageId
      : null;

    const hasSelectedNewPrimary =
      primaryExistingImageId === null &&
      primaryImageIndex >= 0 &&
      primaryImageIndex < images.length;

    const effectiveOldPrimaryId = hasSelectedNewPrimary
      ? null
      : validOldPrimaryId;

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("category_id", String(Number(form.category_id)));
      formData.append("description", form.description.trim());
      formData.append("price", String(price));
      formData.append("status", form.status);

      formData.append("variants", JSON.stringify(normalizedVariants));

      // Danh sách ID ảnh cũ muốn giữ lại.
      formData.append(
        "keepImageIds",
        JSON.stringify(existingImages.map((image) => image.id)),
      );

      if (effectiveOldPrimaryId !== null) {
        formData.append("primaryImageId", String(effectiveOldPrimaryId));
      }

      formData.append(
        "primaryImageIndex",
        hasSelectedNewPrimary ? String(primaryImageIndex) : "-1",
      );

      // Tên field "images" phải khớp với cấu hình Multer.
      images.forEach(({ file }) => {
        formData.append("images", file);
      });

      await updateProduct(id, formData);

      alert("Cập nhật sản phẩm thành công!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Lỗi cập nhật sản phẩm:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Không thể cập nhật sản phẩm. Vui lòng thử lại.",
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
        <p>Cập nhật thông tin, hình ảnh và biến thể sản phẩm.</p>
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

        <hr />

        {/* Quản lý hình ảnh */}
        <section className="product-form-section">
          <h2>Hình ảnh sản phẩm</h2>

          <p>
            Giữ ảnh cũ, xóa ảnh không cần thiết hoặc tải thêm ảnh mới. Tối đa 10
            ảnh, mỗi ảnh 5 MB.
          </p>

          <div className="product-form-field">
            <label htmlFor="images">Chọn ảnh mới</label>
            <input
              id="images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageChange}
              disabled={existingImages.length + images.length >= 10 || saving}
            />
          </div>

          {(existingImages.length > 0 || images.length > 0) && (
            <div className="product-form-image-grid">
              {existingImages.map((image) => (
                <div
                  className="product-form-image-item"
                  key={`old-${image.id}`}
                >
                  <img
                    src={getImageUrl(image.image_url)}
                    alt="Ảnh sản phẩm đã lưu"
                  />

                  <button
                    type="button"
                    className="product-form-image-remove"
                    onClick={() => removeExistingImage(image.id)}
                    aria-label="Bỏ ảnh cũ"
                    disabled={saving}
                  >
                    <X size={16} />
                  </button>

                  <label className="product-form-primary-image">
                    <input
                      type="radio"
                      name="primaryImageChoice"
                      checked={primaryExistingImageId === image.id}
                      onChange={() => selectExistingPrimary(image.id)}
                      disabled={saving}
                    />
                    Ảnh chính
                  </label>
                </div>
              ))}

              {images.map((image, index) => (
                <div className="product-form-image-item" key={image.preview}>
                  <img src={image.preview} alt={`Ảnh mới ${index + 1}`} />

                  <button
                    type="button"
                    className="product-form-image-remove"
                    onClick={() => removeNewImage(index)}
                    aria-label={`Xóa ảnh mới ${index + 1}`}
                    disabled={saving}
                  >
                    <X size={16} />
                  </button>

                  <label className="product-form-primary-image">
                    <input
                      type="radio"
                      name="primaryImageChoice"
                      checked={
                        primaryExistingImageId === null &&
                        primaryImageIndex === index &&
                        primaryImageIndex >= 0
                      }
                      onChange={() => selectNewPrimary(index)}
                      disabled={saving}
                    />
                    Ảnh chính
                  </label>
                </div>
              ))}
            </div>
          )}
        </section>

        <hr />

        {/* Quản lý biến thể */}
        <section className="product-form-section">
          <div className="product-form-section-heading">
            <div>
              <h2>Biến thể sản phẩm</h2>
              <p>Quản lý màu sắc, size và số lượng tồn kho.</p>
            </div>

            <button
              type="button"
              className="product-form-add-variant"
              onClick={addVariant}
              disabled={saving}
            >
              <Plus size={16} />
              Thêm biến thể
            </button>
          </div>

          {variants.map((variant, index) => (
            <div className="product-form-variant" key={index}>
              <div className="product-form-field">
                <label htmlFor={`color-${index}`}>Màu sắc</label>
                <input
                  id={`color-${index}`}
                  value={variant.color}
                  onChange={(event) =>
                    updateVariant(index, "color", event.target.value)
                  }
                  placeholder="Ví dụ: Đen"
                  disabled={saving}
                />
              </div>

              <div className="product-form-field">
                <label htmlFor={`size-${index}`}>Size</label>
                <input
                  id={`size-${index}`}
                  value={variant.size}
                  onChange={(event) =>
                    updateVariant(index, "size", event.target.value)
                  }
                  placeholder="Ví dụ: M"
                  disabled={saving}
                />
              </div>

              <div className="product-form-field">
                <label htmlFor={`stock-${index}`}>Tồn kho</label>
                <input
                  id={`stock-${index}`}
                  type="number"
                  min="0"
                  step="1"
                  value={variant.stock}
                  onChange={(event) =>
                    updateVariant(index, "stock", event.target.value)
                  }
                  disabled={saving}
                />
              </div>

              <button
                type="button"
                className="product-form-remove-variant"
                onClick={() => removeVariant(index)}
                aria-label={`Xóa biến thể ${index + 1}`}
                disabled={saving}
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </section>

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
