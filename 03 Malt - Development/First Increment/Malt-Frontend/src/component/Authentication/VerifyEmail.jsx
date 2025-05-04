import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { verifyEmail } from "../State/Authentication/Action";
import CenterLoader from "../Templates/CenterLoader";

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [verificationAttempted, setVerificationAttempted] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const { isLoading, verificationStatus, error } = useSelector(
    (state) => state.auth
  );

  // Extract token from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    // If token exists, attempt verification
    if (token && !verificationAttempted) {
      setVerificationAttempted(true);
      dispatch(verifyEmail(token, navigate));
    }
  }, [token, dispatch, navigate, verificationAttempted]);

  // Countdown timer for successful verification
  useEffect(() => {
    let timer;
    if (verificationStatus === "success") {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/account/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [verificationStatus, navigate]);

  const handleGoToLogin = () => {
    navigate("/account/login");
  };

  const handleGoToSupport = () => {
    // Implement support route or external link
    window.location.href = "mailto:maltfoodnp@gmail.com";
  };

  // Show loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 4, maxWidth: 500, width: "100%", textAlign: "center" }}
        >
          <CenterLoader />
          <Typography variant="h5" gutterBottom>
            Verifying your email...
          </Typography>
          <Typography variant="body1">
            Please wait while we verify your email address.
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Show error state
  if (verificationStatus === "fail") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: "100%" }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <ErrorOutlineIcon sx={{ fontSize: 60, color: "#B20303" }} />
          </Box>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ textAlign: "center", color: "#B20303", fontWeight: "bold" }}
          >
            Verification Failed
          </Typography>

          <Alert severity="error" sx={{ mb: 3 }}>
            {error || "Invalid or expired verification link."}
          </Alert>

          <Typography variant="body1" sx={{ mb: 4, textAlign: "center" }}>
            The verification link may have expired or is invalid. Please try
            requesting a new verification email.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/account/verification-pending")}
            sx={{ mb: 2, borderRadius: "50px", p: 1 }}
          >
            Request New Verification
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoToSupport}
            sx={{ borderRadius: "50px", p: 1 }}
          >
            Contact Support
          </Button>
        </Paper>
      </Box>
    );
  }

  // Show success state
  if (verificationStatus === "success") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: "100%" }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 60, color: "green" }} />
          </Box>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ textAlign: "center", color: "green", fontWeight: "bold" }}
          >
            Email Verified Successfully!
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, textAlign: "center" }}>
            Your email has been verified successfully. You can now log in to
            your account.
          </Typography>

          <Typography variant="body2" sx={{ mb: 3, textAlign: "center" }}>
            Redirecting to login page in {countdown} seconds...
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={handleGoToLogin}
            sx={{ borderRadius: "50px", p: 1 }}
          >
            Login Now
          </Button>
        </Paper>
      </Box>
    );
  }

  // Default/initial state (should rarely be seen)
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{ p: 4, maxWidth: 500, width: "100%", textAlign: "center" }}
      >
        <Typography variant="h5" gutterBottom>
          Processing Verification
        </Typography>
        <CenterLoader />
        <Typography variant="body1">
          Please wait while we process your verification...
        </Typography>
      </Paper>
    </Box>
  );
};

export default VerifyEmail;
