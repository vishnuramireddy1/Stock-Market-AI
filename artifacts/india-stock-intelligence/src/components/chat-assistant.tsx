import { useState } from "react";
import { useChatWithResearchAssistant } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatResponse } from "@workspace/api-client-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  response?: ChatResponse;
};

export function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "I'm your Indian market intelligence assistant. Ask me about specific stocks, sectors, or macro trends."
    }
  ]);
  const [input, setInput] = useState("");
  
  const chat = useChatWithResearchAssistant();

  const handleSend = () => {
    if (!input.trim() || chat.isPending) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);

    chat.mutate(
      { data: { message: userMsg, context: "homepage" } },
      {
        onSuccess: (res) => {
          setMessages(prev => [
            ...prev,
            { role: "assistant", content: res.answer, response: res }
          ]);
        },
        onError: () => {
          setMessages(prev => [
            ...prev,
            { role: "assistant", content: "Sorry, I encountered an error connecting to the intelligence feed." }
          ]);
        }
      }
    );
  };

  return (
    <Card className="flex flex-col h-[500px] border-primary/20 shadow-[0_0_20px_rgba(234,179,8,0.05)]">
      <CardHeader className="py-4 border-b border-border bg-card/50">
        <CardTitle className="text-base flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          Quant Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-3 text-sm",
                  msg.role === "assistant" ? "flex-row" : "flex-row-reverse"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  msg.role === "assistant" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className={cn(
                  "px-4 py-3 rounded-2xl max-w-[85%]",
                  msg.role === "assistant" 
                    ? "bg-muted/50 rounded-tl-sm" 
                    : "bg-primary text-primary-foreground rounded-tr-sm"
                )}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  
                  {msg.response && (
                    <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-primary" />
                          Confidence: {(msg.response.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      {msg.response.sources.length > 0 && (
                        <div className="text-[10px] text-muted-foreground/70 font-mono">
                          Sources: {msg.response.sources.join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {chat.isPending && (
              <div className="flex gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-muted/50 rounded-tl-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-border bg-card/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about markets..."
              className="pr-10 bg-background border-border/50 focus-visible:ring-primary/50"
              disabled={chat.isPending}
            />
            <Button
              size="icon"
              type="submit"
              disabled={!input.trim() || chat.isPending}
              className="absolute right-1 top-1 h-8 w-8 rounded-sm"
              variant="ghost"
            >
              <Send className="w-4 h-4 text-primary" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
