const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const fetchCategories= async()=>{
    try {
        const res= await fetch(`${API_URL}/api/category`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(!res.ok){
            throw new Error("Failed to fetch categories");
        }
        const data= await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching categories: ", error)
        throw error;
    }
}
