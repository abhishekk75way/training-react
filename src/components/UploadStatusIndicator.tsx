import { Box, LinearProgress, Paper, Stack, Typography, useTheme, IconButton } from "@mui/material";
import { useUpload } from "@/context/UploadContext";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";

export default function UploadStatusIndicator() {
  const theme = useTheme();
  const { uploadProgress, isUploading } = useUpload();
  const [manualClose, setManualClose] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  // Reset manual close state when new upload starts
  useEffect(() => {
    if (isUploading) {
      setManualClose(false);
      setShowComplete(false);
    }
  }, [isUploading]);

  // Show completion state when upload reaches 100%
  useEffect(() => {
    if (uploadProgress === 100 && !showComplete) {
      setShowComplete(true);
      // Auto-hide after 2.5 seconds
      const timer = setTimeout(() => {
        setManualClose(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [uploadProgress, showComplete]);

  if (!isUploading || uploadProgress === null || manualClose) return null;

  const handleClose = () => {
    setManualClose(true);
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        p: 2.5,
        minWidth: 300,
        maxWidth: 340,
        zIndex: 1300,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        animation: "slideIn 0.3s ease-out",
        "@keyframes slideIn": {
          from: {
            transform: "translateX(400px)",
            opacity: 0,
          },
          to: {
            transform: "translateX(0)",
            opacity: 1,
          },
        },
      }}
    >
      <Stack spacing={2}>
        {/* Header with Close Button */}
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: showComplete
                  ? theme.palette.success.light
                  : theme.palette.primary.light,
                transition: "all 0.3s ease",
              }}
            >
              {showComplete ? (
                <CheckCircleIcon sx={{ fontSize: 20}} />
              ) : (
                <CloudUploadIcon sx={{ fontSize: 20, color: "primary.main" }} />
              )}
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={700} sx={{ letterSpacing: 0.3 }}>
                {showComplete ? "Upload Complete" : "Uploading"}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25 }}>
                {showComplete ? "Ready for conversion" : "Processing file"}
              </Typography>
            </Box>
          </Stack>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              width: 32,
              height: 32,
              color: "text.secondary",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
                color: "text.primary",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>

        {/* Progress Bar */}
        {!showComplete && (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={Math.min(uploadProgress, 100)}
                sx={{
                  flex: 1,
                  height: 5,
                  borderRadius: 2.5,
                  backgroundColor: theme.palette.action.hover,
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 2.5,
                    backgroundColor: theme.palette.primary.main,
                    transition: "width 0.3s ease",
                  },
                }}
              />
              <Typography
                variant="caption"
                fontWeight={600}
                sx={{ ml: 1.5, minWidth: 32, color: "text.secondary" }}
              >
                {Math.min(uploadProgress, 100)}%
              </Typography>
            </Box>
          </Box>
        )}

        {/* Completion State */}
        {showComplete && (
          <Box
            sx={{
              p: 1.5,
              backgroundColor: theme.palette.success.light,
              borderRadius: 1,
              border: `1px solid ${theme.palette.success.main}`,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" fontWeight={600} color="success.main">
              ✓ Ready for conversion
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
