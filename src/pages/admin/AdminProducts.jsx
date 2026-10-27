import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, RefreshCw } from "lucide-react";

import { getProducts, deleteProduct } from "../../api/product.api";
import "../../styles/admin/admin-products.css";

const API_URL = "http://localhost:4000";
const ITEMS_PER_PAGE = 10;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts();

      console.log("Dữ liệu API sản phẩm:", response.data);

      const result = response?.data;
      const productList = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.products)
            ? result.products
            : [];

      setProducts(productList);
      setCurrentPage(1);
    } catch (err) {
      console.error("Lỗi lấy sản phẩm:", err);
      setError("Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Xóa sản phẩm
  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa sản phẩm "${product.name}" không?`,
    );

    if (!confirmed) return;

    try {
      await deleteProduct(product.id);

      setProducts((prev) =>
        prev.filter((item) => String(item.id) !== String(product.id)),
      );

      alert("Xóa sản phẩm thành công!");
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);

      alert(
        err.response?.data?.message ||
          "Không thể xóa sản phẩm. Vui lòng thử lại.",
      );
    }
  };

  // Tìm kiếm theo tên hoặc slug
  const filteredProducts = useMemo(() => {
    const search = keyword.toLowerCase().trim();

    return products.filter((product) =>
      `${product.name || ""} ${product.slug || ""}`
        .toLowerCase()
        .includes(search),
    );
  }, [products, keyword]);

  // Tính tổng số trang
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE),
  );

  // Giữ trang hiện tại hợp lệ khi số sản phẩm thay đổi
  useEffect(() => {
    setCurrentPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  // Chỉ hiển thị sản phẩm của trang hiện tại
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Khi tìm kiếm, quay về trang đầu
  const handleSearchChange = (value) => {
    setKeyword(value);
    setCurrentPage(1);
  };

  // Chuyển trang
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
  };

  return (
    <div className="admin-products">
      <div className="admin-products__heading">
        <div>
          <h1>Quản lý sản phẩm</h1>
          <p>Quản lý danh sách sản phẩm của Lumi Shop.</p>
        </div>

        <Link to="/admin/products/create" className="admin-products__add">
          <Plus size={18} />
          Thêm sản phẩm
        </Link>
      </div>

      <div className="admin-products__toolbar">
        <div className="admin-products__search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Tìm theo tên hoặc slug..."
            value={keyword}
            onChange={(event) => handleSearchChange(event.target.value)}
            aria-label="Tìm kiếm sản phẩm"
          />
        </div>

        <button
          type="button"
          className="admin-products__refresh"
          onClick={fetchProducts}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Làm mới
        </button>
      </div>

      <div className="admin-products__summary">
        Tổng số: <strong>{products.length}</strong> sản phẩm
        {keyword && <span> · Tìm thấy {filteredProducts.length} kết quả</span>}
      </div>

      {loading ? (
        <div className="admin-products__message">Đang tải sản phẩm...</div>
      ) : error ? (
        <div className="admin-products__message admin-products__error">
          <p>{error}</p>

          <button type="button" onClick={fetchProducts}>
            Thử lại
          </button>
        </div>
      ) : (
        <>
          <div className="admin-products__table-wrapper">
            <table className="admin-products__table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="admin-products__empty">
                      Không tìm thấy sản phẩm.
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product) => {
                    const primaryImage =
                      product.images?.find((image) => image.is_primary) ||
                      product.images?.[0];

                    const imageUrl = primaryImage?.image_url
                      ? primaryImage.image_url.startsWith("http")
                        ? primaryImage.image_url
                        : `${API_URL}${primaryImage.image_url}`
                      : "";

                    return (
                      <tr key={product.id}>
                        <td>
                          <div className="admin-products__product">
                            {imageUrl ? (
                              <img src={imageUrl} alt={product.name} />
                            ) : (
                              <div className="admin-products__no-image">
                                No image
                              </div>
                            )}

                            <div>
                              <strong>{product.name}</strong>
                              <small>{product.slug}</small>
                            </div>
                          </div>
                        </td>

                        <td>{product.category?.name || "Chưa phân loại"}</td>

                        <td className="admin-products__price">
                          {Number(product.price || 0).toLocaleString("vi-VN")} ₫
                        </td>

                        <td>
                          <span
                            className={`admin-products__status ${
                              product.status === "ACTIVE"
                                ? "is-active"
                                : "is-inactive"
                            }`}
                          >
                            {product.status === "ACTIVE"
                              ? "Đang bán"
                              : "Ngừng bán"}
                          </span>
                        </td>

                        <td>
                          <div className="admin-products__actions">
                            <Link
                              to={`/admin/products/edit/${product.id}`}
                              className="admin-products__action"
                              title="Sửa sản phẩm"
                              aria-label={`Sửa ${product.name}`}
                            >
                              <Pencil size={17} />
                            </Link>

                            <button
                              type="button"
                              className="admin-products__action is-delete"
                              title="Xóa sản phẩm"
                              aria-label={`Xóa ${product.name}`}
                              onClick={() => handleDelete(product)}
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {filteredProducts.length > 0 && (
            <div className="admin-products__pagination">
              <span className="admin-products__pagination-info">
                Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                {" – "}
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredProducts.length,
                )}
                {" / "}
                {filteredProducts.length} sản phẩm
              </span>

              <div className="admin-products__pagination-controls">
                <button
                  type="button"
                  className="admin-products__page-btn"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Trang trước
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    type="button"
                    key={page}
                    className={`admin-products__page-btn ${
                      currentPage === page ? "active" : ""
                    }`}
                    aria-label={`Trang ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  className="admin-products__page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Trang sau
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
