import "../../styles/product-detail/product-gallery.css";

const API_URL = "http://localhost:4000";

function ProductGallery({
  images = [],
  selectedImage,
  onSelectImage,
  productName,
}) {
  const imageList = images || [];

  const mainImage =
    selectedImage ||
    imageList.find((image) => image.is_primary) ||
    imageList[0];

  if (!mainImage) {
    return (
      <div className="product-gallery">
        <div className="product-gallery-main empty">Không có hình ảnh</div>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      <div className="product-gallery-thumbnails">
        {imageList.map((image) => (
          <button
            key={image.id}
            type="button"
            className={
              mainImage.id === image.id
                ? "product-gallery-thumbnail active"
                : "product-gallery-thumbnail"
            }
            onClick={() => onSelectImage(image)}
          >
            <img src={`${API_URL}${image.image_url}`} alt={productName} />
          </button>
        ))}
      </div>

      <div className="product-gallery-main">
        <img src={`${API_URL}${mainImage.image_url}`} alt={productName} />
      </div>
    </div>
  );
}

export default ProductGallery;
