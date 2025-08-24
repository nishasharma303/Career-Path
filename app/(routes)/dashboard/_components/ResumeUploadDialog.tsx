import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { File, Loader2Icon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface ResumeUploadDialogProps {
  openResumeUpload: boolean;
  setOpenResumeDialog: (open: boolean) => void;
}

const ResumeUploadDialog: React.FC<ResumeUploadDialogProps> = ({ openResumeUpload, setOpenResumeDialog }) => {

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Clear file whenever dialog opens/closes
  useEffect(() => {
    setFile(null);
  }, [openResumeUpload]);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      console.log(selectedFile.name);
      setFile(selectedFile);
    }
  };

  const onUploadAndAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    const recordId = uuidv4();
    const formData = new FormData();
    formData.append('recordId', recordId);
    formData.append('resumeFile', file);

    try {
      const result = await axios.post('/api/ai-resume-agent', formData);
      console.log(result.data);
      router.push('/ai-tools/ai-resume-analyzer/' + recordId);
      setOpenResumeDialog(false);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openResumeUpload} onOpenChange={setOpenResumeDialog}>
      <DialogContent className="bg-white p-6 rounded shadow-lg">
        <DialogHeader>
          <DialogTitle>Upload Resume PDF File</DialogTitle>
          <DialogDescription asChild>
            <div>
              <label
                htmlFor="resumeUpload"
                className="flex flex-col items-center justify-center cursor-pointer p-7 border border-dashed rounded-2xl hover:bg-slate-100"
              >
                <File className="h-10 w-10" />
                {file ? (
                  <span className="mt-3 text-blue-500">{file.name}</span>
                ) : (
                  <span className="mt-3">Click here to Upload PDF file</span>
                )}
              </label>
              <input
                type="file"
                id="resumeUpload"
                accept="application/pdf"
                className="hidden"
                onChange={onFileChange}
              />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpenResumeDialog(false)}>Cancel</Button>
          <Button disabled={!file || loading} onClick={onUploadAndAnalyze}>
            {loading ? <Loader2Icon className="animate-spin" /> : <Sparkles />} Upload and Analyze
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeUploadDialog;
