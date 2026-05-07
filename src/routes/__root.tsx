import { Outlet, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import appCss from "../styles.css?url";
import { FiltersProvider } from "@/contexts/FiltersContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGate } from "@/components/AuthGate";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { CityConfirmBanner } from "@/components/CityConfirmBanner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <a href="/" className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LoisirBooking — Réservez vos loisirs au Maroc" },
      { name: "description", content: "La super-app marocaine pour découvrir et réserver les meilleures activités de loisirs : aventure, bien-être, culture, gastronomie." },
      { name: "author", content: "LoisirBooking" },
      { property: "og:title", content: "LoisirBooking — Réservez vos loisirs au Maroc" },
      { property: "og:description", content: "La super-app marocaine pour découvrir et réserver les meilleures activités de loisirs : aventure, bien-être, culture, gastronomie." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "LoisirBooking — Réservez vos loisirs au Maroc" },
      { name: "twitter:description", content: "La super-app marocaine pour découvrir et réserver les meilleures activités de loisirs : aventure, bien-être, culture, gastronomie." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/0762b83b-220d-4c13-be72-018bb656a90b" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/0762b83b-220d-4c13-be72-018bb656a90b" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith("/auth");

  return (
    <AuthProvider>
      <FiltersProvider>
        <AuthGate>
          <div className="flex min-h-screen flex-col">
            {!isAuthRoute && <Header />}
            {!isAuthRoute && <CityConfirmBanner />}
            <main className="flex-1">
              <Outlet />
            </main>
            {!isAuthRoute && <Footer />}
            {!isAuthRoute && <ChatbotWidget />}
          </div>
        </AuthGate>
      </FiltersProvider>
    </AuthProvider>
  );
}
