import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/unsubscribe")({
  validateSearch: (search): { token?: string } => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  component: UnsubscribePage,
  head: () => ({
    meta: [
      { title: "Unsubscribe — USADOC" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type Status = "loading" | "valid" | "already" | "invalid" | "submitting" | "done" | "error";

function UnsubscribePage() {
  const { token } = Route.useSearch();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      setMessage("Missing unsubscribe token.");
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/email/unsubscribe?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (!res.ok) {
          setStatus("invalid");
          setMessage(data.error || "Invalid or expired link.");
          return;
        }
        if (data.valid) setStatus("valid");
        else if (data.reason === "already_unsubscribed") {
          setStatus("already");
          setMessage("You're already unsubscribed from USADOC marketing emails.");
        } else {
          setStatus("invalid");
          setMessage("Invalid or expired link.");
        }
      } catch {
        setStatus("error");
        setMessage("Could not reach the server. Please try again.");
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setStatus("submitting");
    try {
      const res = await fetch("/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("done");
        setMessage("You've been unsubscribed. We're sorry to see you go.");
      } else if (data.reason === "already_unsubscribed") {
        setStatus("already");
        setMessage("You're already unsubscribed.");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Could not reach the server. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Unsubscribe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" && (
            <p className="text-muted-foreground">Checking your link…</p>
          )}
          {status === "valid" && (
            <>
              <p className="text-foreground">
                Are you sure you want to unsubscribe from USADOC emails? You'll
                still receive critical account and order-related messages.
              </p>
              <Button onClick={confirm} className="w-full">
                Confirm unsubscribe
              </Button>
            </>
          )}
          {status === "submitting" && (
            <p className="text-muted-foreground">Processing…</p>
          )}
          {(status === "done" || status === "already") && (
            <p className="text-foreground">{message}</p>
          )}
          {(status === "invalid" || status === "error") && (
            <p className="text-destructive">{message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
