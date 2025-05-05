import React from "react";
import {
  Box,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";

export const TablePagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={2}
      p={2}
    >
      <Box>
        <Typography variant="body2">
          Showing {currentPage * pageSize + 1} to{" "}
          {Math.min((currentPage + 1) * pageSize, totalItems)} of {totalItems}{" "}
          orders
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={2}>
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <InputLabel>Rows</InputLabel>
          <Select
            value={pageSize}
            label="Rows"
            onChange={(e) => onPageSizeChange(e.target.value)}
          >
            {[5, 10, 20, 50].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Pagination
          count={totalPages}
          page={currentPage + 1} // MUI Pagination is 1-based
          onChange={(e, page) => onPageChange(page - 1)} // Convert back to 0-based
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
};
