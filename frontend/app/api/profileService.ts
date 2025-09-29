const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const getProfile= async()=>{
    try {
        const res= await fetch(`${API_URL}/api/profile`,{
            credentials: 'include',
        });
        if (!res.ok) throw new Error('failed to fetch profile')
            const data= await res.json();
            return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}