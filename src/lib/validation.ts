import { z } from "zod";

export const appointmentSchema = z.object({
  name: z.string().min(2, "نام الزامی است").max(100),
  phone: z.string().min(10, "شماره تماس الزامی است").max(20),
  email: z.string().email().optional().or(z.literal("")),
  serviceType: z.string().optional(),
  method: z.enum(["phone", "video", "inperson"]),
  date: z.string().min(1, "تاریخ الزامی است"),
  time: z.string().min(1, "ساعت الزامی است"),
  notes: z.string().max(1000).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "نام الزامی است").max(100),
  phone: z.string().max(20).optional(),
  email: z.string().email().optional().or(z.literal("")),
  subject: z.string().max(200).optional(),
  message: z.string().min(5, "پیام الزامی است").max(2000),
});

export const articleSchema = z.object({
  slug: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(500),
  content: z.string().min(1),
  category: z.string().optional(),
  image: z.string().optional(),
  author: z.string().optional(),
  published: z.boolean().optional(),
});

export const reviewSchema = z.object({
  name: z.string().min(2).max(100),
  rating: z.number().min(1).max(5),
  text: z.string().min(5).max(1000),
});
