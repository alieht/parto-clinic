"use client";
import * as React from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { toJalaaliDisplay } from "@/lib/jalali";
import { Card, CardContent } from "@/components/ui/Card";

export default function AdminArticles() {
  const [articles, setArticles] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/articles?all=true");
    const data = await res.json();
    setArticles(data);
    setLoading(false);
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const remove = async (slug: string) => {
    if (!confirm("آیا از حذف این مقاله اطمینان دارید؟")) return;
    await fetch(`/api/articles/${slug}`, { method: "DELETE" });
    load();
  };

  const togglePublish = async (a: any) => {
    await fetch(`/api/articles/${a.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !a.published }),
    });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-black">مدیریت مقالات</h1>
        <Link href="/admin/articles/new">
          <Button icon={<Plus className="h-4 w-4" />}>مقاله جدید</Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20">در حال بارگذاری...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">مقاله‌ای یافت نشد.</div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                    <th className="text-start py-3 px-3">عنوان</th>
                    <th className="text-start py-3 px-3">دسته</th>
                    <th className="text-start py-3 px-3">نویسنده</th>
                    <th className="text-start py-3 px-3">تاریخ</th>
                    <th className="text-start py-3 px-3">بازدید</th>
                    <th className="text-start py-3 px-3">وضعیت</th>
                    <th className="text-start py-3 px-3">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((a) => (
                    <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-3 font-medium max-w-xs truncate">{a.title}</td>
                      <td className="py-3 px-3 text-xs">{a.category || "—"}</td>
                      <td className="py-3 px-3 text-xs">{a.author}</td>
                      <td className="py-3 px-3 text-xs">{toJalaaliDisplay(a.publishedAt)}</td>
                      <td className="py-3 px-3">{a.views}</td>
                      <td className="py-3 px-3">
                        <Badge variant={a.published ? "success" : "default"}>
                          {a.published ? "منتشر شده" : "پیش‌نویس"}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => togglePublish(a)}
                            className="p-1.5 rounded-lg hover:bg-muted"
                            title={a.published ? "لغو انتشار" : "انتشار"}
                          >
                            {a.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <Link href={`/admin/articles/new?edit=${a.slug}`}>
                            <button className="p-1.5 rounded-lg hover:bg-primary/10 text-primary" title="ویرایش">
                              <Edit className="h-4 w-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => remove(a.slug)}
                            className="p-1.5 rounded-lg hover:bg-danger/10 text-danger"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
