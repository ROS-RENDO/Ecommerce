
export interface WishlistProduct{
    _id: string;
    name: string;
    price: number;
    description: string;
    colors: string[];
    category: {_id: string; name: string; slug?: string};
    images: {url: string; public_id: string; _id: string}[];
}
export interface Wishlist{
    _id: string;
    user: string;
    products: WishlistProduct[];
}