import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductFilter from "../components/products/ProductFilter";
import ProductGrid from "../components/products/ProductGrid";

import { getProducts } from "../api/product.api";

import "../styles/products/products.css";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const searchFromUrl = searchParams.get("search") || "";
  const categoryFromUrl = searchParams.get("category") || "all";

  const [searchValue, setSearchValue] = useState(searchFromUrl);

  const [category, setCategory] = useState(categoryFromUrl);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts();

        const productData = response?.data || [];

        setProducts(productData);
      } catch (error) {
        console.error("Get products error:", error);

        setError("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /*
   * Đồng bộ search trên URL
   * với state của component
   */
  useEffect(() => {
    setSearchValue(searchFromUrl);
  }, [searchFromUrl]);

  useEffect(() => {
    setCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  /*
   * Lọc sản phẩm
   */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    /*
     * Search
     */
    if (searchValue.trim()) {
      const keyword = searchValue.trim().toLowerCase();

      result = result.filter((product) => {
        const productName = product?.name?.toLowerCase() || "";

        const categoryName = product?.category?.name?.toLowerCase() || "";

        return productName.includes(keyword) || categoryName.includes(keyword);
      });
    }

    /*
     * Category
     */
    if (category !== "all") {
      result = result.filter((product) => {
        const categoryName = product?.category?.name?.toLowerCase() || "";

        return categoryName.includes(category);
      });
    }

    return result;
  }, [products, searchValue, category]);

  /*
   * Search
   */
  const handleSearchChange = (value) => {
    setSearchValue(value);

    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    setSearchParams(params);
  };

  /*
   * Category
   */
  const handleCategoryChange = (value) => {
    setCategory(value);

    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    setSearchParams(params);
  };

  return (
    <>
      <Header />

      <main className="products-page">
        <div className="container">
          {/* Breadcrumb */}
          <div className="products-breadcrumb">
            <span>Trang chủ</span>
            <span>/</span>
            <span>Sản phẩm</span>
          </div>

          {/* Heading */}
          <div className="products-heading">
            <h1>Sản phẩm</h1>

            <p>Khám phá những thiết kế mới nhất từ LUMI.</p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="products-status">Đang tải sản phẩm...</div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="products-status products-error">{error}</div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              <ProductFilter
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
                category={category}
                onCategoryChange={handleCategoryChange}
                productCount={filteredProducts.length}
              />

              <ProductGrid products={filteredProducts} />
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Products;
