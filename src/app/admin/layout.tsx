"use client";
import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Star,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const NAV = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard, roles: ["admin", "secretary"] },
  { href: "/admin/appointments", label: "نوبت‌ها", icon: Calendar, roles: ["admin", "secretary"] },
  { href: "/admin/reviews", label: "نظرات", icon: Star, roles: ["admin", "secretary"] },
  { href: "/admin/messages", label: "پیام‌ها", icon: MessageSquare, roles: ["admin", "secretary"] },
  { href: "/admin/articles", label: "مقالات", icon: FileText, roles: ["admin"] },
  { href: "/admin/services", label: "خدمات", icon: Layers, roles: ["admin"] },
  { href: "/admin/settings", label: "تنظیمات", icon: Settings, roles: ["admin"] },
];

const RESTRICTED_FOR_SECRETARY = ["/admin/articles", "/admin/services", "/admin/settings"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) {
          if (pathname !== "/admin/login") router.push("/admin/login");
        } else {
          setUser(d.user);
        }
      })
      .finally(() => setLoading(false));
  }, [pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  const isRestricted =
    user.role === "secretary" &&
    RESTRICTED_FOR_SECRETARY.some((p) => pathname === p || pathname.startsWith(p + "/"));

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 start-0 z-40 w-64 bg-card border-e border-border transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-black">
              پ
            </div>
            <div>
              <div className="font-bold text-sm">پنل مدیریت</div>
              <div className="text-xs text-muted-foreground">کلینیک پرتو</div>
            </div>
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {NAV.filter((n) => !n.roles || n.roles.includes(user?.role)).map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active ? "bg-primary text-white" : "text-foreground/80 hover:bg-muted"
                }`}
              >
                <n.icon className="h-5 w-5" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 inset-x-0 p-4 border-t border-border">
          <div className="text-sm mb-2 px-2">
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
            <div className="text-xs mt-1">
              <span className={`inline-block px-2 py-0.5 rounded-full ${user.role === "admin" ? "bg-primary/10 text-primary" : "bg-amber-100 text-amber-700"}`}>
                {user.role === "admin" ? "مدیر" : "منشی"}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            خروج
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="font-bold">پنل مدیریت کلینیک پرتو</h1>
          <Link href="/" className="text-sm text-primary hover:underline">
            مشاهده سایت ←
          </Link>
        </header>
        <main className="p-6">
          {isRestricted ? (
            <div className="max-w-md mx-auto mt-20 text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-xl font-bold mb-2">دسترسی محدود</h2>
              <p className="text-muted-foreground">
                شما به این بخش دسترسی ندارید. برای مدیریت خدمات، مقالات و تنظیمات با مدیر تماس بگیرید.
              </p>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
