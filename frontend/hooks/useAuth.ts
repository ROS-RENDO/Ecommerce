// hooks/useAuth.ts
import { useState } from "react";
import * as authService from "@/app/api/authService"; // your file with loginUser, registerUser, etc.

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.loginUser(email, password, rememberMe);
      setUser(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, user };
}

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const register = async (firstname: string, lastname: string, username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.registerUser(firstname, lastname, username, email, password);
      setUser(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, user };
}

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.ForgotPassword(email);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendEmail, loading, error };
}

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = async (email: string, code: string, newPassword: string, confirmPassword: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.ResetPassword(email, code, newPassword, confirmPassword);
      return data;
    } catch (err: any) {
      setError(err.message || "Password reset failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { reset, loading, error };
}

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.logoutUser();
      return data;
    } catch (err: any) {
      setError(err.message || "Logout failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, error };
}
