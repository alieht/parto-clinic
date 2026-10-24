"use client";
import * as React from "react";
import { Mail, Phone, Trash2, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { toJalaaliDisplay } from "@/lib/jalali";

export default function AdminMessages() {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<any>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/contact");
    const data = await res.json();
    setMessages(data);
    setLoading(false);
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const markRead = async (id: string) => {
    await fetch(`/api/contact/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: true }) });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("حذف پیام؟")) return;
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    setSelected(null);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-black mb-6">پیام‌های تماس</h1>
      {loading ? (
        <div className="text-center py-20">در حال بارگذاری...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">پیامی یافت نشد.</div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-2">
            {messages.map((m) => (
              <button
                key={m.id}
                onClick={() => { setSelected(m); if (!m.read) markRead(m.id); }}
                className={`w-full text-start p-4 rounded-xl border transition-colors ${
                  selected?.id === m.id ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">{m.name}</span>
                  {!m.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <div className="text-xs text-muted-foreground truncate">{m.subject || m.message}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {toJalaaliDisplay(m.createdAt)}
                </div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2">
            {selected ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold">{selected.name}</h2>
                      {selected.subject && <p className="text-sm text-muted-foreground">{selected.subject}</p>}
                    </div>
                    <button onClick={() => remove(selected.id)} className="p-2 rounded-lg hover:bg-danger/10 text-danger">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    {selected.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${selected.phone}`} dir="ltr">{selected.phone}</a>
                      </div>
                    )}
                    {selected.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${selected.email}`}>{selected.email}</a>
                      </div>
                    )}
                  </div>
                  <div className="bg-muted rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground">
                    {toJalaaliDisplay(selected.createdAt)}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                یک پیام را انتخاب کنید
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
