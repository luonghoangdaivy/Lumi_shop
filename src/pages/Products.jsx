import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import { getProducts } from "../api/product.api";

import "../styles/products/products.css";

const API_URL = "http://localhost:4000";

function Products() {
  const navigate = useNavigate();

  // ================================
  // PRODUCTS
  // ================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ================================
  // SEARCH
  // ================================

  const [search, setSearch] = useState("");

  // ================================
  // FILTER
  // ================================

  const [selectedCategories, setSelectedCategories] = useState([]);

  const [selectedBrands, setSelectedBrands] = useState([]);

  const [selectedPrices, setSelectedPrices] = useState([]);

  const [selectedColors, setSelectedColors] = useState([]);

  const [selectedSizes, setSelectedSizes] = useState([]);

  // ================================
  // SORT
  // ================================

  const [sortBy, setSortBy] = useState("newest");

  // ================================
  // PAGINATION
  // ================================

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 9;

  // ================================
  // GET PRODUCTS
  // ================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await getProducts();

        console.log("Products API:", response);

        setProducts(response?.data || []);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);

        setError(
          error.response?.data?.message || "Không thể tải danh sách sản phẩm",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ================================
  // GET FILTER DATA
  // ================================

  const categories = useMemo(() => {
    return [
      ...new Set(
        products.map((product) => product.category?.name).filter(Boolean),
      ),
    ];
  }, [products]);

  const brands = ["Nike", "Adidas", "Zara", "Uniqlo", "Khác"];

  const colors = ["Đỏ", "Be", "Xanh", "Trắng", "Nâu", "Đen"];

  const sizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

  // ================================
  // CHECKBOX HANDLER
  // ================================

  const toggleFilter = (value, currentValues, setValues) => {
    if (currentValues.includes(value)) {
      setValues(currentValues.filter((item) => item !== value));
    } else {
      setValues([...currentValues, value]);
    }

    setCurrentPage(1);
  };

  // ================================
  // FILTER PRODUCTS
  // ================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // SEARCH
    if (search.trim()) {
      const keyword = search.toLowerCase();

      result = result.filter((product) =>
        product.name?.toLowerCase().includes(keyword),
      );
    }

    // CATEGORY
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category?.name),
      );
    }

    // BRAND
    if (selectedBrands.length > 0) {
      result = result.filter((product) => {
        return selectedBrands.includes(product.brand || "Khác");
      });
    }

    // PRICE
    if (selectedPrices.length > 0) {
      result = result.filter((product) => {
        const price = Number(product.price) || 0;

        return selectedPrices.some((range) => {
          if (range === "under200") {
            return price < 200000;
          }

          if (range === "200-400") {
            return price >= 200000 && price <= 400000;
          }

          if (range === "400-600") {
            return price > 400000 && price <= 600000;
          }

          if (range === "over600") {
            return price > 600000;
          }

          return true;
        });
      });
    }

    // COLOR
    if (selectedColors.length > 0) {
      result = result.filter((product) => {
        return product.variants?.some((variant) =>
          selectedColors.includes(variant.color),
        );
      });
    }

    // SIZE
    if (selectedSizes.length > 0) {
      result = result.filter((product) => {
        return product.variants?.some((variant) =>
          selectedSizes.includes(variant.size),
        );
      });
    }

    // SORT
    if (sortBy === "price-asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortBy === "price-desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    }

    return result;
  }, [
    products,
    search,
    selectedCategories,
    selectedBrands,
    selectedPrices,
    selectedColors,
    selectedSizes,
    sortBy,
  ]);

  // ================================
  // PAGINATION
  // ================================

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  // ================================
  // RESET FILTER
  // ================================

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPrices([]);
    setSelectedColors([]);
    setSelectedSizes([]);

    setSearch("");

    setCurrentPage(1);
  };

  // ================================
  // IMAGE
  // ================================

  const getProductImage = (product) => {
    if (!product?.images?.length) {
      return null;
    }

    const primaryImage =
      product.images.find((image) => image.is_primary === true) ||
      product.images[0];

    return primaryImage?.image_url;
  };

  // ================================
  // PRICE
  // ================================

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN") + " ₫";
  };

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <>
        <Header />

        <main className="products-page">
          <div className="products-container">
            <div className="products-loading">Đang tải sản phẩm...</div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // ================================
  // ERROR
  // ================================

  if (error) {
    return (
      <>
        <Header />

        <main className="products-page">
          <div className="products-container">
            <div className="products-error">
              <p>{error}</p>

              <button type="button" onClick={() => window.location.reload()}>
                Thử lại
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // ================================
  // RENDER
  // ================================

  return (
    <>
      <Header />

      <main className="products-page">
        <div className="products-container">
          {/* =================================
              PAGE TITLE
          ================================= */}

          <div className="products-title">
            <h1>Tất cả sản phẩm</h1>

            <div className="products-breadcrumb">Trang chủ / Sản phẩm</div>
          </div>

          {/* =================================
              PRODUCT CONTENT
          ================================= */}

          <div className="products-layout">
            {/* =================================
                SIDEBAR
            ================================= */}

            <aside className="products-sidebar">
              {/* CATEGORY */}

              <div className="filter-group">
                <h3>
                  Danh mục
                  <span>−</span>
                </h3>

                <div className="filter-options">
                  {categories.map((category) => (
                    <label key={category}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() =>
                          toggleFilter(
                            category,
                            selectedCategories,
                            setSelectedCategories,
                          )
                        }
                      />

                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* BRAND */}

              <div className="filter-group">
                <h3>
                  Thương hiệu
                  <span>−</span>
                </h3>

                <div className="filter-options">
                  {brands.map((brand) => (
                    <label key={brand}>
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() =>
                          toggleFilter(brand, selectedBrands, setSelectedBrands)
                        }
                      />

                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* PRICE */}

              <div className="filter-group">
                <h3>
                  Khoảng giá
                  <span>−</span>
                </h3>

                <div className="filter-options">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedPrices.includes("under200")}
                      onChange={() =>
                        toggleFilter(
                          "under200",
                          selectedPrices,
                          setSelectedPrices,
                        )
                      }
                    />

                    <span>Dưới 200.000đ</span>
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={selectedPrices.includes("200-400")}
                      onChange={() =>
                        toggleFilter(
                          "200-400",
                          selectedPrices,
                          setSelectedPrices,
                        )
                      }
                    />

                    <span>200.000đ - 400.000đ</span>
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={selectedPrices.includes("400-600")}
                      onChange={() =>
                        toggleFilter(
                          "400-600",
                          selectedPrices,
                          setSelectedPrices,
                        )
                      }
                    />

                    <span>400.000đ - 600.000đ</span>
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={selectedPrices.includes("over600")}
                      onChange={() =>
                        toggleFilter(
                          "over600",
                          selectedPrices,
                          setSelectedPrices,
                        )
                      }
                    />

                    <span>Trên 600.000đ</span>
                  </label>
                </div>
              </div>

              {/* COLOR */}

              <div className="filter-group">
                <h3>
                  Màu sắc
                  <span>−</span>
                </h3>

                <div className="color-filter">
                  {colors.map((color, index) => (
                    <button
                      key={color}
                      type="button"
                      title={color}
                      className={`filter-color color-${index} ${
                        selectedColors.includes(color) ? "selected" : ""
                      }`}
                      onClick={() =>
                        toggleFilter(color, selectedColors, setSelectedColors)
                      }
                    />
                  ))}
                </div>
              </div>

              {/* SIZE */}

              <div className="filter-group">
                <h3>
                  Size
                  <span>−</span>
                </h3>

                <div className="size-filter">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={selectedSizes.includes(size) ? "selected" : ""}
                      onClick={() =>
                        toggleFilter(size, selectedSizes, setSelectedSizes)
                      }
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* FILTER BUTTON */}

              <button
                type="button"
                className="reset-filter-button"
                onClick={handleResetFilters}
              >
                LỌC
              </button>
            </aside>

            {/* =================================
                PRODUCTS AREA
            ================================= */}

            <section className="products-content">
              {/* SEARCH / SORT */}

              <div className="products-toolbar">
                <div className="product-search">
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);

                      setCurrentPage(1);
                    }}
                    placeholder="Tìm kiếm sản phẩm..."
                  />
                </div>

                <div className="product-sort">
                  <span>Sắp xếp</span>

                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    <option value="newest">Mới nhất</option>

                    <option value="price-asc">Giá thấp đến cao</option>

                    <option value="price-desc">Giá cao đến thấp</option>

                    <option value="name">Tên A-Z</option>
                  </select>
                </div>
              </div>

              {/* PRODUCT GRID */}

              {currentProducts.length === 0 ? (
                <div className="products-empty">
                  <h2>Không tìm thấy sản phẩm</h2>

                  <p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
                </div>
              ) : (
                <div className="products-grid">
                  {currentProducts.map((product) => {
                    const image = getProductImage(product);

                    return (
                      <article
                        key={product.id}
                        className="product-card"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        <div className="product-card-image">
                          {image ? (
                            <img
                              src={`${API_URL}${image}`}
                              alt={product.name}
                            />
                          ) : (
                            <div className="product-card-no-image">
                              Không có ảnh
                            </div>
                          )}
                        </div>

                        <div className="product-card-content">
                          <p className="product-card-category">
                            {product.category?.name || "Thời trang"}
                          </p>

                          <h2 className="product-card-name">{product.name}</h2>

                          <p className="product-card-price">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* PAGINATION */}

              {totalPages > 1 && (
                <div className="products-pagination">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    ‹
                  </button>

                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) => (
                      <button
                        key={index + 1}
                        type="button"
                        className={currentPage === index + 1 ? "active" : ""}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ),
                  )}

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    ›
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Products;
