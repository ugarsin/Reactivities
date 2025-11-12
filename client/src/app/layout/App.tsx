import { useEffect, useState } from "react"
import type { Activity } from "../../lib/types/index.d"
import { Box, Container } from "@mui/material";
import NavBar from "./NavBar";
import CssBaseline from '@mui/material/CssBaseline';
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

export default function App() {
  // const title = "Reactivities";
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

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

  const handleOpenForm = (id?: string) => {
    if (id)
      handleSelectActivity(id);
    else
      handleCancelSelectActivity();
    setEditMode(true);
  }

  const handleFormClose = () => {
    setEditMode(false);
  }

  return (
    <Box sx={{bgcolor: "#eeeeee"}}>
      <CssBaseline></CssBaseline>
      <NavBar openForm={handleOpenForm}/>
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <ActivityDashboard 
          activities={activities}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          openForm={handleOpenForm}
          closeForm={handleFormClose}
        />
      </Container>
    </Box>
  )
}
