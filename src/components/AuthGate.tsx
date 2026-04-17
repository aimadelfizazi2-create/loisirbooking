import { useEffect, type ReactNode } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const PUBLIC_ROUTES = ["/auth"];

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isPublic = PUBLIC_ROUTES.some((p) => location.pathname.startsWith(p));

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      navigate({ to: "/auth" });
    }
  }, [user, loading, isPublic, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && !isPublic) return null;

  return <>{children}</>;
}
