"use client";
import * as React from "react";
import { CheckCircle2, XCircle, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { toJalaaliDisplay } from "@/lib/jalali";
import { Card, CardContent } from "@/components/ui/Card";

export default function AdminAppointments() {
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const [filter, setFilter] = React.useState("all");
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setLoading(true);
    const url = filter === "all" ? "/api/appointments" : `/api/appointments?status=${filter}`;
    const res = await fetch(url);
    const data = await res.json();
    setAppointments(data);
    setLoading(false);
  }, [filter]);

  React.useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("آیا از حذف این نوبت اطمینان دارید؟")) return;
    await fetch(`/api/appointments/${id}`, { method: "DELETE" });
    load();
  };

  const statusColor: Record<string, any> = {
    pending: "warning",
    confirmed: "success",
    completed: "default",
    cancelled: "danger",
  };
  const statusLabel: Record<string, string> = {
    pending: "در انتظار",
    confirmed: "تأیید شده",
    completed: "انجام شده",
    cancelled: "لغو شده",
  };
  const methodLabel: Record<string, string> = {
    phone: "تلفنی",
    video: "تصویری",
    inperson: "حضوری",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-black">مدیریت نوبت‌ها</h1>
        <div className="flex gap-2">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? "bg-primary text-white" : "bg-card border border-border hover:bg-muted"
              }`}
            >
              {f === "all" ? "همه" : statusLabel[f]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">در حال بارگذاری...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">نوبتی یافت نشد.</div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                    <th className="text-start py-3 px-3">نام</th>
                    <th className="text-start py-3 px-3">تلفن</th>
                    <th className="text-start py-3 px-3">خدمت</th>
                    <th className="text-start py-3 px-3">روش</th>
                    <th className="text-start py-3 px-3">تاریخ</th>
                    <th className="text-start py-3 px-3">ساعت</th>
                    <th className="text-start py-3 px-3">وضعیت</th>
                    <th className="text-start py-3 px-3">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-3 px-3 font-medium">{a.name}</td>
                      <td className="py-3 px-3" dir="ltr">{a.phone}</td>
                      <td className="py-3 px-3 text-xs">{a.serviceType || "—"}</td>
                      <td className="py-3 px-3">{methodLabel[a.method] || a.method}</td>
                      <td className="py-3 px-3">{toJalaaliDisplay(a.date)}</td>
                      <td className="py-3 px-3">{a.time}</td>
                      <td className="py-3 px-3">
                        <Badge variant={statusColor[a.status]}>{statusLabel[a.status]}</Badge>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1">
                          {a.status === "pending" && (
                            <button
                              onClick={() => updateStatus(a.id, "confirmed")}
                              className="p-1.5 rounded-lg hover:bg-success/10 text-success"
                              title="تأیید"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}
                          {a.status !== "cancelled" && a.status !== "completed" && (
                            <button
                              onClick={() => updateStatus(a.id, "cancelled")}
                              className="p-1.5 rounded-lg hover:bg-danger/10 text-danger"
                              title="لغو"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                          {a.status === "confirmed" && (
                            <button
                              onClick={() => updateStatus(a.id, "completed")}
                              className="p-1.5 rounded-lg hover:bg-primary/10 text-primary text-xs font-medium px-2"
                              title="انجام شد"
                            >
                              انجام
                            </button>
                          )}
                          <button
                            onClick={() => remove(a.id)}
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
