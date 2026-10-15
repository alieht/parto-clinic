import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";


export const dynamic = "force-dynamic";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });

  if (!article || !article.published) notFound();

  // increment views (fire and forget)
  prisma.article.update({ where: { slug }, data: { views: { increment: 1 } } }).catch(() => {});

  // Simple markdown-ish rendering: convert ## headings and - lists
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let listBuffer: string[] = [];
    let key = 0;

    const flushList = () => {
      if (listBuffer.length > 0) {
        elements.push(
          <ul key={key++} className="list-disc list-inside space-y-1 my-4 text-foreground/80">
            {listBuffer.map((li, i) => (
              <li key={i}>{renderInline(li)}</li>
            ))}
          </ul>
        );
        listBuffer = [];
      }
    };

    const renderInline = (text: string) => {
      // bold **text**
      const parts = text.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      });
    };

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === "") {
        flushList();
        continue;
      }
      if (trimmed.startsWith("## ")) {
        flushList();
        elements.push(
          <h2 key={key++} className="text-2xl font-bold mt-8 mb-3 gradient-text">
            {trimmed.slice(3)}
          </h2>
        );
      } else if (trimmed.startsWith("### ")) {
        flushList();
        elements.push(
          <h3 key={key++} className="text-xl font-bold mt-6 mb-2">
            {trimmed.slice(4)}
          </h3>
        );
      } else if (trimmed.startsWith("- ")) {
        listBuffer.push(trimmed.slice(2));
      } else if (trimmed.startsWith("> ")) {
        flushList();
        elements.push(
          <blockquote
            key={key++}
            className="border-s-4 border-primary bg-primary/5 rounded-e-xl p-4 my-4 text-foreground/80 italic"
          >
            {renderInline(trimmed.slice(2))}
          </blockquote>
        );
      } else {
        flushList();
        elements.push(
          <p key={key++} className="text-foreground/80 leading-relaxed my-4">
            {renderInline(trimmed)}
          </p>
        );
      }
    }
    flushList();
    return elements;
  };

  return (
    <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
      <nav className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <span className="mx-2">←</span>
        <Link href="/articles" className="hover:text-primary">مقالات</Link>
        <span className="mx-2">←</span>
        <span className="line-clamp-1">{article.title}</span>
      </nav>

      {article.category && (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          <Tag className="h-3 w-3" />
          {article.category}
        </span>
      )}

      <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
        {article.title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {formatDate(article.publishedAt)}
        </span>
        <span className="flex items-center gap-1">
          <User className="h-4 w-4" />
          {article.author}
        </span>
      </div>

      {article.image && (
        <div className="rounded-2xl overflow-hidden mb-8">
          <img src={article.image} alt={article.title} className="w-full" />
        </div>
      )}

      <div className="prose-custom">{renderContent(article.content)}</div>

      <div className="mt-12 pt-8 border-t border-border">
        <Link href="/articles" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
          <ArrowRight className="h-4 w-4" />
          بازگشت به مقالات
        </Link>
      </div>
    </article>
  );
}
