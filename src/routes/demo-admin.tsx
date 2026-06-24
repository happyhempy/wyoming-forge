import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo-admin")({
  component: DemoAdminPage,
  head: () => ({
    meta: [{ title: "Demo Admin — USADOC" }],
  }),
});

function DemoAdminPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <p className="text-muted-foreground">Opening demo admin...</p>
    </div>
  );
}