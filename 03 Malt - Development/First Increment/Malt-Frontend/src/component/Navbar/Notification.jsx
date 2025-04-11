import React, { useState, useEffect, useRef } from "react";
import {
  Badge,
  Box,
  Popper,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Divider,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  ClickAwayListener,
  Snackbar,
  Alert,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllNotifications,
  getUnreadNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../State/Notification/Action";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export const Notification = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth, notification } = useSelector((store) => store);
  const jwt = auth?.jwt;

  useEffect(() => {
    if (jwt) {
      console.log("Fetching notification count with JWT:", jwt);
      dispatch(getUnreadNotificationCount(jwt)).then((res) => {
        if (res.error) {
          console.error("Error fetching notification count:", res.error);
          setErrorMsg("Failed to load notification count");
        }
      });
    }
  }, [jwt, dispatch]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);

    if (!open && jwt) {
      console.log("Opening notifications dropdown with JWT:", jwt);

      // Only fetch notifications when opening the menu
      dispatch(getAllNotifications(jwt)).then((res) => {
        if (res.error) {
          console.error("Error fetching all notifications:", res.error);
          setErrorMsg("Failed to load notifications");
        } else {
          console.log("All notifications loaded:", res.data);
        }
      });

      dispatch(getUnreadNotifications(jwt)).then((res) => {
        if (res.error) {
          console.error("Error fetching unread notifications:", res.error);
          setErrorMsg("Failed to load unread notifications");
        } else {
          console.log("Unread notifications loaded:", res.data);
        }
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNotificationClick = (notif) => {
    // Mark as read when clicked
    if (!notif.isRead && jwt) {
      dispatch(markNotificationAsRead({ jwt, notificationId: notif.id })).then(
        (res) => {
          if (res.error) {
            console.error("Error marking notification as read:", res.error);
            setErrorMsg("Failed to mark notification as read");
          }
        }
      );
    }

    // Handle navigation based on notification type
    if (notif.data && notif.data.url) {
      navigate(notif.data.url);
    }

    setOpen(false);
  };

  const handleMarkAllAsRead = () => {
    if (jwt) {
      dispatch(markAllNotificationsAsRead(jwt)).then((res) => {
        if (res.error) {
          console.error("Error marking all notifications as read:", res.error);
          setErrorMsg("Failed to mark all notifications as read");
        }
      });
    }
  };

  const handleDeleteNotification = (event, notificationId) => {
    event.stopPropagation(); // Prevent firing the parent click event
    if (jwt) {
      dispatch(deleteNotification({ jwt, notificationId })).then((res) => {
        if (res.error) {
          console.error("Error deleting notification:", res.error);
          setErrorMsg("Failed to delete notification");
        }
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleErrorClose = () => {
    setErrorMsg(null);
  };

  // Format the time difference
  const formatTimeAgo = (timestamp) => {
    return moment(timestamp).fromNow();
  };

  // Get notifications based on current tab
  const getNotificationsToDisplay = () => {
    if (tabValue === 0) {
      return notification.notifications || [];
    } else {
      return notification.unreadNotifications || [];
    }
  };

  const notificationsToDisplay = getNotificationsToDisplay();
  console.log("Notifications to display:", notificationsToDisplay);

  // Get notification type icon
  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "order":
        return <AccessTimeIcon sx={{ color: "#B20303" }} />;
      case "promotion":
        return <NotificationsActiveIcon sx={{ color: "#B20303" }} />;
      case "system":
        return <CheckCircleIcon sx={{ color: "#B20303" }} />;
      default:
        return <NotificationsIcon sx={{ color: "#B20303" }} />;
    }
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <Badge color="secondary" badgeContent={notification.unreadCount || 0}>
          <NotificationsIcon sx={{ fontSize: "1.6rem", color: "white" }} />
        </Badge>
      </IconButton>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        style={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            elevation={3}
            sx={{
              width: { xs: "320px", sm: "350px" },
              maxHeight: "400px",
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" fontWeight="600">
                  Notifications
                </Typography>
                {notification.unreadCount > 0 && (
                  <Button
                    startIcon={<DoneAllIcon />}
                    size="small"
                    onClick={handleMarkAllAsRead}
                    sx={{ color: "#B20303" }}
                  >
                    Mark all as read
                  </Button>
                )}
              </Box>

              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  mt: 1,
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 500,
                  },
                  "& .Mui-selected": {
                    color: "#B20303 !important",
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#B20303",
                  },
                }}
              >
                <Tab label="All" />
                <Tab label={`Unread (${notification.unreadCount || 0})`} />
              </Tabs>
            </Box>

            <List
              sx={{
                maxHeight: "315px",
                overflow: "auto",
                padding: 0,
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#ddd",
                  borderRadius: "4px",
                },
              }}
            >
              {notification.isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                  <CircularProgress size={30} sx={{ color: "#B20303" }} />
                </Box>
              ) : notificationsToDisplay.length > 0 ? (
                notificationsToDisplay.map((notif) => (
                  <React.Fragment key={notif.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        cursor: "pointer",
                        backgroundColor: notif.isRead ? "white" : "#faf6f6",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                        py: 1.5,
                      }}
                      onClick={() => handleNotificationClick(notif)}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={(e) => handleDeleteNotification(e, notif.id)}
                          size="small"
                        >
                          <DeleteIcon
                            sx={{ fontSize: "1.1rem", color: "#999" }}
                          />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "#f7e9e9" }}>
                          {getNotificationIcon(notif.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: notif.isRead ? 400 : 600,
                              fontSize: "0.95rem",
                              lineHeight: 1.2,
                              mb: 0.5,
                            }}
                          >
                            {notif.title}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ display: "block", mb: 0.5 }}
                            >
                              {notif.content}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", fontStyle: "italic" }}
                            >
                              {formatTimeAgo(notif.createdAt)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))
              ) : (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body1" color="text.secondary">
                    {tabValue === 0
                      ? "No notifications yet"
                      : "No unread notifications"}
                  </Typography>
                </Box>
              )}
            </List>
          </Paper>
        </ClickAwayListener>
      </Popper>

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMsg}
        autoHideDuration={6000}
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleErrorClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};
