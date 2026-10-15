import Link from "next/link";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";


export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <span className="mx-2">←</span>
        <span>مقالات</span>
      </nav>

      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          مقالات آموزشی
        </span>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">
          دانستنی‌های <span className="gradient-text">سلامت</span>
        </h1>
        <p className="text-muted-foreground">
          مطالب کاربردی درباره پیشگیری، درمان و مراقبت از سلامت حرکتی از نگاه
          دکتر مهری شاکری‌نسب.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          هنوز مقاله‌ای منتشر نشده است.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <Link key={a.id} href={`/articles/${a.slug}`} className="group">
              <article className="h-full rounded-2xl bg-card border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={a.image || "/assets/blog-kamardard.jpg"}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {a.category && (
                    <span className="absolute top-3 start-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-medium text-primary">
                      {a.category}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {a.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {a.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(a.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {a.author}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {/* Scientific publications section */}
      <section className="mt-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            سوابق علمی
          </span>
          <h2 className="text-3xl font-black mb-4">
            ارائه‌های علمی و <span className="gradient-text">پژوهشی</span>
          </h2>
          <p className="text-muted-foreground">
            مبتنی بر رویکرد درمان بر پایه شواهد علمی (Evidence-Based Practice).
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { year: "۱۳۹۳", type: "سخنرانی علمی", title: "اختلالات اسکلتی-عضلانی در ورزشکاران", venue: "کنگره ستون فقرات، دانشگاه علوم پزشکی ایران، تهران" },
            { year: "۱۳۹۴", type: "پوستر علمی", title: "عوامل مرتبط با ریسک ابتلا به سکته مغزی", venue: "کنگره تازه‌های توانبخشی، دانشگاه علوم پزشکی شیراز" },
            { year: "۱۴۰۴", type: "کنگره بین‌المللی", title: "عملکرد عصبی-عضلانی در افراد مبتلا به زانودرد", venue: "کنگره بین‌المللی فیزیوتراپی ۱۴۰۴" },
            { year: "۱۴۰۴", type: "کنگره بین‌المللی", title: "معیارهای پیش‌بینی‌کننده موفقیت درمان در زانودرد", venue: "کنگره بین‌المللی فیزیوتراپی ۱۴۰۴" },
          ].map((p, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {p.type}
                </span>
                <span className="text-sm text-muted-foreground">{p.year}</span>
              </div>
              <h3 className="font-bold text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.venue}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
