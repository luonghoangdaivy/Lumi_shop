import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { getProducts, deleteProduct } from "../../api/product.api";
import "../../styles/admin/admin-products.css";
const API_URL = "http://localhost:4000";
export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getProducts();

      console.log("Dữ liệu API sản phẩm:", response.data);

      setProducts(response.data || []);
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
  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa sản phẩm "${product.name}" không?`,
    );
    if (!confirmed) return;
    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      alert("Xóa sản phẩm thành công!");
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
      alert(
        err.response?.data?.message ||
          "Không thể xóa sản phẩm. Vui lòng thử lại.",
      );
    }
  };
  const filteredProducts = products.filter((product) =>
    `${product.name || ""} ${product.slug || ""}`
      .toLowerCase()
      .includes(keyword.toLowerCase().trim()),
  );
  return (
    <div className="admin-products">
      {" "}
      <div className="admin-products__heading">
        {" "}
        <div>
          {" "}
          <h1>Quản lý sản phẩm</h1>{" "}
          <p>Quản lý danh sách sản phẩm của Lumi Shop.</p>{" "}
        </div>{" "}
        <Link to="/admin/products/create" className="admin-products__add">
          {" "}
          <Plus size={18} /> Thêm sản phẩm{" "}
        </Link>{" "}
      </div>{" "}
      <div className="admin-products__toolbar">
        {" "}
        <div className="admin-products__search">
          {" "}
          <Search size={18} />{" "}
          <input
            type="text"
            placeholder="Tìm theo tên hoặc slug..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />{" "}
        </div>{" "}
        <button
          type="button"
          className="admin-products__refresh"
          onClick={fetchProducts}
          disabled={loading}
        >
          {" "}
          <RefreshCw size={16} /> Làm mới{" "}
        </button>{" "}
      </div>{" "}
      <div className="admin-products__summary">
        {" "}
        Tổng số: <strong>{products.length}</strong> sản phẩm{" "}
        {keyword && (
          <span> · Tìm thấy {filteredProducts.length} kết quả</span>
        )}{" "}
      </div>{" "}
      {loading ? (
        <div className="admin-products__message"> Đang tải sản phẩm... </div>
      ) : error ? (
        <div className="admin-products__message admin-products__error">
          {" "}
          <p>{error}</p>{" "}
          <button type="button" onClick={fetchProducts}>
            {" "}
            Thử lại{" "}
          </button>{" "}
        </div>
      ) : (
        <div className="admin-products__table-wrapper">
          {" "}
          <table className="admin-products__table">
            {" "}
            <thead>
              {" "}
              <tr>
                {" "}
                <th>Sản phẩm</th> <th>Danh mục</th> <th>Giá</th>{" "}
                <th>Trạng thái</th> <th>Thao tác</th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody>
              {" "}
              {filteredProducts.length === 0 ? (
                <tr>
                  {" "}
                  <td colSpan="5" className="admin-products__empty">
                    {" "}
                    Không tìm thấy sản phẩm.{" "}
                  </td>{" "}
                </tr>
              ) : (
                filteredProducts.map((product) => {
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
                      {" "}
                      <td>
                        {" "}
                        <div className="admin-products__product">
                          {" "}
                          {imageUrl ? (
                            <img src={imageUrl} alt={product.name} />
                          ) : (
                            <div className="admin-products__no-image">
                              {" "}
                              No image{" "}
                            </div>
                          )}{" "}
                          <div>
                            {" "}
                            <strong>{product.name}</strong>{" "}
                            <small>{product.slug}</small>{" "}
                          </div>{" "}
                        </div>{" "}
                      </td>{" "}
                      <td> {product.category?.name || "Chưa phân loại"} </td>{" "}
                      <td className="admin-products__price">
                        {" "}
                        {Number(product.price || 0).toLocaleString(
                          "vi-VN",
                        )}{" "}
                        ₫{" "}
                      </td>{" "}
                      <td>
                        {" "}
                        <span
                          className={`admin-products__status ${product.status === "ACTIVE" ? "is-active" : "is-inactive"}`}
                        >
                          {" "}
                          {product.status === "ACTIVE"
                            ? "Đang bán"
                            : "Ngừng bán"}{" "}
                        </span>{" "}
                      </td>{" "}
                      <td>
                        {" "}
                        <div className="admin-products__actions">
                          {" "}
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="admin-products__action"
                            title="Sửa sản phẩm"
                          >
                            {" "}
                            <Pencil size={17} />{" "}
                          </Link>{" "}
                          <button
                            type="button"
                            className="admin-products__action is-delete"
                            title="Xóa sản phẩm"
                            onClick={() => handleDelete(product)}
                          >
                            {" "}
                            <Trash2 size={17} />{" "}
                          </button>{" "}
                        </div>{" "}
                      </td>{" "}
                    </tr>
                  );
                })
              )}{" "}
            </tbody>{" "}
          </table>{" "}
        </div>
      )}{" "}
    </div>
  );
}
