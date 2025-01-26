import { ThemeProvider } from "@emotion/react";
import { Navbar } from "./component/Navbar/Navbar";
import { whiteTheme } from "./Theme/WhiteTheme";
import { CssBaseline } from "@mui/material";
import { Home } from "./component/Home/Home";

function App() {
  return (
    <ThemeProvider theme={whiteTheme}>
      <CssBaseline />
      <Navbar />
      <Home />
    </ThemeProvider>
  );
}

export default App;
