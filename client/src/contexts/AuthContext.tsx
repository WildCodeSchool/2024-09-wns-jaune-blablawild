import { useUserStore } from "@/store/useUserStore";
import { createContext, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useUserStore();
  const location = useLocation();

  //TODO: delete tripform to public routes
  const publicRoutes = [
    "/",
    "/signin",
    "/signup",
    "/search-result",
    "/404",
    "/tripform",
  ];
  const isPublicRoute = publicRoutes.some(
    (route) =>
      location.pathname === route || 
      location.pathname.startsWith(`${route}?`)
  );

  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to="/404" state={{ from: location }} replace />;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  return context;
}
