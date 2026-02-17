import { Box, Typography, Container, Button } from "@mui/material";

import { ArrowForward, Refresh } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const FallBackUI = () => {
  const navigate = useNavigate();

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: 4,
      }}
    >
      <Box
        component="img"
        src={"/error.webp"}
        alt="Unexpected error"
        sx={{
          width: { xs: 140, sm: 200, md: 300 },
          height: "auto",
          opacity: 0.85,
          mb: 1,
        }}
      />

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 1.5,
          color: "text.primary",
        }}
      >
        Oops! Something didn’t go as planned
      </Typography>

      <Typography
        variant="body1"
        sx={{
          maxWidth: 520,

          color: "text.secondary",
          lineHeight: 1.6,
          animation: "fadeIn 0.4s ease-in",
        }}
      >
        We ran into an unexpected issue while loading this page. Don’t worry —
        your data is safe. You can try refreshing the page or return to the home
        screen to continue.
      </Typography>
      <Typography variant="caption" sx={{ my: 2, color: "text.disabled" }}>
        If the issue persists, please contact support.
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={handleReload}
          sx={{
            px: 4,
            py: 1.4,
            fontSize: "1rem",
            textTransform: "none",
            borderRadius: 2,
            backgroundColor: "rgb(8 51 68)",
            "&:hover": {
              backgroundColor: "rgb(6 42 56)",
            },
          }}
        >
          Reload Page
        </Button>

        <Button
          variant="outlined"
          endIcon={<ArrowForward />}
          onClick={() => navigate("/")}
          sx={{
            px: 4,
            py: 1.4,
            fontSize: "1rem",
            textTransform: "none",
            borderRadius: 2,
            borderColor: "rgb(8 51 68)",
            color: "rgb(8 51 68)",
            "&:hover": {
              borderColor: "rgb(6 42 56)",
              backgroundColor: "rgba(8, 51, 68, 0.04)",
            },
          }}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default FallBackUI;
