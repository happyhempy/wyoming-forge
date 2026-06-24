import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo-user")({
  component: DemoUserPage,
  head: () => ({
    meta: [{ title: "Demo User — USADOC" }],
  }),
});

function DemoUserPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <p className="text-muted-foreground">Opening demo user...</p>
    </div>
  );
}