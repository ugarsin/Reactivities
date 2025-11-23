import { Box, Container } from "@mui/material";
import NavBar from "./NavBar";
import CssBaseline from '@mui/material/CssBaseline';
import { Outlet, useLocation } from "react-router";
import HomePage from "../../features/home/HomePage";

export default function App() {
  const location = useLocation();

  return (
    <Box sx={{ bgcolor: "#eeeeee" }}>
      <CssBaseline></CssBaseline>
      {
        location.pathname === "/"
        ?
        <HomePage />
        :
        <>
          <NavBar />
          <Container maxWidth="xl" sx={{ mt: 3 }}>
            <Outlet />
          </Container>
        </>
      }
    </Box>
  )
}
