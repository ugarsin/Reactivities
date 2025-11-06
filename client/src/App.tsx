import { useEffect, useState } from "react"
import type { Activity } from "./lib/types/index.d"
import { List, ListItem, ListItemText, Typography } from "@mui/material";

function App() {
  const title = "Reactivities";
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch("https://localhost:5001/api/activities")
      .then(response => response.json())
      .then(data => setActivities(data));

      // clean up
      return () => {
        setActivities([]);
      };
  }, []);

  return (
    <>
      <Typography variant="h3">{title}</Typography>
      <List>
        {activities.map((activity) => 
          {
            return (
              <ListItem key={activity.id}>
                <ListItemText>{activity.title}</ListItemText>
              </ListItem>
            )
          }
        )}
      </List>
    </>
  )
}

export default App
