// types/category.ts

export interface CategoryWithImage extends Category {
  name: string;
  imageSrc: string;
  href: string; // Optional href for linking
  slug: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  products: string[]; // Product IDs
  createdAt?: string; // optional because not in your sample
  updatedAt?: string; // optional because sometimes missing
}
