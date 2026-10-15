"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";

export default function ArticleEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("edit");

  const [form, setForm] = React.useState({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    category: "",
    image: "",
    author: "دکتر مهری شاکری‌نسب",
    published: true,
  });
  const [loading, setLoading] = React.useState(!!editSlug);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (editSlug) {
      fetch(`/api/articles/${editSlug}`)
        .then((r) => r.json())
        .then((a) => {
          setForm({
            slug: a.slug,
            title: a.title,
            excerpt: a.excerpt,
            content: a.content,
            category: a.category || "",
            image: a.image || "",
            author: a.author,
            published: a.published,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [editSlug]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editSlug ? `/api/articles/${editSlug}` : "/api/articles";
      const method = editSlug ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/admin/articles");
      } else {
        const data = await res.json();
        setError(data.error || "خطا در ذخیره");
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20">در حال بارگذاری...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black">{editSlug ? "ویرایش مقاله" : "مقاله جدید"}</h1>
        <button onClick={() => router.back()} className="text-sm text-primary flex items-center gap-1">
          <ArrowRight className="h-4 w-4" />
          بازگشت
        </button>
      </div>

      <form onSubmit={submit} className="space-y-4 max-w-3xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="اسلاگ (URL) *"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
            disabled={!!editSlug}
          />
          <Input
            label="دسته"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </div>
        <Input
          label="عنوان *"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <Input
          label="خلاصه *"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          required
        />
        <Input
          label="تصویر (مسیر)"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          placeholder="/assets/blog-xxx.jpg"
        />
        <Input
          label="نویسنده"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
        <Textarea
          label="محتوا (Markdown) *"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
          className="min-h-[400px] font-mono text-sm"
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="published" className="text-sm">منتشر شده</label>
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
        <Button type="submit" loading={saving} icon={<Save className="h-4 w-4" />}>
          ذخیره
        </Button>
      </form>
    </div>
  );
}
