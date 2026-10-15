"use client";
import * as React from "react";
import { CheckCircle2, XCircle, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";

export default function AdminReviews() {
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [filter, setFilter] = React.useState("all");
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setLoading(true);
    const url = filter === "all" ? "/api/reviews?all=true" : `/api/reviews?all=true`;
    const res = await fetch(url);
    const data = await res.json();
    setReviews(filter === "all" ? data : data.filter((r: any) => (filter === "approved" ? r.approved : !r.approved)));
    setLoading(false);
  }, [filter]);

  React.useEffect(() => { load(); }, [load]);

  const update = async (id: string, approved: boolean) => {
    await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    }).catch(() => {});
    // fallback: re-fetch not enough; reload
    load();
  };

  // Need a PATCH route for reviews; add inline via direct prisma? Use a generic approach: call a route
  const approve = async (id: string) => {
    await fetch(`/api/reviews/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ approved: true }) });
    load();
  };
  const reject = async (id: string) => {
    await fetch(`/api/reviews/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ approved: false }) });
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("حذف نظر؟")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-black">مدیریت نظرات</h1>
        <div className="flex gap-2">
          {["all", "approved", "pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? "bg-primary text-white" : "bg-card border border-border hover:bg-muted"
              }`}
            >
              {f === "all" ? "همه" : f === "approved" ? "تأیید شده" : "در انتظار"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">در حال بارگذاری...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">نظری یافت نشد.</div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{r.name}</div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: r.rating }).map((_, j) => (
                            <Star key={j} className="h-3.5 w-3.5 fill-warning text-warning" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80">{r.text}</p>
                    <div className="mt-2">
                      <Badge variant={r.approved ? "success" : "warning"}>
                        {r.approved ? "تأیید شده" : "در انتظار تأیید"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!r.approved && (
                      <button onClick={() => approve(r.id)} className="p-2 rounded-lg hover:bg-success/10 text-success" title="تأیید">
                        <CheckCircle2 className="h-5 w-5" />
                      </button>
                    )}
                    {r.approved && (
                      <button onClick={() => reject(r.id)} className="p-2 rounded-lg hover:bg-warning/10 text-warning" title="لغو تأیید">
                        <XCircle className="h-5 w-5" />
                      </button>
                    )}
                    <button onClick={() => remove(r.id)} className="p-2 rounded-lg hover:bg-danger/10 text-danger" title="حذف">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
