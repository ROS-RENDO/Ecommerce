const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
export const loginUser = async ( email: string, password: string)=>{
    try {
        const res= await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({email, password}),
            credentials: 'include',
        })
        if (!res.ok){
            const errData=await res.json()
            throw new Error(errData.message || 'Login failed')
        }
        const data= await res.json()
        return data
        
    } catch (err: any) {
        throw new Error(err.message || 'Network error')
    }
}
export const registerUser = async (firstname:string, lastname: string, username: string, email: string, password: string)=>{
    try {
        const res= await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({firstname, lastname,username, email, password}),
            credentials: 'include',
        })
        if (!res.ok){
            const errData=await res.json()
            throw new Error(errData.message || 'Login failed')
        }
        const data= await res.json()
        return data
        
    } catch (err: any) {
        throw new Error(err.message || 'Network error')
    }
}

export const logoutUser = async () => {
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include", // to send the cookie
  });

  if (!res.ok) throw new Error("Logout failed");
  return await res.json();
};