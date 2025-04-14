import { createTheme } from "@mui/material";

export const whiteTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#B20303" //red
        },
        secondary: {
            main: "#F9FAFB"  // light-gray
        },
        black: {
            main: "#242b2E"  // light-black
        },
        background: {
            main: "#ffffff",  //white
            default: "#fdfdfd",  // white
            paper: "#fdfdfd"      // white
        },
        textColor: {
            main: "#20232d",  // light-black
            secondary: "#4a4a4a" // lighter secondary text
        }
    },

    typography: {
        fontFamily: "'Poppins', sans-serif, Arial, Helvetica",
    },

})