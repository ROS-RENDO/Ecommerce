const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const loginUser = async (email: string, password: string, rememberMe: boolean) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, rememberMe }),
    credentials: 'include',
  })
  
  const data = await res.json()
  
  if (!res.ok) {
    // Throw error with all details for proper handling
    const error: any = new Error(data.message || 'Login failed')
    error.status = res.status
    error.requiresVerification = data.requiresVerification
    error.email = data.email
    error.authProvider = data.authProvider
    throw error
  }
  
  return data
}

export const registerUser = async (
  firstname: string,
  lastname: string,
  username: string,
  email: string,
  password: string
) => {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstname, lastname, username, email, password }),
    credentials: 'include',
  })
  
  const data = await res.json()
  
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed')
  }
  
  return data
}

export const ForgotPassword = async (email: string) => {
  const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    credentials: "include",
    body: JSON.stringify({ email }),
  });
  
  const data = await res.json()
  
  if (!res.ok) throw new Error(data.message || "Invalid email");
  
  return data;
}

// For password reset flow
export const verifyCode = async (email: string, code: string) => {
  const res = await fetch(`${API_URL}/api/auth/verify-code`, {
    headers: { 'Content-Type': 'application/json' },
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ email, code }),
  })
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Verification failed');
  }
  
  return data;
}

export const ResetPassword = async (
  email: string,
  code: string,
  newPassword: string,
  confirmPassword: string
) => {
  const res = await fetch(`${API_URL}/api/auth/reset-password`, {
    headers: { 'Content-Type': 'application/json' },
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ email, code, newPassword, confirmPassword })
  })
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Password reset failed');
  }
  
  return data;
}

export const logoutUser = async () => {
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Logout failed");
  return await res.json();
};

// Email verification for new user registration
export const verifyEmail = async (email: string, code: string) => {
  const res = await fetch(`${API_URL}/api/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, code }),
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Verification failed');
  }
  
  return data;
};

export const resendVerificationCode = async (email: string) => {
  const res = await fetch(`${API_URL}/api/auth/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email }),
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Failed to resend code');
  }
  
  return data;
};

// Helper function to check if user is authenticated
export const getCurrentUser = async () => {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Not authenticated');
  }
  
  return data;
};