import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import { ChatWidget } from "@/components/chat/ChatWidget";

const vazir = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "کلینیک فیزیوتراپی پرتو | دکتر مهری شاکری‌نسب — بهبهان",
  description:
    "اولین کلینیک دارای دکترای تخصصی فیزیوتراپی در بهبهان. درمان تخصصی کمردرد، گردن‌درد، زانو، آسیب‌های ورزشی و توانبخشی با تجهیزات پیشرفته.",
  keywords: [
    "فیزیوتراپی بهبهان",
    "دکتر مهری شاکری نسب",
    "کلینیک پرتو",
    "کمردرد",
    "گردن درد",
    "توانبخشی",
  ],
  authors: [{ name: "دکتر مهری شاکری‌نسب" }],
  openGraph: {
    title: "کلینیک فیزیوتراپی پرتو",
    description: "دلیل حال خوب تو",
    locale: "fa_IR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html data-scroll-behavior="smooth"
      lang="fa"
      dir="rtl"
      className={`${vazir.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
        <FloatingButtons />
        <ChatWidget />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function removeNetlifyBadge() {
                // Remove Netlify HUD script
                var scripts = document.querySelectorAll('script[src*="netlify/scripts/hud"]');
                scripts.forEach(function(s) { s.remove(); });
                // Remove any netlify badge elements
                var selectors = ['.netlify-badge', '[data-netlify-badge]', 'iframe[src*="netlify"]', 'div[class*="netlify-badge"]', 'a[href*="netlify.com"][target="_blank"]'];
                selectors.forEach(function(sel) {
                  try { document.querySelectorAll(sel).forEach(function(el) { el.remove(); }); } catch(e) {}
                });
                // Remove any element containing "Powered by Netlify"
                document.querySelectorAll('*').forEach(function(el) {
                  if (el.textContent && el.textContent.indexOf('Powered by Netlify') !== -1 && el.children.length === 0) {
                    el.remove();
                  }
                });
              }
              // Run immediately and on DOM changes
              removeNetlifyBadge();
              if (typeof MutationObserver !== 'undefined') {
                var observer = new MutationObserver(function() { removeNetlifyBadge(); });
                observer.observe(document.body, { childList: true, subtree: true });
              }
              // Also run after delays
              setTimeout(removeNetlifyBadge, 1000);
              setTimeout(removeNetlifyBadge, 3000);
              setTimeout(removeNetlifyBadge, 5000);
            })();
          `,
        }}
      />
      </body>
    </html>
  );
}
