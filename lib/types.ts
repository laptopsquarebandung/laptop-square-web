export interface Product {
  id: string;
  created_at?: string;
  name: string;
  brand: string;
  category?: string;
  specs: string;
  price: number;
  stock_status?: string;
  image_url?: string;
  slug?: string;
}

export type UsageCategory = 'ALL' | 'GAMING' | 'OLED' | 'STUDENT' | 'BUSINESS';

export interface FilterState {
  searchQuery: string;
  selectedBrand: string;
  usageCategory: UsageCategory;
  minPrice: number;
  maxPrice: number;
  sortBy: 'recommend' | 'price-asc' | 'price-desc' | 'name-asc';
}
