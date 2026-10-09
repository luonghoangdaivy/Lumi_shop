import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductFilter from "../components/products/ProductFilter";
import ProductGrid from "../components/products/ProductGrid";

import { getProducts } from "../api/product.api";

import "../styles/products/products.css";
import "../styles/products/product-filter.css";
import "../styles/products/product-grid.css";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  // =========================
  // URL FILTER
  // =========================

  const search = searchParams.get("search") || "";

  const category = searchParams.get("category") || "";

  // =========================
  // STATE
  // =========================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [priceRange, setPriceRange] = useState("all");

  // =========================
  // GET PRODUCTS
  // =========================

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

  // =========================
  // CATEGORY CHANGE
  // =========================

  const handleCategoryChange = (newCategory) => {
    const params = new URLSearchParams(searchParams);

    if (newCategory) {
      params.set("category", newCategory);
    } else {
      params.delete("category");
    }

    setSearchParams(params);
  };

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // =========================
    // SEARCH
    // =========================

    if (search.trim()) {
      const keyword = search.trim().toLowerCase();

      result = result.filter((product) =>
        product.name?.toLowerCase().includes(keyword),
      );
    }

    // =========================
    // CATEGORY
    // =========================

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

    // =========================
    // PRICE
    // =========================

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

    return result;
  }, [products, search, category, priceRange]);

  // =========================
  // RESET FILTER
  // =========================

  const handleResetFilter = () => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search);
    }

    setSearchParams(params);

    setPriceRange("all");
  };

  return (
    <>
      <main className="products-page">
        <div className="container">
          {/* PAGE HEADER */}
          <div className="products-header">
            <div>
              <h1>Sản phẩm</h1>

              <p>Khám phá các sản phẩm của Lumi</p>
            </div>

            <span className="products-count">
              {filteredProducts.length} sản phẩm
            </span>
          </div>

          {/* FILTER */}
          <ProductFilter
            category={category}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            onReset={handleResetFilter}
          />

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
          {!loading && !error && filteredProducts.length === 0 && (
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
          {!loading && !error && filteredProducts.length > 0 && (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </main>
    </>
  );
}

export default Products;
