import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, Check, AlertCircle, Loader2 } from "lucide-react";
import { addDemoDocument, getDemoMode } from "@/lib/demoAccess";

interface FileUploadZoneProps {
  caseId: string;
  onUploadComplete: () => void;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

export function FileUploadZone({ caseId, onUploadComplete }: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setStatus("error");
      setErrorMsg("File too large. Maximum 10MB.");
      return;
    }

    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setStatus("error");
      setErrorMsg("Only PDF, JPG, PNG or WEBP files are accepted.");
      return;
    }

    setFileName(file.name);
    setStatus("uploading");
    setProgress(20);
    setErrorMsg("");

    try {
      if (getDemoMode()) {
        addDemoDocument(file.name, "passport");
        setProgress(100);
        setStatus("success");
        onUploadComplete();
        setTimeout(() => {
          setStatus("idle");
          setProgress(0);
          setFileName("");
        }, 3000);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      setProgress(40);
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      setProgress(70);

      const { error: dbError } = await supabase.from("documents").insert({
        case_id: caseId,
        uploaded_by: user.id,
        file_url: filePath,
        file_name: file.name,
        document_type: "passport",
      });

      if (dbError) throw dbError;

      await supabase
        .from("cases")
        .update({ passport_url: filePath, current_step: 2 })
        .eq("id", caseId);

      await supabase
        .from("case_steps")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("case_id", caseId)
        .eq("step_number", 2);

      await supabase
        .from("case_steps")
        .update({ status: "in_progress" })
        .eq("case_id", caseId)
        .eq("step_number", 3);

      setProgress(100);
      setStatus("success");
      onUploadComplete();

      setTimeout(() => {
        setStatus("idle");
        setProgress(0);
        setFileName("");
      }, 3000);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Upload failed");
    }
  }, [caseId, onUploadComplete]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  }, [handleFile]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        📄 Please upload a clear copy of your <span className="font-semibold text-foreground">passport</span> (the page with your photo and details).
      </p>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => status === "idle" && inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all cursor-pointer ${
          dragActive
            ? "border-gold bg-gold/5 scale-[1.01]"
            : status === "success"
            ? "border-green-500 bg-green-500/5"
            : status === "error"
            ? "border-destructive bg-destructive/5"
            : "border-border hover:border-gold/50 hover:bg-muted/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={handleChange}
          className="hidden"
        />

        {status === "idle" && (
          <>
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">
                Drag & drop your passport here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse · PDF, JPG, PNG · Max 10MB
              </p>
            </div>
          </>
        )}

        {status === "uploading" && (
          <>
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
            <div className="text-center w-full">
              <p className="font-medium text-foreground">Uploading {fileName}...</p>
              <div className="mt-3 w-full max-w-xs mx-auto bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="w-6 h-6 text-green-500" />
            </div>
            <p className="font-medium text-green-500">
              {fileName} uploaded successfully!
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div className="text-center">
              <p className="font-medium text-destructive">{errorMsg}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setStatus("idle");
                  setErrorMsg("");
                }}
              >
                Try Again
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
