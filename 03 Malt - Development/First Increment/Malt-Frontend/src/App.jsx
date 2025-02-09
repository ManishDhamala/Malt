import { ThemeProvider } from "@emotion/react";
import { Navbar } from "./component/Navbar/Navbar";
import { whiteTheme } from "./Theme/WhiteTheme";
import { CssBaseline } from "@mui/material";
import { Home } from "./component/Home/Home";
import { RestaurantDetails } from "./component/Restaurant/RestaurantDetails";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./component/State/Authentication/Action";
import { store } from "./component/State/store";
import { Cart } from "./component/Cart/Cart";

function App() {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { auth } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getUser(auth.jwt || jwt));
  }, [auth.jwt]);

  return (
    <ThemeProvider theme={whiteTheme}>
      <CssBaseline />
      <Navbar />
      {/* <Home /> */}
      {/* <RestaurantDetails /> */}
      <Cart />
    </ThemeProvider>
  );
}

export default App;
