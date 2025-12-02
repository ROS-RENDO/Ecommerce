// hooks/useCategories.ts
import { useState, useEffect } from "react";
import { fetchCategories as fetchCategoriesService } from "@/app/api/CategoryService";
import { Category, CategoryItem } from "@/types/category";

const categoryImages: Record<string, string> = {
  clothing: "/assets/clothing.png",
  electronics: "/assets/Electronics.png",
  beauty: "/assets/Beauty.png",
  furniture: "/assets/Furniture.png",
  digital: "/assets/Digitalproduct.png",
  software: "/assets/Software.png",
  hardware: "/assets/Hardware.png",
  car: "/assets/Car.png",
  equipment: "/assets/Equipment.png",
  "pet-care": "/assets/Petcare.png",
  food: "/assets/Food.png",
  accessories: "/assets/Accessories.png",
  "baby-product": "/assets/Babyproduct.png",
  shoes: "/assets/Shoes.png",
  screen: "/assets/Screen.png",
  books: "/assets/Book.png",
  ticket: "/assets/Ticket.png",
  health: "/assets/Health.png",
  household: "/assets/Household.png",
  media: "/assets/Media.png",
};

export function useCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: Category[] = await fetchCategoriesService();

      // Map here inside the hook
      const mapped: CategoryItem[] = data.map((cat) => ({
        name: cat.name,
        imageSrc: categoryImages[cat.slug] || "/assets/default.png",
        href: `/category/${cat.slug}`,
        slug: cat.slug,
      }));

      setCategories(mapped);
    } catch (err: any) {
      setError(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: fetchCategories };
}
