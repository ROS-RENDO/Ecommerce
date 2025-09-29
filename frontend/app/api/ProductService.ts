const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Product{
    _id: string;
    name: string;
    price?: number;
    description?: string;
    category?: string;
}

export const fetchProduct= async(): Promise<Product[]> =>{
    try {
        const res= await fetch(`${API_URL}/api/product`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(!res.ok){
            throw new Error("Failed to fetch Products");
        }
        const data: Product[]= await res.json();
        return data
    } catch (error) {
        console.error("Error fetching products: ", error)
        throw error;
    }
}