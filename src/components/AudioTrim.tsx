import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Alert,
  Paper,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  CircularProgress,
  Chip,
  Stack,
  Tab,
  Tabs,
  useTheme,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ErrorIcon from "@mui/icons-material/Error";
import { useUpload } from "@/context/UploadContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  convertAudio,
  downloadResult,
  getJobStatus,
  type Job,
} from "@/services/api";
import FileManager, { type FileRecord } from "./FileManager";

export default function AudioTrim() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { files, setFiles, duration, setDuration, uploadProgress: globalUploadProgress, setUploadProgress: setGlobalUploadProgress, isUploading, setIsUploading, uploadIntervalRef } = useUpload();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const [isConverting, setIsConverting] = useState(false);
  const [convertProgress, setConvertProgress] = useState<number | null>(null);
  const [convertDone, setConvertDone] = useState(false);

  const [job, setJob] = useState<Job | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState((location.state as any)?.tab ?? 0);
  
  // File management state
  const [fileRecords, setFileRecords] = useState<FileRecord[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<FileRecord[]>([]);

  const uploadRef = useRef<number | null>(null);
  const convertRef = useRef<number | null>(null);
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      // Don't clear intervals here - let them continue in the background
      // The interval refs are managed by the context
    };
  }, []);

  const extractDuration = (file: File): Promise<number> =>
    new Promise((resolve, reject) => {
      const el = document.createElement(
        file.type.startsWith("video") ? "video" : "audio",
      );
      el.preload = "metadata";
      el.src = URL.createObjectURL(file);

      el.onloadedmetadata = () => {
        URL.revokeObjectURL(el.src);
        resolve(Math.floor(el.duration));
      };

      el.onerror = () => reject(new Error("Cannot read media duration"));
    });

  const handleFiles = async (list: File[]) => {
    if (!list.length) return;

    setError("");
    setFiles(list);
    setDuration(null);
    setConvertDone(false);
    setJob(null);
    setJobId(null);
    setUploadProgress(1);
    setGlobalUploadProgress(1);
    setIsUploading(true);
    setDragActive(false);

    try {
      const d = await extractDuration(list[0]);
      if (!d || d <= 0) throw new Error("Invalid duration");
      setDuration(d);

      // Add to file records
      const newFile: FileRecord = {
        id: `uploaded-${Date.now()}`,
        name: list[0].name,
        size: list[0].size,
        type: "uploaded",
        status: "completed",
        uploadedAt: new Date().toISOString(),
        format: list[0].name.split('.').pop()?.toUpperCase(),
        duration: d,
      };
      setFileRecords((prev) => [newFile, ...prev]);
    } catch (err) {
      setError("Unable to read media duration. Please try another file.");
      setFiles([]);
      setIsUploading(false);
      setGlobalUploadProgress(null);
      return;
    }

    uploadRef.current = window.setInterval(() => {
      setGlobalUploadProgress((p: number | null) => {
        if (!p || p >= 100) {
          if (uploadRef.current) clearInterval(uploadRef.current);
          if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
          uploadIntervalRef.current = null;
          uploadRef.current = null;
          setIsUploading(false);
          // Don't clear global progress here - let indicator show completion
          return 100;
        }
        const newProgress = p + 4;
        setUploadProgress(newProgress);
        return newProgress;
      });
    }, 200);
    uploadIntervalRef.current = uploadRef.current;
  };

  const resetAll = () => {
    setFiles([]);
    setDuration(null);
    setUploadProgress(null);
    setGlobalUploadProgress(null);
    setIsUploading(false);
    setConvertProgress(null);
    setConvertDone(false);
    setJob(null);
    setJobId(null);
    setError("");
  };

  const handleConvert = async () => {
    if (isUploading || !duration || files.length === 0) return;

    setIsConverting(true);
    setConvertProgress(1);
    setError("");

    convertRef.current = window.setInterval(() => {
      setConvertProgress((prev) => {
        if (!prev) return 1;
        if (prev >= 95) return prev;
        // More aggressive increment for better UX
        const increment = prev < 50 ? 5 + Math.random() * 5 : 2 + Math.random() * 3;
        return Math.min(prev + increment, 95);
      });
    }, 150);

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      formData.append("start_time", "0");
      formData.append("end_time", duration.toString());

      const res = await convertAudio(formData);
      setJobId(res.data.job_id);
      pollJob(res.data.job_id);
    } catch (err: any) {
      clearInterval(convertRef.current!);
      setIsConverting(false);
      setConvertProgress(null);
      setError(err.response?.data?.message || "Conversion failed");
    }
  };

  const pollJob = (id: string) => {
    pollRef.current = window.setInterval(async () => {
      try {
        const res = await getJobStatus(id);
        setJob(res.data);

        if (res.data.Status === "completed") {
          clearInterval(pollRef.current!);
          clearInterval(convertRef.current!);

          // Set progress to 100 immediately
          setConvertProgress(100);
          setConvertDone(true);

          // Add converted file to records
          if (res.data.ZipPath) {
            const convertedFile: FileRecord = {
              id: jobId!,
              name: `converted-${new Date().getTime()}.zip`,
              size: 0,
              type: "converted",
              status: "completed",
              uploadedAt: new Date().toISOString(),
              format: "ZIP",
            };
            setConvertedFiles((prev) => [convertedFile, ...prev]);
          }

          // Delay finishing so user sees 100% for a moment
          setTimeout(() => {
            setIsConverting(false);
          }, 800);
        }

        if (res.data.Status === "failed") {
          clearInterval(pollRef.current!);
          clearInterval(convertRef.current!);
          setIsConverting(false);
          setConvertProgress(null);
          setError("Processing failed on server");
        }
      } catch (err: any) {
        clearInterval(pollRef.current!);
        setError(err.message || "Unable to fetch job status");
      }
    }, 2000);
  };

  const handleDownload = async () => {
    if (!jobId) return;

    try {
      const res = await downloadResult(jobId);
      const blob = new Blob([res.data], {
        type: res.headers["content-type"],
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "trimmed_audio.zip";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "Download failed");
    }
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getJobStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircleIcon sx={{ color: "success.main" }} />;
      case "processing":
      case "queued":
        return <HourglassEmptyIcon sx={{ color: "info.main" }} />;
      case "failed":
        return <ErrorIcon sx={{ color: "error.main" }} />;
      default:
        return <CircularProgress size={20} />;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Button onClick={() => navigate("/audio")} sx={{ mb: 3, display: "flex", alignItems: "center", gap: 0.5 }}>
          ← Back
        </Button>

        {/* Tabbed Interface */}
        <Card sx={{ border: `1px solid ${theme.palette.divider}`, mb: 4 }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Tabs 
              value={activeTab} 
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{
                "& .MuiTab-root": {
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                  color: theme.palette.text.secondary,
                },
                "& .MuiTab-root.Mui-selected": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <Tab label="Upload & Convert" />
              <Tab label="File Manager" />
            </Tabs>
          </Box>

          {/* Tab 1: Conversion Tool */}
          {activeTab === 0 && (
            <CardContent sx={{ p: 4 }}>
              <Box mb={4}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Upload & Process Audio
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Drag and drop or select files to begin processing
                </Typography>
              </Box>

              {/* Upload Area */}
              <Paper
                variant="outlined"
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  handleFiles(e.dataTransfer.files ? Array.from(e.dataTransfer.files) : []);
                }}
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderStyle: "dashed",
                  borderWidth: 2,
                  borderColor: dragActive ? theme.palette.primary.main : theme.palette.divider,
                  backgroundColor: dragActive ? `${theme.palette.primary.main}04` : theme.palette.background.paper,
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  mb: 3,
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: `${theme.palette.primary.main}02`,
                  },
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 56, color: theme.palette.primary.main, mb: 2, opacity: 0.8 }} />
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Drag files here or click to browse
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Supports MP3, WAV, M4A, OGG, MP4, WebM
                </Typography>

                <Button component="label" variant="contained">
                  Select Files
                  <input
                    hidden
                    type="file"
                    multiple
                    accept="audio/*,video/*"
                    onChange={(e) =>
                      handleFiles(
                        e.target.files ? Array.from(e.target.files) : [],
                      )
                    }
                  />
                </Button>
              </Paper>

              {/* File Info */}
              {files.length > 0 && duration && (
                <Card sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 0.5 }}>
                          FILE DETAILS
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {files[0].name}
                        </Typography>
                      </Box>
                      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Duration
                          </Typography>
                          <Typography variant="body2" fontWeight={700}>
                            {formatDuration(duration)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Size
                          </Typography>
                          <Typography variant="body2" fontWeight={700}>
                            {(files[0].size / 1024 / 1024).toFixed(2)} MB
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {/* Progress Indicators */}
              {!isUploading && files.length > 0 && globalUploadProgress === 100 && (
                <Box sx={{ mb: 3, p: 2, backgroundColor: theme.palette.success.light, borderRadius: 1, border: `1px solid ${theme.palette.divider}` }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                    <Typography variant="body2" fontWeight={600}>
                      File ready for conversion
                    </Typography>
                  </Box>
                </Box>
              )}

              {isConverting && convertProgress !== null && (
                <Box sx={{ mb: 3 }}>
                  <Card sx={{ border: `1px solid ${theme.palette.divider}` }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Stack spacing={2}>
                        <Box>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                            <Typography variant="body2" fontWeight={600}>
                              Processing
                            </Typography>
                            <Typography variant="caption" fontWeight={700} color={theme.palette.primary.main}>
                              {convertProgress}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={convertProgress}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>

                        {job && (
                          <Box sx={{ p: 1.5, backgroundColor: theme.palette.background.default, borderRadius: 1 }}>
                            <Stack direction="row" alignItems="center" gap={1.5} spacing={0}>
                              {getJobStatusIcon(job.Status)}
                              <Box flex={1}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Job Status
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                  {job.Status.charAt(0).toUpperCase() + job.Status.slice(1)}
                                </Typography>
                              </Box>
                              <Chip label={job.Status} size="small" variant="outlined" />
                            </Stack>
                          </Box>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              )}

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
                  {error}
                </Alert>
              )}

              {/* Action Buttons */}
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                {!convertDone && (
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={isUploading || isConverting || files.length === 0 || !duration}
                    onClick={handleConvert}
                  >
                    {isConverting ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={18} sx={{ color: "inherit" }} />
                        Converting...
                      </Box>
                    ) : (
                      "Start Conversion"
                    )}
                  </Button>
                )}

                {convertDone && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={handleDownload}
                  >
                    Download Result
                  </Button>
                )}

                {files.length > 0 && !isConverting && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={resetAll}
                    size="large"
                    sx={{
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 700,
                      textTransform: "none",
                    }}
                  >
                    Clear All
                  </Button>
                )}
              </Stack>
            </CardContent>
          )}

          {/* Tab 2: File Manager */}
          {activeTab === 1 && (
            <CardContent>
              <FileManager
                files={[...fileRecords, ...convertedFiles]}
                onDownload={(fileId) => {
                  console.log("Download file:", fileId);
                  if (convertedFiles.some((f) => f.id === fileId)) {
                    handleDownload();
                  }
                }}
                onDelete={(fileId) => {
                  setFileRecords((prev) => prev.filter((f) => f.id !== fileId));
                  setConvertedFiles((prev) => prev.filter((f) => f.id !== fileId));
                }}
              />
            </CardContent>
          )}
        </Card>
      </Box>
    </Container>
  );
}
