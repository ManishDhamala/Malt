import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Button } from "@mui/material";

const iconMap = {
  search: <SearchIcon fontSize="large" className="text-gray-400 mb-4" />,
  file: <InsertDriveFileIcon fontSize="large" className="text-gray-400 mb-4" />,
  alert: <WarningAmberIcon fontSize="large" className="text-gray-400 mb-4" />,
};

export default function NoDataFound({
  title = "No Data Found",
  description = "We couldn't find any data matching your request.",
  icon = "search",
  actionLabel,
  onAction,
}) {
  const selectedIcon =
    typeof icon === "string" && iconMap[icon] ? iconMap[icon] : icon;

  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-100 ">
      {selectedIcon}
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-gray-500 text-sm mb-4 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button variant="contained" size="small" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
