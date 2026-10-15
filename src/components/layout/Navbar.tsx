"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Calendar, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "خانه" },
  { href: "/services", label: "خدمات" },
  { href: "/about", label: "درباره ما" },
  { href: "/articles", label: "مقالات" },
  { href: "/contact", label: "ارتباط با ما" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                پ
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg leading-tight">کلینیک پرتو</div>
              <div className="text-xs text-muted-foreground">دلیل حال خوب تو</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "text-primary bg-primary/10"
                      : "text-foreground/80 hover:text-primary hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${SITE.phone}`}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span dir="ltr">{SITE.phone}</span>
            </a>
            <Link href="/booking">
              <button className="hidden sm:inline-flex items-center gap-2 h-11 px-5 rounded-xl gradient-bg text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <Calendar className="h-4 w-4" />
                رزرو نوبت
              </button>
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
              aria-label="منو"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-3 rounded-lg text-base font-medium",
                    active ? "text-primary bg-primary/10" : "text-foreground/80"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href="/booking" className="mt-2">
              <button className="w-full h-12 rounded-xl gradient-bg text-white font-semibold">
                رزرو نوبت آنلاین
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
