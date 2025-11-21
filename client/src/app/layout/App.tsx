import { Box, Container } from "@mui/material";
import NavBar from "./NavBar";
import CssBaseline from '@mui/material/CssBaseline';
import { Outlet } from "react-router";

export default function App() {
  return (
    <Box sx={{bgcolor: "#eeeeee"}}>
      <CssBaseline></CssBaseline>
      <NavBar />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
