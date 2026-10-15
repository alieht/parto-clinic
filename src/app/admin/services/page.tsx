"use client";
import * as React from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";

interface Service {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  description: string;
  icon?: string;
  image?: string;
  category?: string;
  order: number;
  active: boolean;
}

const ICONS = ["Stethoscope", "Activity", "Bone", "Heart", "Brain", "Clock", "Spine", "Knee"];

export default function AdminServices() {
  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Service | null>(null);
  const [form, setForm] = React.useState({
    slug: "",
    title: "",
    titleEn: "",
    description: "",
    icon: "Stethoscope",
    image: "",
    category: "",
    order: 0,
    active: true,
  });
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/services?all=true");
    const data = await res.json();
    setServices(data);
    setLoading(false);
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditing(null);
    setForm({ slug: "", title: "", titleEn: "", description: "", icon: "Stethoscope", image: "", category: "", order: services.length, active: true });
    setModalOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      slug: s.slug,
      title: s.title,
      titleEn: s.titleEn || "",
      description: s.description,
      icon: s.icon || "Stethoscope",
      image: s.image || "",
      category: s.category || "",
      order: s.order,
      active: s.active,
    });
    setModalOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setForm((f) => ({ ...f, image: data.url }));
    setUploading(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/services/${editing.slug}` : "/api/services";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setModalOpen(false);
        load();
      }
    } finally {
      setSaving(false);
    }
  };

  const remove = async (slug: string) => {
    if (!confirm("حذف این خدمت؟")) return;
    await fetch(`/api/services/${slug}`, { method: "DELETE" });
    load();
  };

  const toggleActive = async (s: Service) => {
    await fetch(`/api/services/${s.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !s.active }),
    });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-black">مدیریت خدمات</h1>
        <Button icon={<Plus className="h-4 w-4" />} onClick={openNew}>
          خدمت جدید
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-20">در حال بارگذاری...</div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">خدمتی یافت نشد.</div>
      ) : (
        <div className="grid gap-4">
          {services.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                    {s.image ? (
                      <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold">{s.title}</h3>
                      <Badge variant={s.active ? "success" : "default"}>
                        {s.active ? "فعال" : "غیرفعال"}
                      </Badge>
                      {s.category && <Badge variant="primary">{s.category}</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>
                    <div className="text-xs text-muted-foreground mt-1">اسلاگ: {s.slug} | ترتیب: {s.order}</div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => toggleActive(s)} className="p-2 rounded-lg hover:bg-muted" title={s.active ? "غیرفعال" : "فعال"}>
                      {s.active ? <X className="h-4 w-4 text-warning" /> : <Plus className="h-4 w-4 text-success" />}
                    </button>
                    <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-primary/10 text-primary" title="ویرایش">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(s.slug)} className="p-2 rounded-lg hover:bg-danger/10 text-danger" title="حذف">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "ویرایش خدمت" : "خدمت جدید"} size="lg">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="اسلاگ *"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              required
              disabled={!!editing}
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
            label="عنوان انگلیسی"
            value={form.titleEn}
            onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
          />
          <Textarea
            label="توضیحات *"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="آیکون"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            >
              {ICONS.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </Select>
            <Input
              label="ترتیب"
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium mb-2">تصویر</label>
            <div className="flex items-center gap-3">
              {form.image && (
                <img src={form.image} alt="" className="w-20 h-20 rounded-xl object-cover border border-border" />
              )}
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors text-sm">
                <Upload className="h-4 w-4" />
                {uploading ? "در حال آپلود..." : "آپلود تصویر"}
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
              {form.image && (
                <button type="button" onClick={() => setForm({ ...form, image: "" })} className="text-danger text-sm">
                  حذف تصویر
                </button>
              )}
            </div>
            <Input
              label="یا مسیر تصویر"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="/assets/svc-xxx.jpg"
              className="mt-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="active" className="text-sm">فعال</label>
          </div>

          <Button type="submit" loading={saving} className="w-full">
            ذخیره
          </Button>
        </form>
      </Modal>
    </div>
  );
}
