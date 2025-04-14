import React, { useState, useEffect } from "react";
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
      dispatch(getUnreadNotificationCount(jwt));
    }
  }, [jwt, dispatch]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);

    if (!open && jwt) {
      dispatch(getAllNotifications(jwt));
      dispatch(getUnreadNotifications(jwt));
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNotificationClick = (notif) => {
    if (!notif.isRead && jwt) {
      dispatch(markNotificationAsRead({ jwt, notificationId: notif.id }));
    }
    if (notif.data && notif.data.url) {
      navigate(notif.data.url);
    }
    setOpen(false);
  };

  const handleMarkAllAsRead = () => {
    if (jwt) {
      dispatch(markAllNotificationsAsRead(jwt));
    }
  };

  const handleDeleteNotification = (event, notificationId) => {
    event.stopPropagation();
    if (jwt) {
      dispatch(deleteNotification({ jwt, notificationId }));
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleErrorClose = () => {
    setErrorMsg(null);
  };

  const formatTimeAgo = (timestamp) => {
    return moment(timestamp).fromNow();
  };

  const getNotificationsToDisplay = () => {
    if (tabValue === 0) return notification.notifications || [];
    return notification.unreadNotifications || [];
  };

  const notificationsToDisplay = getNotificationsToDisplay();

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
          <NotificationsIcon sx={{ fontSize: "1.5rem", color: "white" }} />
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
              width: { xs: "280px", sm: "300px" },
              maxHeight: "360px",
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            <Box sx={{ p: 1.5, borderBottom: "1px solid #eee" }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" fontWeight="600" fontSize="0.95rem">
                  Notifications
                </Typography>
                {notification.unreadCount > 0 && (
                  <Button
                    startIcon={<DoneAllIcon />}
                    size="small"
                    onClick={handleMarkAllAsRead}
                    sx={{ color: "#B20303", fontSize: "0.75rem" }}
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
                  mt: 0.5,
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.8rem",
                    py: 0.5,
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
                maxHeight: "265px",
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
                  <CircularProgress size={24} sx={{ color: "#B20303" }} />
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
                        py: 1,
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
                        <Avatar
                          sx={{ bgcolor: "#f7e9e9", width: 30, height: 30 }}
                        >
                          {getNotificationIcon(notif.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: notif.isRead ? 400 : 600,
                              fontSize: "0.85rem",
                              lineHeight: 1.2,
                              mb: 0.3,
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
                              sx={{ fontSize: "0.75rem", mb: 0.3 }}
                            >
                              {notif.content}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: "0.65rem",
                                fontStyle: "italic",
                                display: "block",
                              }}
                              color="text.secondary"
                            >
                              {formatTimeAgo(notif.createdAt)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" sx={{ my: 0.5 }} />
                  </React.Fragment>
                ))
              ) : (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
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
