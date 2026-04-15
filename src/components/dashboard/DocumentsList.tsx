import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Document = Database["public"]["Tables"]["documents"]["Row"];

interface DocumentsListProps {
  documents: Document[];
}

export function DocumentsList({ documents }: DocumentsListProps) {
  const handleDownload = async (doc: Document) => {
    const { data } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.file_url, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  if (documents.length === 0) return null;

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="w-5 h-5 text-gold shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{doc.file_name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {doc.document_type.replace(/_/g, " ")} · {new Date(doc.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownload(doc)}
            className="shrink-0 ml-2"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
        </div>
      ))}
    </div>
  );
}
