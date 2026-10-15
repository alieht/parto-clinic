"use client";
import * as React from "react";
import Link from "next/link";
import { Calendar, FileText, Star, MessageSquare, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function AdminDashboard() {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20">در حال بارگذاری...</div>;

  const cards = [
    { label: "کل نوبت‌ها", value: stats.appointments, icon: Calendar, color: "from-primary to-accent", href: "/admin/appointments" },
    { label: "نوبت‌های در انتظار", value: stats.pendingAppts, icon: Clock, color: "from-warning to-danger", href: "/admin/appointments" },
    { label: "مقالات", value: stats.articles, icon: FileText, color: "from-accent to-success", href: "/admin/articles" },
    { label: "نظرات", value: stats.reviews, icon: Star, color: "from-success to-warning", href: "/admin/reviews" },
    { label: "پیام‌ها", value: stats.messages, icon: MessageSquare, color: "from-warning to-primary", href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black mb-6">داشبورد</h1>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((c, i) => (
          <Link key={i} href={c.href}>
            <Card hover>
              <CardContent className="p-5">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white mb-3`}>
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="text-3xl font-black mb-1">{c.value}</div>
                <div className="text-sm text-muted-foreground">{c.label}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-bold text-lg mb-4">آخرین نوبت‌ها</h2>
          {stats.recentAppointments?.length === 0 ? (
            <p className="text-muted-foreground text-sm">هنوز نوبتی ثبت نشده.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-start py-3 px-2">نام</th>
                    <th className="text-start py-3 px-2">تلفن</th>
                    <th className="text-start py-3 px-2">روش</th>
                    <th className="text-start py-3 px-2">تاریخ</th>
                    <th className="text-start py-3 px-2">ساعت</th>
                    <th className="text-start py-3 px-2">وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentAppointments.map((a: any) => (
                    <tr key={a.id} className="border-b border-border/50">
                      <td className="py-3 px-2 font-medium">{a.name}</td>
                      <td className="py-3 px-2" dir="ltr">{a.phone}</td>
                      <td className="py-3 px-2">{a.method}</td>
                      <td className="py-3 px-2">{a.date}</td>
                      <td className="py-3 px-2">{a.time}</td>
                      <td className="py-3 px-2">
                        <Badge variant={a.status === "pending" ? "warning" : a.status === "confirmed" ? "success" : "default"}>
                          {a.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
