import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileText, Download, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { getDemoMode } from "@/lib/demoAccess";
import type { Database } from "@/integrations/supabase/types";


type Document = Database["public"]["Tables"]["documents"]["Row"];

interface YourFilesProps {
  documents: Document[];
}

type FileSpec = {
  key: string;
  label: string;
  description: string;
  match: (d: Document) => boolean;
};

const FILE_SPECS: FileSpec[] = [
  {
    key: "passport",
    label: "Passport",
    description: "The ID document you uploaded.",
    match: (d) => d.document_type.toLowerCase().includes("passport"),
  },
  {
    key: "articles",
    label: "Signed Articles of Organization",
    description: "Your signed Wyoming formation document.",
    match: (d) =>
      d.document_type.toLowerCase().includes("articles") ||
      d.document_type.toLowerCase().includes("signed"),
  },
  {
    key: "llc_certificate",
    label: "Wyoming LLC Certificate",
    description: "Official approval from the State of Wyoming.",
    match: (d) =>
      d.document_type === "llc_certificate" || d.document_type === "llc_document",
  },
  {
    key: "ein_letter",
    label: "EIN Confirmation Letter (IRS CP-575)",
    description: "Your Federal Tax ID confirmation from the IRS.",
    match: (d) => d.document_type === "ein_letter" || d.document_type === "ein",
  },
  {
    key: "ss4",
    label: "Form SS-4 (EIN Application)",
    description: "The signed SS-4 form submitted to the IRS.",
    match: (d) => d.document_type === "ss4" || d.document_type === "ss_4",
  },
];

export function YourFiles({ documents }: YourFilesProps) {
  const handleDownload = async (doc: Document) => {
    if (getDemoMode()) {
      alert(`${doc.file_name} is a demo document.`);
      return;
    }
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.file_url, 3600, { download: doc.file_name });
    if (error || !data?.signedUrl) {
      alert(`Could not download file: ${error?.message ?? "unknown error"}`);
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
          <span className="text-xl">📁</span>
        </div>
        <div>
          <h2 className="text-xl font-bold">Your Files</h2>
          <p className="text-sm text-muted-foreground">
            All your documents in one place — download whenever you need them.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {FILE_SPECS.map((spec) => {
          const doc = documents.find(spec.match);
          if (doc) {
            return (
              <div
                key={spec.key}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-5 h-5 text-gold shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{spec.label}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {doc.file_name} · {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(doc)}
                  className="shrink-0 ml-2"
                >
                  <Download className="w-4 h-4 mr-1" /> Download
                </Button>
              </div>
            );
          }
          return (
            <div
              key={spec.key}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-dashed border-border"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground truncate">
                    {spec.label}
                  </p>
                  <p className="text-xs text-muted-foreground/80 truncate">
                    {spec.description}
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground shrink-0 ml-2">
                Not ready yet
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
