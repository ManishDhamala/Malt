import { ThemeProvider } from "@emotion/react";
import { Navbar } from "./component/Navbar/Navbar";
import { whiteTheme } from "./Theme/WhiteTheme";
import { CssBaseline } from "@mui/material";
import { Home } from "./component/Home/Home";
import { RestaurantDetails } from "./component/Restaurant/RestaurantDetails";

function App() {
  return (
    <ThemeProvider theme={whiteTheme}>
      <CssBaseline />
      <Navbar />
      {/* <Home /> */}
      <RestaurantDetails />
    </ThemeProvider>
  );
}

export default App;
