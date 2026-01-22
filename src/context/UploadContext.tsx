import { createContext, useContext, useState, useRef } from "react";

type UploadContextType = {
  files: File[];
  setFiles: (files: File[]) => void;
  duration: number | null;
  setDuration: (d: number | null) => void;
  uploadProgress: number | null;
  setUploadProgress: (progress: number | null | ((prev: number | null) => number | null)) => void;
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
  uploadIntervalRef: React.MutableRefObject<number | null>;
};

const UploadContext = createContext<UploadContextType | null>(null);

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<File[]>([]);
  const [duration, setDuration] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const uploadIntervalRef = useRef<number | null>(null);

  return (
    <UploadContext.Provider
      value={{ 
        files, 
        setFiles, 
        duration, 
        setDuration,
        uploadProgress,
        setUploadProgress,
        isUploading,
        setIsUploading,
        uploadIntervalRef,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
}

export function useUpload() {
  const ctx = useContext(UploadContext);
  if (!ctx) throw new Error("useUpload must be used inside UploadProvider");
  return ctx;
}
