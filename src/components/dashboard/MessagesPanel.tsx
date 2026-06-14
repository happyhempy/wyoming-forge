import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { addDemoMessage, getDemoMode } from "@/lib/demoAccess";
import type { Database } from "@/integrations/supabase/types";

type Message = Database["public"]["Tables"]["messages"]["Row"];

interface MessagesPanelProps {
  messages: Message[];
  caseId: string;
  onMessageSent: () => void;
}

export function MessagesPanel({ messages, caseId, onMessageSent }: MessagesPanelProps) {
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    if (getDemoMode()) {
      addDemoMessage(newMessage.trim(), "client");
      setNewMessage("");
      setSending(false);
      onMessageSent();
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("messages").insert({
      case_id: caseId,
      sender_id: user.id,
      sender_role: "client" as const,
      content: newMessage.trim(),
    });

    setNewMessage("");
    setSending(false);
    onMessageSent();
  };

  return (
    <div>
      <div className="space-y-3 max-h-72 overflow-y-auto mb-4 pr-1">
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            No messages yet. Send us a message and we'll respond shortly.
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-xl ${
                msg.sender_role === "client"
                  ? "bg-gold/10 ml-8 rounded-br-sm"
                  : "bg-muted/50 mr-8 rounded-bl-sm"
              }`}
            >
              <p className="text-xs text-muted-foreground mb-1 capitalize">
                {msg.sender_role === "client" ? "You" : "Support Team"} ·{" "}
                {new Date(msg.created_at).toLocaleString()}
              </p>
              <p className="text-sm">{msg.content}</p>
            </div>
          ))
        )}
      </div>
      <div className="flex gap-2">
        <Textarea
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 min-h-[44px] max-h-32"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button
          variant="gold"
          onClick={handleSend}
          disabled={sending || !newMessage.trim()}
          className="self-end"
          size="icon"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
