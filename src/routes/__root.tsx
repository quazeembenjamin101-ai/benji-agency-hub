import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/lib/auth";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { BenjiBot } from "@/components/site/bot";
import { JoinModalProvider } from "@/components/site/join-modal";

function NotFoundComponent() {
  return (
    <div className="pg">
      <div className="c" style={{ textAlign: "center", padding: "80px 0" }}>
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="l mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="ctas" style={{ justifyContent: "center" }}>
          <Link to="/" className="btn p">
            Back to home →
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="pg">
      <div className="c" style={{ textAlign: "center", padding: "80px 0" }}>
        <h1 style={{ fontSize: "clamp(1.9rem,4.6vw,3.6rem)" }}>This page didn't load</h1>
        <p className="l mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="ctas" style={{ justifyContent: "center" }}>
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn p"
          >
            Try again
          </button>
          <a href="/" className="btn s">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Benji Agency | Websites, AI Agents, Automation & Growth Systems" },
      {
        name: "description",
        content:
          "Benji Agency designs and builds high-converting websites, business apps, AI agents and automation that turn visitors into customers.",
      },
      { name: "author", content: "Benji Agency" },
      { property: "og:title", content: "Benji Agency | Websites, AI Agents, Automation & Growth Systems" },
      {
        property: "og:description",
        content:
          "Benji Agency designs and builds high-converting websites, business apps, AI agents and automation that turn visitors into customers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;500;600&family=Manrope:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        // Restore the persisted dark/light theme before first paint.
        children: `try{var t=localStorage.getItem('bt')||'dark';document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
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
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // The marketing chrome wraps the whole site except the owner console and account area.
  const chrome = !pathname.startsWith("/admin") && !pathname.startsWith("/account");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <JoinModalProvider>
          {chrome && <SiteHeader />}
          <main>
            <Outlet />
          </main>
          {chrome && <SiteFooter />}
          {chrome && <BenjiBot />}
          <Toaster position="bottom-left" theme="dark" />
        </JoinModalProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
