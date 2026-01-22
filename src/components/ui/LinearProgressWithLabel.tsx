import { Box, Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

export function LinearProgressWithLabel({ value }: { value: number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <Box sx={{ minWidth: 40 }}>
        <Typography variant="body2" color="text.secondary">
          {Math.round(value)}%
        </Typography>
      </Box>
    </Box>
  );
}
