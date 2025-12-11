import { Grid, Typography } from "@mui/material";
import { useParams } from "react-router";
import { useActivities } from "../../../lib/hooks/useActivities";
import ActivityDetailsHeader from "./ActivityDetailsHeader";
import ActivityDetailsInfo from "./ActivityDetailsInfo";
import ActivityDetailsChat from "./ActivityDetailsChat";
import ActivityDetailsSidebar from "./ActivityDetailsSidebar";

export default function ActivityDetails() {
  // const navigate = useNavigate();
  const {id} = useParams();
  const {activity, isLoadingActivity} = useActivities(id);

  if (isLoadingActivity) return (
    <Typography>Loading...</Typography>  
  )

  if (!activity) return (
    <Typography>Activity not found</Typography>  
  )

  return (
    <Grid container spacing={3}>
      <Grid size={8}>
        <ActivityDetailsHeader activity={activity}></ActivityDetailsHeader>
        <ActivityDetailsInfo activity={activity}></ActivityDetailsInfo>
        <ActivityDetailsChat></ActivityDetailsChat>
      </Grid>
      <Grid 
        size={4}           
        sx={{
          position: "sticky",
          top: 14 * 8,
          alignSelf: "flex-start",
        }}
      >
        <ActivityDetailsSidebar activity={activity}></ActivityDetailsSidebar>
      </Grid>
    </Grid>
  )
}
