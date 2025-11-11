import { useEffect, useState } from "react"
import type { Activity } from "../../lib/types/index.d"
import { Box, Container } from "@mui/material";
import NavBar from "./NavBar";
import CssBaseline from '@mui/material/CssBaseline';
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

function App() {
  // const title = "Reactivities";
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);

  useEffect(() => {
    fetch("https://localhost:5001/api/activities")
      .then(response => response.json())
      .then(data => setActivities(data));

    // clean up
    return () => {
      setActivities([]);
    };
  }, []);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.find(x => x.id === id));
  };

  const handleCancelSelectActivity = () => {
    setSelectedActivity(undefined);
  };

  return (
    <Box sx={{bgcolor: "#eeeeee"}}>
      <CssBaseline></CssBaseline>
      <NavBar />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <ActivityDashboard 
          activities={activities}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          selectedActivity={selectedActivity}
        />
      </Container>
    </Box>
  )
}

export default App
