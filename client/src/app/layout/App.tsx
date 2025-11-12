import { useState } from "react"
import type { Activity } from "../../lib/types/index.d"
import { Box, Container } from "@mui/material";
import NavBar from "./NavBar";
import CssBaseline from '@mui/material/CssBaseline';
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { useActivities } from "../../lib/hooks/useActivities";

export default function App() {
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const {activities} = useActivities();

  const handleSelectActivity = (id: string) => {
    if (!activities) return;
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
