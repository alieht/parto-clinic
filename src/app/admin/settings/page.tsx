"use client";
import * as React from "react";
import { Save, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";

export default function AdminSettings() {
  const [form, setForm] = React.useState({ current: "", next: "", confirm: "" });
  const [msg, setMsg] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.next !== form.confirm) {
      setMsg("رمز جدید و تکرار آن یکسان نیستند.");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      // For demo, just show success (real impl would call API)
      await new Promise((r) => setTimeout(r, 500));
      setMsg("رمز عبور با موفقیت تغییر یافت (دمو).");
      setForm({ current: "", next: "", confirm: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-black mb-6">تنظیمات</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              تغییر رمز عبور
            </h2>
            <form onSubmit={changePassword} className="space-y-4">
              <Input
                label="رمز فعلی"
                type="password"
                value={form.current}
                onChange={(e) => setForm({ ...form, current: e.target.value })}
              />
              <Input
                label="رمز جدید"
                type="password"
                value={form.next}
                onChange={(e) => setForm({ ...form, next: e.target.value })}
              />
              <Input
                label="تکرار رمز جدید"
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              />
              {msg && <p className="text-sm text-primary">{msg}</p>}
              <Button type="submit" loading={loading} icon={<Save className="h-4 w-4" />}>
                ذخیره
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-bold text-lg mb-4">اطلاعات کلینیک</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">نام کلینیک</span>
                <span className="font-medium">کلینیک تخصصی فیزیوتراپی پرتو</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">پزشک</span>
                <span className="font-medium">دکتر مهری شاکری‌نسب</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">تلفن</span>
                <span className="font-medium" dir="ltr">09991561688</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">آدرس</span>
                <span className="font-medium text-end max-w-[60%]">بهبهان، خیابان پیروز، کوچه بهادری</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
