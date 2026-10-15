import Link from "next/link";
import { CheckCircle2, GraduationCap, BookOpen, Award, Calendar, Phone } from "lucide-react";
import { SITE } from "@/lib/utils";
import { PUBLICATIONS, TESTIMONIALS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <span className="mx-2">←</span>
        <span>درباره ما</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            آشنایی با دکتر
          </span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            دکتر <span className="gradient-text">مهری شاکری‌نسب</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            دکترای تخصصی فیزیوتراپی (PhD) — موسس و مسئول فنی کلینیک تخصصی
            فیزیوتراپی پرتو
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-6">
            <Award className="h-4 w-4" />
            اولین و تنها کلینیک دارای دکترای تخصصی فیزیوتراپی در بهبهان
          </div>
          <p className="text-muted-foreground leading-relaxed mb-6">
            دکتر مهری شاکری‌نسب، دکترای تخصصی فیزیوتراپی و فارغ‌التحصیل ممتاز
            دانشگاه‌های علوم پزشکی شیراز، اصفهان و جندی‌شاپور اهواز، با سال‌ها
            تجربه در حوزه ارزیابی، درمان و توانبخشی اختلالات اسکلتی-عضلانی،
            آسیب‌های ورزشی و مشکلات حرکتی، خدمات درمانی تخصصی و مبتنی بر شواهد
            علمی را به مراجعین ارائه می‌دهند.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            در کلینیک تخصصی فیزیوتراپی پرتو، هر بیمار به‌صورت اختصاصی ارزیابی
            شده و برنامه درمانی متناسب با شرایط وی طراحی می‌شود. هدف ما تنها
            کاهش درد نیست؛ بلکه بازگرداندن عملکرد طبیعی بدن، بهبود کیفیت
            زندگی و پیشگیری از عود مجدد مشکلات حرکتی است.
          </p>
          <div className="flex gap-3">
            <Link href="/booking">
              <Button icon={<Calendar className="h-4 w-4" />}>رزرو نوبت</Button>
            </Link>
            <a href={`tel:${SITE.phone}`}>
              <Button variant="outline" icon={<Phone className="h-4 w-4" />}>
                تماس
              </Button>
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 gradient-bg rounded-[3rem] opacity-20 blur-2xl" />
          <img
            src="/assets/doctor.jpg"
            alt="دکتر مهری شاکری‌نسب"
            className="relative rounded-[2.5rem] shadow-2xl w-full"
          />
        </div>
      </div>

      <section className="mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black mb-4">
            درمان <span className="gradient-text">مبتنی بر شواهد</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            در کلینیک تخصصی فیزیوتراپی پرتو، تلفیق دانش روز دنیا، تجهیزات
            پیشرفته و توجه فردمحور به بیمار، پایه اصلی درمان است. ما معتقدیم
            درمان موفق زمانی حاصل می‌شود که علاوه بر رفع درد، عملکرد طبیعی بدن
            بازیابی شده و بیمار بتواند با اطمینان به زندگی روزمره، کار و
            فعالیت‌های ورزشی خود بازگردد.
          </p>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-primary" />
          تحصیلات و تخصص
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "دکترای تخصصی فیزیوتراپی (PhD)",
            "فارغ‌التحصیل ممتاز دانشگاه‌های علوم پزشکی شیراز، اصفهان و جندی‌شاپور اهواز",
            "پژوهشگر حوزه اختلالات اسکلتی-عضلانی و آسیب‌های ورزشی",
            "فعالیت در زمینه درمان‌های مبتنی بر شواهد (Evidence-Based Practice)",
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border"
            >
              <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          سوابق علمی و پژوهشی
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {PUBLICATIONS.map((p, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {p.type}
                  </span>
                  <span className="text-sm text-muted-foreground">{p.year}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{p.venue}</p>
                <p className="text-sm text-foreground/70">{p.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-black mb-8">تجربه‌ی مراجعین ما</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.slice(0, 6).map((t, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border p-5">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-warning">★</span>
                ))}
              </div>
              <p className="text-sm text-foreground/80 mb-4 line-clamp-4">{t.text}</p>
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                  {t.name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
