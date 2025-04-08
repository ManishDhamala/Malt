import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./component/State/store.js";
import { AlertProvider } from "./component/Templates/AlertProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AlertProvider>
          <App />
        </AlertProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
