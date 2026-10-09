import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  FolderOpen,
} from "lucide-react";

import { getCategories, deleteCategory } from "../../api/category.api";

import "../../styles/admin/admin-categories.css";

export default function AdminCategories() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  // Lấy danh sách danh mục từ API
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCategories();

      // Hỗ trợ các dạng response phổ biến
      const result = response.data;
      const data = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.categories)
            ? result.categories
            : null;

      if (!data) {
        throw new Error("API không trả về danh sách danh mục hợp lệ.");
      }

      setCategories(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Không thể tải danh sách danh mục.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Tìm kiếm theo tên hoặc slug
  const filteredCategories = useMemo(() => {
    const searchValue = keyword.trim().toLowerCase();

    if (!searchValue) return categories;

    return categories.filter((category) => {
      const name = category.name?.toLowerCase() || "";
      const slug = category.slug?.toLowerCase() || "";

      return name.includes(searchValue) || slug.includes(searchValue);
    });
  }, [categories, keyword]);

  // Xóa danh mục
  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa danh mục "${category.name}" không?`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(category.id);
      setError("");

      await deleteCategory(category.id);

      setCategories((current) =>
        current.filter((item) => item.id !== category.id),
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể xóa danh mục. Hãy kiểm tra sản phẩm đang sử dụng danh mục này.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-categories">
      <div className="admin-categories-header">
        <div>
          <h1>Danh mục sản phẩm</h1>
          <p>Quản lý các danh mục sản phẩm của cửa hàng Lumi.</p>
        </div>

        <button
          type="button"
          className="category-primary-btn"
          onClick={() => navigate("/admin/categories/create")}
        >
          <Plus size={18} />
          Thêm danh mục
        </button>
      </div>

      <div className="category-toolbar">
        <div className="category-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc slug danh mục..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />

          {keyword && (
            <button
              type="button"
              onClick={() => setKeyword("")}
              aria-label="Xóa từ khóa tìm kiếm"
            >
              ×
            </button>
          )}
        </div>

        <button
          type="button"
          className="category-refresh-btn"
          onClick={fetchCategories}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "category-spinning" : ""} />
          Làm mới
        </button>
      </div>

      {error && (
        <div className="category-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={fetchCategories}>
            Thử lại
          </button>
        </div>
      )}

      <div className="category-table-card">
        <div className="category-table-wrapper">
          <table className="category-table">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>ID</th>
                <th>Tên danh mục</th>
                <th>Slug</th>
                <th style={{ width: "150px" }}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4}>
                    <div className="category-state">
                      Đang tải danh sách danh mục...
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="category-state">
                      <FolderOpen size={36} />
                      <strong>
                        {keyword
                          ? "Không tìm thấy danh mục"
                          : "Chưa có danh mục nào"}
                      </strong>
                      <span>
                        {keyword
                          ? "Thử nhập từ khóa khác."
                          : "Hãy thêm danh mục đầu tiên của cửa hàng."}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td>#{category.id}</td>

                    <td>
                      <span className="category-name">{category.name}</span>
                    </td>

                    <td>
                      <span className="category-slug">{category.slug}</span>
                    </td>

                    <td>
                      <div className="category-actions">
                        <button
                          type="button"
                          className="category-edit-btn"
                          title="Sửa danh mục"
                          aria-label={`Sửa ${category.name}`}
                          onClick={() =>
                            navigate(`/admin/categories/edit/${category.id}`)
                          }
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="category-delete-btn"
                          title="Xóa danh mục"
                          aria-label={`Xóa ${category.name}`}
                          disabled={deletingId === category.id}
                          onClick={() => handleDelete(category)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && (
          <div className="category-footer">
            <span>
              Hiển thị {filteredCategories.length} / {categories.length} danh
              mục
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
