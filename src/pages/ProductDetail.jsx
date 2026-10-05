import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductDescription from "../components/product/ProductDescription";
import ReviewSection from "../components/product/ReviewSection";
import RelatedProducts from "../components/product/RelatedProducts";

import { getProductById, getProducts } from "../api/product.api";

import { addToCart } from "../api/cart.api";

import "../styles/product-detail/product-detail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedColor, setSelectedColor] = useState("");

  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProductById(id);

        const productData = response?.data || response;

        setProduct(productData);

        const primaryImage =
          productData?.images?.find((image) => image.is_primary) ||
          productData?.images?.[0];

        setSelectedImage(primaryImage || null);

        const firstVariant = productData?.variants?.[0];

        setSelectedColor(firstVariant?.color || "");

        setSelectedSize(firstVariant?.size || "");
      } catch (error) {
        console.error("Get product detail error:", error);

        setError("Không thể tải thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /*
   * Load products for Related Products
   */
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await getProducts();

        setRelatedProducts(response?.data || []);
      } catch (error) {
        console.error("Get related products error:", error);
      }
    };

    fetchRelatedProducts();
  }, []);

  /*
   * Colors
   */
  const colors = [
    ...new Set(
      product?.variants?.map((variant) => variant.color).filter(Boolean) || [],
    ),
  ];

  /*
   * Sizes theo màu
   */
  const sizes = [
    ...new Set(
      product?.variants
        ?.filter((variant) => variant.color === selectedColor)
        .map((variant) => variant.size)
        .filter(Boolean) || [],
    ),
  ];

  /*
   * Selected variant
   */
  const selectedVariant = product?.variants?.find(
    (variant) =>
      variant.color === selectedColor && variant.size === selectedSize,
  );

  /*
   * Change color
   */
  const handleColorChange = (color) => {
    setSelectedColor(color);

    const firstVariant = product?.variants?.find(
      (variant) => variant.color === color,
    );

    setSelectedSize(firstVariant?.size || "");
  };

  /*
   * Add cart
   */
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert("Vui lòng chọn màu sắc và kích thước.");

      return;
    }

    try {
      await addToCart(selectedVariant.id, 1);

      alert("Đã thêm sản phẩm vào giỏ hàng!");

      navigate("/cart");
    } catch (error) {
      console.error("Add to cart error:", error);

      alert(
        error.response?.data?.message ||
          "Không thể thêm sản phẩm vào giỏ hàng.",
      );
    }
  };

  if (loading) {
    return (
      <>
        <Header />

        <main className="product-detail-page">
          <div className="container product-detail-status">
            Đang tải sản phẩm...
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />

        <main className="product-detail-page">
          <div className="container product-detail-status product-detail-error">
            {error || "Không tìm thấy sản phẩm."}
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="product-detail-page">
        <div className="container">
          {/* Breadcrumb */}

          <div className="product-detail-breadcrumb">
            <span>Trang chủ</span>
            <span>/</span>
            <span>Sản phẩm</span>
            <span>/</span>
            <span>{product.name}</span>
          </div>

          {/* Main */}

          <section className="product-detail-main">
            <ProductGallery
              images={product.images}
              selectedImage={selectedImage}
              onSelectImage={setSelectedImage}
              productName={product.name}
            />

            <ProductInfo
              product={product}
              colors={colors}
              sizes={sizes}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              selectedVariant={selectedVariant}
              onColorChange={handleColorChange}
              onSizeChange={setSelectedSize}
              onAddToCart={handleAddToCart}
            />
          </section>

          {/* Description */}

          <ProductDescription description={product.description} />

          {/* Reviews */}

          <ReviewSection productId={product.id} />

          {/* Related */}

          <RelatedProducts
            products={relatedProducts}
            currentProductId={product.id}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ProductDetail;
