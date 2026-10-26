import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductFilter from "../components/products/ProductFilter";
import ProductGrid from "../components/products/ProductGrid";

import { getProducts } from "../api/product.api";

import "../styles/products/products.css";
import "../styles/products/product-filter.css";
import "../styles/products/product-grid.css";

const PRODUCTS_PER_PAGE = 12;

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL FILTER
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  // STATE
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [sortPrice, setSortPrice] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  // GET PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts();
        const data = response?.data || response;

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Get products error:", error);
        setError("Không thể tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // RESET PAGE WHEN FILTERS CHANGE
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, priceRange, sortPrice]);

  // CATEGORY CHANGE
  const handleCategoryChange = (newCategory) => {
    const params = new URLSearchParams(searchParams);

    if (newCategory) {
      params.set("category", newCategory);
    } else {
      params.delete("category");
    }

    setSearchParams(params);
  };

  // FILTER AND SORT PRODUCTS
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // SEARCH
    if (search.trim()) {
      const keyword = search.trim().toLowerCase();

      result = result.filter((product) =>
        product.name?.toLowerCase().includes(keyword),
      );
    }

    // CATEGORY
    if (category) {
      const categoryMap = {
        ao: "áo",
        quan: "quần",
        vay: "váy",
        "ao-khoac": "áo khoác",
      };

      const categoryName = categoryMap[category] || category;

      result = result.filter((product) =>
        product.category?.name
          ?.toLowerCase()
          .includes(categoryName.toLowerCase()),
      );
    }

    // PRICE RANGE
    result = result.filter((product) => {
      const price = Number(product.price || 0);

      switch (priceRange) {
        case "under-300":
          return price < 300000;

        case "300-500":
          return price >= 300000 && price <= 500000;

        case "500-1000":
          return price > 500000 && price <= 1000000;

        case "over-1000":
          return price > 1000000;

        default:
          return true;
      }
    });

    // SORT BY PRICE
    if (sortPrice === "asc") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortPrice === "desc") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    return result;
  }, [products, search, category, priceRange, sortPrice]);

  // PAGINATION
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    // Cuộn lên đầu danh sách sản phẩm khi chuyển trang
    document.querySelector(".products-header")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // RESET FILTER
  const handleResetFilter = () => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search);
    }

    setSearchParams(params);
    setPriceRange("all");
    setSortPrice("default");
    setCurrentPage(1);
  };

  return (
    <main className="products-page">
      <div className="container">
        {/* PAGE HEADER */}
        <div className="products-header">
          <div>
            <h1>Sản phẩm</h1>
            <p>Khám phá các sản phẩm của Lumi</p>
          </div>

          <span className="products-count">{totalProducts} sản phẩm</span>
        </div>

        {/* FILTER */}
        <ProductFilter
          category={category}
          onCategoryChange={handleCategoryChange}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          onReset={handleResetFilter}
        />

        {/* SORT */}
        <div className="products-toolbar">
          <label htmlFor="sort-price">Sắp xếp theo giá:</label>

          <select
            id="sort-price"
            value={sortPrice}
            onChange={(event) => setSortPrice(event.target.value)}
          >
            <option value="default">Mặc định</option>
            <option value="asc">Giá: Thấp đến cao</option>
            <option value="desc">Giá: Cao đến thấp</option>
          </select>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="products-state">
            <p>Đang tải sản phẩm...</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="products-state products-state-error">
            <p>{error}</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && totalProducts === 0 && (
          <div className="products-state">
            <h3>Không tìm thấy sản phẩm</h3>
            <p>Thử thay đổi danh mục hoặc khoảng giá.</p>

            <button
              type="button"
              className="products-reset-button"
              onClick={handleResetFilter}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* PRODUCT GRID */}
        {!loading && !error && totalProducts > 0 && (
          <>
            <ProductGrid products={paginatedProducts} />

            {/* PAGINATION */}
            {totalPages > 1 && (
              <nav
                className="products-pagination"
                aria-label="Phân trang sản phẩm"
              >
                <button
                  type="button"
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Trước
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`pagination-button ${
                      currentPage === page ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Tiếp
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default Products;
