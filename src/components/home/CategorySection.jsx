import { Link } from "react-router-dom";
import { Shirt, ShoppingBag } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Áo",
    slug: "ao",
    icon: Shirt,
  },
  {
    id: 2,
    name: "Quần",
    slug: "quan",
    icon: Shirt,
  },
  {
    id: 3,
    name: "Váy",
    slug: "vay",
    icon: Shirt,
  },
  {
    id: 4,
    name: "Áo khoác",
    slug: "ao-khoac",
    icon: Shirt,
  },
  {
    id: 5,
    name: "Phụ kiện",
    slug: "phu-kien",
    icon: ShoppingBag,
  },
];

function CategorySection() {
  return (
    <section className="category-section">
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">Khám phá</span>

          <h2>Danh mục nổi bật</h2>
        </div>

        <Link to="/products" className="section-view-all">
          Xem tất cả →
        </Link>
      </div>

      <div className="category-grid">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className="category-card"
            >
              <div className="category-icon">
                <Icon size={32} strokeWidth={1.3} />
              </div>

              <span className="category-name">{category.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default CategorySection;
