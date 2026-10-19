import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  getFavorites,
  addFavorite as addFavoriteApi,
  removeFavorite as removeFavoriteApi,
} from "../api/favorite.api";
import { useAuth } from "./AuthContext";

const FavoriteContext = createContext(null);

export function FavoriteProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      const response = await getFavorites();
      const list = response?.data ?? response ?? [];
      setFavorites(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Get favorites context error:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const favoriteIdSet = useMemo(() => {
    const ids = new Set();
    favorites.forEach((item) => {
      const id = item.product_id ?? item.product?.id ?? item.id;
      if (id !== undefined && id !== null) {
        ids.add(String(id));
      }
    });
    return ids;
  }, [favorites]);

  const isFavorite = useCallback(
    (productId) => {
      if (!productId) return false;
      return favoriteIdSet.has(String(productId));
    },
    [favoriteIdSet],
  );

  const toggleFavorite = useCallback(
    async (product) => {
      if (!isAuthenticated) {
        return {
          success: false,
          requireAuth: true,
          message: "Vui lòng đăng nhập để lưu sản phẩm yêu thích.",
        };
      }

      const productId = typeof product === "object" ? product.id : product;
      const alreadyFavorited = isFavorite(productId);

      try {
        if (alreadyFavorited) {
          await removeFavoriteApi(productId);
          setFavorites((prev) =>
            prev.filter((item) => {
              const id = item.product_id ?? item.product?.id ?? item.id;
              return String(id) !== String(productId);
            }),
          );
          return { success: true, isFavorite: false };
        } else {
          await addFavoriteApi(productId);
          // Reload favorites để có đủ thông tin product
          await fetchFavorites();
          return { success: true, isFavorite: true };
        }
      } catch (error) {
        console.error("Toggle favorite error:", error);
        return {
          success: false,
          error:
            error.response?.data?.message ||
            "Không thể cập nhật danh sách yêu thích.",
        };
      }
    },
    [isAuthenticated, isFavorite, fetchFavorites],
  );

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        favoriteCount: favorites.length,
        isFavorite,
        toggleFavorite,
        fetchFavorites,
        loading,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorites phải được sử dụng bên trong FavoriteProvider");
  }
  return context;
}
