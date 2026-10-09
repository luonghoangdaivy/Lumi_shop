import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2, X } from "lucide-react";

import api from "../../api/axios";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../api/product.api";
import "../../styles/admin/admin-product-form.css";

const API_URL = "http://localhost:4000";

const createSlug = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

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

export default function AdminProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category_id: "",
    description: "",
    price: "",
    status: "ACTIVE",
  });

  // Ảnh đã lưu trong database.
  const [existingImages, setExistingImages] = useState([]);

  // ID ảnh cũ được chọn làm ảnh chính.
  const [primaryExistingImageId, setPrimaryExistingImageId] = useState(null);

  // File ảnh mới: { file, preview }.
  const [images, setImages] = useState([]);

  // Index ảnh mới được chọn làm ảnh chính.
  // -1 nghĩa là đang chọn ảnh cũ hoặc chưa chọn ảnh mới.
  const [primaryImageIndex, setPrimaryImageIndex] = useState(-1);

  const [variants, setVariants] = useState([createEmptyVariant()]);

  // Tải danh mục.
  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");

        if (!cancelled) {
          setCategories(response.data?.data || []);
        }
      } catch (err) {
        console.error("Lỗi lấy danh mục:", err);

        if (!cancelled) {
          setError(err.response?.data?.message || "Không thể tải danh mục.");
        }
      } finally {
        if (!cancelled) {
          setLoadingCategories(false);
        }
      }
    };

    fetchCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  // Tải thông tin sản phẩm khi ở chế độ sửa.
  useEffect(() => {
    if (!isEditing) {
      setLoadingProduct(false);
      return;
    }

    let cancelled = false;

    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        setError("");

        const response = await getProductById(id);
        const product = response.data?.data;

        if (!product) {
          throw new Error("Không tìm thấy dữ liệu sản phẩm.");
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

        const savedImages = product.images || [];
        setExistingImages(savedImages);

        const primaryImage = savedImages.find((image) => image.is_primary);

        setPrimaryExistingImageId(primaryImage?.id ?? null);
        setPrimaryImageIndex(-1);

        setVariants(
          product.variants?.length
            ? product.variants.map((variant) => ({
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
              "Không thể tải sản phẩm.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingProduct(false);
        }
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id, isEditing]);

  // Thu hồi URL preview khi ảnh mới bị loại khỏi danh sách
  // hoặc component bị hủy.
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [images]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name" ? { slug: createSlug(value) } : {}),
    }));
  };

  // Chọn nhiều ảnh mới.
  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    setError("");

    const validFiles = [];

    for (const file of selectedFiles) {
      if (!validTypes.includes(file.type)) {
        setError("Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP.");
        continue;
      }

      if (file.size > maxSize) {
        setError(`Ảnh "${file.name}" vượt quá giới hạn 5 MB.`);
        continue;
      }

      validFiles.push(file);
    }

    setImages((prev) => {
      const remainingSlots = Math.max(
        0,
        10 - existingImages.length - prev.length,
      );

      const acceptedFiles = validFiles.slice(0, remainingSlots);

      if (validFiles.length > remainingSlots) {
        setError("Mỗi sản phẩm chỉ được giữ tối đa 10 ảnh.");
      }

      return [
        ...prev,
        ...acceptedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        })),
      ];
    });

    // Cho phép chọn lại cùng một file.
    event.target.value = "";
  };

  // Xóa ảnh mới.
  const removeNewImage = (index) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);

      setPrimaryImageIndex((current) => {
        if (next.length === 0) return -1;

        if (current === index) {
          // Nếu xóa ảnh mới đang là ảnh chính,
          // ưu tiên ảnh cũ nếu còn; nếu không chọn ảnh mới đầu tiên.
          if (existingImages.length > 0) return -1;
          return 0;
        }

        if (current > index) return current - 1;

        return current;
      });

      return next;
    });
  };

  // Xóa ảnh cũ khỏi danh sách giữ lại.
  const removeExistingImage = (imageId) => {
    setExistingImages((prev) => prev.filter((image) => image.id !== imageId));

    if (primaryExistingImageId === imageId) {
      setPrimaryExistingImageId(null);

      // Nếu có ảnh mới, chọn ảnh mới đầu tiên làm ảnh chính.
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

  const updateVariant = (index, field, value) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant,
      ),
    );
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, createEmptyVariant()]);
  };

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

    if (!form.category_id) {
      setError("Vui lòng chọn danh mục.");
      return;
    }

    if (!slug) {
      setError("Slug sản phẩm không hợp lệ.");
      return;
    }

    if (form.price === "" || !Number.isFinite(price) || price < 0) {
      setError("Vui lòng nhập giá hợp lệ.");
      return;
    }

    if (existingImages.length + images.length > 10) {
      setError("Mỗi sản phẩm chỉ được có tối đa 10 ảnh.");
      return;
    }

    if (existingImages.length + images.length === 0) {
      setError("Vui lòng giữ lại hoặc tải lên ít nhất một ảnh.");
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

    // Xác định ảnh chính đang được chọn.
    const validOldPrimaryId = existingImages.some(
      (image) => image.id === primaryExistingImageId,
    )
      ? primaryExistingImageId
      : null;

    const hasSelectedNewPrimary =
      primaryExistingImageId === null &&
      primaryImageIndex >= 0 &&
      primaryImageIndex < images.length;

    // Nếu ảnh cũ vẫn được chọn thì giữ ảnh cũ làm ảnh chính.
    // Nếu không, chọn ảnh mới theo index hợp lệ.
    // Nếu không có lựa chọn hợp lệ, backend sẽ dùng ảnh dự phòng.
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

      // Backend giữ lại các ảnh cũ nằm trong danh sách này.
      formData.append(
        "keepImageIds",
        JSON.stringify(existingImages.map((image) => image.id)),
      );

      if (effectiveOldPrimaryId !== null) {
        formData.append("primaryImageId", String(effectiveOldPrimaryId));
      }

      // -1 nghĩa là không yêu cầu chọn ảnh mới làm ảnh chính.
      formData.append(
        "primaryImageIndex",
        hasSelectedNewPrimary ? String(primaryImageIndex) : "-1",
      );

      images.forEach(({ file }) => {
        formData.append("images", file);
      });

      if (isEditing) {
        await updateProduct(id, formData);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        await createProduct(formData);
        alert("Thêm sản phẩm thành công!");
      }

      navigate("/admin/products");
    } catch (err) {
      console.error("Lỗi lưu sản phẩm:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Không thể lưu sản phẩm. Vui lòng thử lại.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loadingProduct) {
    return <div className="admin-product-form">Đang tải sản phẩm...</div>;
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
        <h1>{isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}</h1>
        <p>
          {isEditing
            ? "Chỉnh sửa thông tin, hình ảnh và biến thể sản phẩm."
            : "Nhập thông tin, hình ảnh và các biến thể của sản phẩm."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="product-form-card">
        {error && (
          <div className="product-form-error" role="alert">
            {error}
          </div>
        )}

        <h2>Thông tin cơ bản</h2>

        <div className="product-form-grid">
          <div className="product-form-field">
            <label htmlFor="name">Tên sản phẩm *</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ví dụ: Áo thun oversize"
              maxLength={255}
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
              placeholder="ao-thun-oversize"
              required
              disabled={saving}
            />
            <small>Được tạo tự động từ tên sản phẩm.</small>
          </div>

          <div className="product-form-field">
            <label htmlFor="category_id">Danh mục *</label>
            <select
              id="category_id"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              disabled={loadingCategories || saving}
              required
            >
              <option value="">
                {loadingCategories ? "Đang tải danh mục..." : "Chọn danh mục"}
              </option>

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
              placeholder="Ví dụ: 250000"
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
            <label htmlFor="description">Mô tả sản phẩm</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Nhập mô tả sản phẩm..."
              rows={5}
              disabled={saving}
            />
          </div>
        </div>

        <hr />

        <section className="product-form-section">
          <h2>Hình ảnh sản phẩm</h2>
          <p>
            Giữ ảnh cũ hoặc xóa ảnh không cần thiết. Có thể tải thêm ảnh mới;
            tối đa 10 ảnh, mỗi ảnh 5 MB.
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

        <section className="product-form-section">
          <div className="product-form-section-heading">
            <div>
              <h2>Biến thể sản phẩm</h2>
              <p>Thêm từng tổ hợp màu sắc, size và số lượng tồn kho.</p>
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
                  onChange={(e) =>
                    updateVariant(index, "color", e.target.value)
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
                  onChange={(e) => updateVariant(index, "size", e.target.value)}
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
                  onChange={(e) =>
                    updateVariant(index, "stock", e.target.value)
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
            disabled={saving || loadingCategories}
          >
            <Save size={18} />
            {saving
              ? "Đang lưu..."
              : isEditing
                ? "Lưu thay đổi"
                : "Lưu sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
}
