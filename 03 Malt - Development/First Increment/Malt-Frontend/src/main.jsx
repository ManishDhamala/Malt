import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./component/State/store.js";
import { AlertProvider } from "./component/Templates/AlertProvider.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AlertProvider>
            <App />
          </AlertProvider>
        </LocalizationProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
