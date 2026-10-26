import { Link } from "react-router-dom";

import "../../styles/home/category-section.css";

const categories = [
  {
    id: 1,
    name: "Áo",
    slug: "ao",
    description: "Phong cách hằng ngày",
  },
  {
    id: 2,
    name: "Quần",
    slug: "quan",
    description: "Thoải mái & hiện đại",
  },
  {
    id: 3,
    name: "Váy",
    slug: "vay",
    description: "Thanh lịch & nữ tính",
  },
  {
    id: 4,
    name: "Áo khoác",
    slug: "ao-khoac",
    description: "Phong cách cá tính",
  },
];

function CategorySection() {
  return (
    <section className="home-section category-section">
      <div className="home-section-container">
        <div className="category-heading">
          <div>
            <span className="category-eyebrow">SHOP BY CATEGORY</span>

            <h2>Khám phá theo danh mục</h2>
          </div>

          <p>Tìm kiếm những sản phẩm phù hợp với phong cách của bạn.</p>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className="category-card"
            >
              <div className="category-card-content">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>

              <span className="category-card-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;
