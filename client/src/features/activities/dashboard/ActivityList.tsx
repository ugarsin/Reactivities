import { Box, Typography } from "@mui/material";
import ActivityCard from "./ActivityCard";
import { useActivities } from "../../../lib/hooks/useActivities";

export default function ActivityList() {
    const {activities, isPending} = useActivities();

    if (isPending) {
      return <Typography>Loading...</Typography>
    }

    return (
    <Box sx={{display: "flex", flexDirection: "column", gap: 3}}>
      {activities?.map(activity => (
        <Box 
          id={activity.id} 
          key={activity.id}
        >
          <ActivityCard activity={activity} />
        </Box>
      ))};
    </Box>
  )
}
