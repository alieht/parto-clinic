"use client";
import * as React from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Msg {
  id: string;
  sender: string;
  text: string;
  createdAt: string;
}

export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [sessionId, setSessionId] = React.useState("");
  React.useEffect(() => {
    setSessionId(`sess-${Math.random().toString(36).slice(2)}`);
  }, []);
  const [messages, setMessages] = React.useState<Msg[]>([
    { id: "0", sender: "bot", text: "سلام! چطور می‌توانم کمکتان کنم؟ 😊", createdAt: "2026-01-01T00:00:00.000Z" },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || !sessionId) return;
    setInput("");
    const userMsg: Msg = { id: Date.now().toString(), sender: "user", text, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, sender: "user", text }),
      });
      const data = await res.json();
      // fetch updated messages to get bot reply
      const r2 = await fetch(`/api/chat?sessionId=${sessionId}`);
      const all = await r2.json();
      setMessages(all);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 end-6 z-40 w-14 h-14 rounded-full gradient-bg text-white flex items-center justify-center shadow-lg shadow-primary/40 hover:scale-110 transition-transform"
        aria-label="چت"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 end-6 z-40 w-80 sm:w-96 h-[500px] rounded-2xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden">
          <div className="gradient-bg text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold">دستیار پرتو</div>
              <div className="text-xs opacity-80">آنلاین</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    m.sender === "user" ? "bg-primary text-white" : "bg-muted text-primary"
                  }`}
                >
                  {m.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                    m.sender === "user"
                      ? "bg-primary text-white rounded-ee-none"
                      : "bg-muted rounded-es-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-muted text-primary flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted px-3 py-2 rounded-2xl rounded-es-none">
                  <span className="inline-flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.3s]" />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="پیام خود را بنویسید..."
              className="flex-1 h-10 rounded-xl border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl gradient-bg text-white flex items-center justify-center disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
