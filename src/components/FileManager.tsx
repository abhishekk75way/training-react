import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  Tooltip,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  GetApp as DownloadIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  AudioFile as AudioFileIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  ViewList as ListViewIcon,
  ViewAgenda as GridViewIcon,
} from "@mui/icons-material";
import Select from "react-select";
import { getAllJobs } from "@/services/api";

export interface FileRecord {
  id: string;
  name: string;
  size: number;
  type: "uploaded" | "converted";
  status: "completed" | "processing" | "failed";
  uploadedAt: string;
  format?: string;
  duration?: number;
}

interface FileManagerProps {
  files: FileRecord[];
  onDownload: (fileId: string) => void;
  onDelete: (fileId: string) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const getStatusColor = (status: string): "success" | "warning" | "error" | "default" => {
  switch (status) {
    case "completed":
      return "success";
    case "processing":
      return "warning";
    case "failed":
      return "error";
    default:
      return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircleIcon sx={{ fontSize: 18 }} />;
    case "processing":
      return <ScheduleIcon sx={{ fontSize: 18 }} />;
    case "failed":
      return <ErrorIcon sx={{ fontSize: 18 }} />;
    default:
      return null;
  }
};

export const FileManager: React.FC<FileManagerProps> = ({
  files,
  onDownload,
  onDelete,
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileRecord[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<FileRecord | null>(null);
  const [filterType, setFilterType] = useState<"all" | "uploaded" | "converted">("all");
  const [backendFiles, setBackendFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectValue, setSelectValue] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Fetch jobs from backend on mount
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await getAllJobs();
        const jobs = response.data || [];
        
        // Transform backend jobs to FileRecord format
        const transformedFiles = jobs.map((job: any) => ({
          id: job.ID,
          name: `Job-${job.ID.slice(0, 8)}`,
          size: 0,
          type: "converted" as const,
          status: (job.Status === "completed" ? "completed" : job.Status === "failed" ? "failed" : "processing") as "completed" | "processing" | "failed",
          uploadedAt: new Date().toISOString(),
          format: "AUDIO",
        }));
        
        setBackendFiles(transformedFiles);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch jobs:", err);
        setError("Failed to load files from server");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Combine local and backend files
  const allFiles = useMemo(() => {
    return [...files, ...backendFiles];
  }, [files, backendFiles]);

  // Quick search filters selected files, or shows all files if none selected
  const displayFiles = useMemo(() => {
    const filesToDisplay = selectedFiles.length === 0 ? allFiles : selectedFiles;
    
    return filesToDisplay.filter((file) => {
      const matchesSearch = file.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || file.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [selectedFiles, allFiles, searchTerm, filterType]);

  // Transform files for react-select (use allFiles, not filtered, for selection)
  const selectOptions = useMemo(() => {
    return allFiles.map((file) => ({
      value: file.id,
      label: `${file.name} (${file.type === "converted" ? "Output" : "Uploaded"})`,
      file,
    }));
  }, [allFiles]);

  const handleSelectFile = (option: any) => {
    if (option) {
      setSelectedFiles((prev) =>
        prev.find((f) => f.id === option.file.id)
          ? prev
          : [...prev, option.file]
      );
      // Clear the select after selection
      setSelectValue(null);
    }
  };

  const removeSelected = (fileId: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const clearAllSelected = () => {
    setSelectedFiles([]);
    setSearchTerm("");
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Search and Filter Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            File Manager
          </Typography>
          {loading && <CircularProgress size={24} />}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Stack spacing={2}>
          {/* Search and Select Files */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Step 1: Search & Select Files ({allFiles.length} available)
            </Typography>
            <Select
              options={selectOptions}
              value={selectValue}
              onChange={handleSelectFile}
              onInputChange={(_inputValue, actionMeta) => {
                // Only clear if user cleared the input
                if (actionMeta.action === 'input-change') {
                  return;
                }
              }}
              placeholder={selectOptions.length === 0 ? "No files available" : "Search and select files..."}
              isClearable
              isSearchable
              isLoading={loading}
              maxMenuHeight={280}
              noOptionsMessage={() => selectOptions.length === 0 ? "No files available" : "No matching files"}
              formatOptionLabel={(option) => (
                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <span>{option.label}</span>
                  <Chip 
                    label={option.file.status} 
                    size="small" 
                    color={getStatusColor(option.file.status)}
                    variant="outlined"
                  />
                </Box>
              )}
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: state.isFocused ? theme.palette.primary.main : theme.palette.divider,
                  boxShadow: state.isFocused ? `0 0 0 1px ${theme.palette.primary.main}` : "none",
                  borderWidth: "1px",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                  },
                  minHeight: "40px",
                  cursor: "pointer",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected
                    ? theme.palette.primary.main
                    : state.isFocused
                      ? theme.palette.action.hover
                      : "white",
                  color: state.isSelected ? "white" : "black",
                  cursor: "pointer",
                  padding: "10px 12px",
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 9999,
                  boxShadow: `0 4px 12px rgba(0, 0, 0, 0.15)`,
                  border: `1px solid ${theme.palette.divider}`,
                }),
                menuList: (base) => ({
                  ...base,
                  maxHeight: "280px",
                }),
              }}
            />
          </Box>

          {/* Text Search */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Step 2: Quick Search in Results
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
          </Box>

          {/* Filter Chips */}
          <Box>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" sx={{ alignSelf: "center" }}>
                Filter:
              </Typography>
              {(["all", "uploaded", "converted"] as const).map((type) => (
                <Chip
                  key={type}
                  label={type.charAt(0).toUpperCase() + type.slice(1)}
                  onClick={() => setFilterType(type)}
                  variant={filterType === type ? "filled" : "outlined"}
                  color={filterType === type ? "primary" : "default"}
                  sx={{ textTransform: "capitalize" }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Selected Files Results */}
      {selectedFiles.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Results: {displayFiles.length} file{displayFiles.length !== 1 ? "s" : ""} selected
            </Typography>
            <Button 
              size="small" 
              variant="outlined" 
              color="error"
              onClick={clearAllSelected}
            >
              Clear All
            </Button>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {selectedFiles.map((file) => (
              <Chip
                key={file.id}
                label={file.name}
                onDelete={() => removeSelected(file.id)}
                color="primary"
                variant="outlined"
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* No Files Selected Message */}
      {selectedFiles.length === 0 && (
        <Box sx={{ mb: 3, p: 2, backgroundColor: "info.light", borderRadius: 1, border: `1px solid #e3f2fd` }}>
          <Typography variant="body2" color="info.dark" sx={{ fontWeight: 500 }}>
            � Browse all files below or use Step 1 to select specific files
          </Typography>
        </Box>
      )}

      {/* Files Display Header with View Mode Toggle */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          Files: {displayFiles.length} result{displayFiles.length !== 1 ? "s" : ""}
        </Typography>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="List View">
            <IconButton
              size="small"
              onClick={() => setViewMode("list")}
              sx={{
                backgroundColor: viewMode === "list" ? theme.palette.primary.light : "transparent",
                color: viewMode === "list" ? theme.palette.primary.main : "text.secondary",
                border: `1px solid ${theme.palette.divider}`,
                "&:hover": {
                  backgroundColor: viewMode === "list" ? theme.palette.primary.light : theme.palette.action.hover,
                },
              }}
            >
              <ListViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Grid View">
            <IconButton
              size="small"
              onClick={() => setViewMode("grid")}
              sx={{
                backgroundColor: viewMode === "grid" ? theme.palette.primary.light : "transparent",
                color: viewMode === "grid" ? theme.palette.primary.main : "text.secondary",
                border: `1px solid ${theme.palette.divider}`,
                "&:hover": {
                  backgroundColor: viewMode === "grid" ? theme.palette.primary.light : theme.palette.action.hover,
                },
              }}
            >
              <GridViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Files List View */}
      {viewMode === "list" && (
      <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1, overflow: "auto" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>
                  Filename
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  Type
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  Size
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  Format
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  Uploaded
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700 }}
                  align="right"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayFiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {allFiles.length === 0
                        ? "No files available"
                        : "No files match your search"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayFiles.map((file) => (
                  <TableRow
                    key={file.id}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AudioFileIcon
                          sx={{ color: "primary.main", fontSize: 20 }}
                        />
                        <Typography variant="body2">{file.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={file.type === "converted" ? "Output" : "Uploaded"}
                        size="small"
                        variant="outlined"
                        sx={{
                          textTransform: "capitalize",
                          borderColor: theme.palette.primary.main,
                          color: "primary.main",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatFileSize(file.size)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        {getStatusIcon(file.status)}
                        <Chip
                          label={file.status}
                          size="small"
                          color={getStatusColor(file.status)}
                          variant="outlined"
                          sx={{ textTransform: "capitalize" }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {file.format && (
                        <Chip
                          label={file.format.toUpperCase()}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: theme.palette.divider }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Download">
                        <IconButton
                          size="small"
                          onClick={() => onDownload(file.id)}
                          disabled={file.status !== "completed"}
                          sx={{
                            color: "primary.main",
                            "&:disabled": { color: "action.disabled" },
                          }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => setDeleteConfirm(file)}
                          sx={{ color: "error.main" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      )}

      {/* Files Grid View */}
      {viewMode === "grid" && (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 2 }}>
          {displayFiles.length === 0 ? (
            <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 4 }}>
              <Typography color="text.secondary">
                {allFiles.length === 0 ? "No files available" : "No files match your search"}
              </Typography>
            </Box>
          ) : (
            displayFiles.map((file) => (
              <Box
                key={file.id}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1.5,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: `0 2px 8px rgba(0, 0, 0, 0.1)`,
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                {/* File Icon and Name */}
                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                  <AudioFileIcon sx={{ color: "primary.main", fontSize: 28, mt: 0.5 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="body2" 
                      fontWeight={600} 
                      sx={{ wordBreak: "break-word", lineHeight: 1.3 }}
                    >
                      {file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(file.size)}
                    </Typography>
                  </Box>
                </Box>

                {/* File Details */}
                <Stack spacing={1} sx={{ py: 1 }}>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      label={file.type === "converted" ? "Output" : "Uploaded"}
                      size="small"
                      variant="outlined"
                      sx={{
                        textTransform: "capitalize",
                        borderColor: theme.palette.primary.main,
                        color: "primary.main",
                      }}
                    />
                    <Chip
                      label={file.status}
                      size="small"
                      color={getStatusColor(file.status)}
                      variant="outlined"
                      sx={{ textTransform: "capitalize" }}
                    />
                  </Box>
                  {file.format && (
                    <Typography variant="caption" sx={{ display: "flex", gap: 0.5 }}>
                      <strong>Format:</strong> {file.format.toUpperCase()}
                    </Typography>
                  )}
                  {file.duration && (
                    <Typography variant="caption" sx={{ display: "flex", gap: 0.5 }}>
                      <strong>Duration:</strong> {file.duration}s
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </Typography>
                </Stack>

                {/* Action Buttons */}
                <Stack direction="row" spacing={1} sx={{ pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                  <Tooltip title="Download">
                    <IconButton
                      size="small"
                      onClick={() => onDownload(file.id)}
                      sx={{
                        color: "primary.main",
                        flex: 1,
                        "&:hover": { backgroundColor: "primary.light" },
                      }}
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => setDeleteConfirm(file)}
                      sx={{
                        color: "error.main",
                        flex: 1,
                        "&:hover": { backgroundColor: "error.light" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            ))
          )}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete File</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button
            onClick={() => {
              if (deleteConfirm) {
                onDelete(deleteConfirm.id);
                setDeleteConfirm(null);
              }
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileManager;
