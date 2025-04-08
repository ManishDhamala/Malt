import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { Button, IconButton, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUser } from "../State/Authentication/Action";
import { useState } from "react";

export const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(auth.user?.fullName || "");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleSave = () => {
    const jwt = auth.jwt;
    dispatch(updateUser({ jwt, user: { fullName: name } }));
    setEditMode(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center lg:mt-22">
      <div className="flex flex-col items-center justify-center ">
        <AccountCircleIcon sx={{ fontSize: "9rem" }} />

        <div className="w-full flex justify-center py-5">
          {editMode ? (
            <div className="flex items-center gap-1 w-[90%] max-w-md justify-center">
              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                size="small"
                sx={{ textAlign: "center", marginLeft: "6rem" }}
              />
              <IconButton onClick={handleSave}>
                <SaveIcon color="success" />
              </IconButton>
              <IconButton
                onClick={() => {
                  setEditMode(false);
                  setName(auth.user?.fullName || "");
                }}
              >
                <CloseIcon color="error" />
              </IconButton>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold ml-10">
                {auth.user?.fullName}
              </h1>
              <IconButton onClick={() => setEditMode(true)}>
                <EditIcon color="warning" />
              </IconButton>
            </div>
          )}
        </div>

        <p>Email: {auth.user?.email}</p>
        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{ margin: "1.8rem 0rem" }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};
