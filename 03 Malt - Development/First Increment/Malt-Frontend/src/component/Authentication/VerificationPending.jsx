import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { Typography, Box, Paper, Button } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { resendVerification } from "../State/Authentication/Action";
import { useAlert } from "../Templates/AlertProvider";
import CenterLoader from "../Templates/CenterLoader";

const VerificationPending = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { showAlert } = useAlert();

  // Get email from location state or localStorage
  const email =
    location.state?.email || localStorage.getItem("pendingVerificationEmail");

  // Store email in localStorage to persist across page refreshes
  if (email && !localStorage.getItem("pendingVerificationEmail")) {
    localStorage.setItem("pendingVerificationEmail", email);
  }

  const [resendCooldown, setResendCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(60);

  const { isLoading, error, resendStatus, success } = useSelector(
    (state) => state.auth
  );

  const handleResendVerification = async () => {
    if (!email) {
      showAlert(
        "error",
        "Email address not found. please try registering again."
      );
      return;
    }
    // Start cooldown
    setResendCooldown(true);
    let timeRemaining = 60;

    const timer = setInterval(() => {
      timeRemaining -= 1;
      setCooldownTime(timeRemaining);

      if (timeRemaining <= 0) {
        clearInterval(timer);
        setResendCooldown(false);
      }
    }, 1000);

    // Dispatch resend action
    const result = await dispatch(resendVerification(email));

    if (result.success) {
      showAlert(
        "success",
        "Verification email resent successfully. Please check your inbox."
      );
    } else {
      showAlert("error", result.error || "Failed to resend verification email");
    }
  };

  const handleGoToLogin = () => {
    navigate("/account/login");
  };

  if (!email) {
    // If no email is found, user may have refreshed or accessed directly
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
          <Typography
            variant="h5"
            gutterBottom
            sx={{ textAlign: "center", color: "#B20303", fontWeight: "bold" }}
          >
            Verification Status Unknown
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
            We couldn't determine your verification status. Please try logging
            in or register again.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={handleGoToLogin}
            sx={{ mt: 2, borderRadius: "50px", p: 1 }}
          >
            Go to Login
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        marginTop: "85px",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: "100%" }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <MailOutlineIcon sx={{ fontSize: 60, color: "#B20303" }} />
        </Box>

        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", color: "#B20303", fontWeight: "bold" }}
        >
          Verify Your Email
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
          We've sent a verification link to <strong>{email}</strong>. Please
          check your inbox and click the link to activate your account.
        </Typography>

        <Typography variant="body2" sx={{ mb: 4, textAlign: "center" }}>
          If you don't see the email, check your spam folder or request a new
          verification link.
        </Typography>

        <Button
          fullWidth
          variant="contained"
          onClick={handleResendVerification}
          disabled={isLoading || resendCooldown}
          sx={{ mb: 2, borderRadius: "50px", p: 1 }}
        >
          {isLoading ? (
            <CenterLoader />
          ) : resendCooldown ? (
            `Resend available in ${cooldownTime}s`
          ) : (
            "Resend Verification Email"
          )}
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={handleGoToLogin}
          sx={{ borderRadius: "50px", p: 1 }}
        >
          Back to Login
        </Button>
      </Paper>
    </Box>
  );
};

export default VerificationPending;
