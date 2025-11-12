import { Box, Button, Card, CardActions, CardContent, Chip, Typography } from "@mui/material";
import type { Activity } from "../../../lib/types";

type Props = {
  activity: Activity;
  selectActivity: (id: string) => void;
}

export default function ActivityCard({
    activity,
    selectActivity
  }: Props) {
  return (
    <Card sx={{borderRadius: 3}}>
      <CardContent>
        <Typography variant="h5">{activity.title}</Typography>
        <Typography sx={{color: "text.secondary", mb: 1}}>{activity.date}</Typography>
        <Typography variant="body2">{activity.description}</Typography>
        <Typography variant="subtitle1">{activity.city}</Typography>
      </CardContent>
      <CardActions sx={{display: "flex", justifyContent: "space-between", paddingBottom: 2}}>
        <Chip label={activity.category} variant="outlined" />
        <Box sx={{display: "flex", paddingRight: "6px"}} gap={2}>
          <Button 
            onClick={() => selectActivity(activity.id)} 
            size="medium" 
            variant="contained"
          >View</Button>
          <Button 
            size="medium" 
            variant="contained"
            sx={{backgroundColor: "red"}}
          >Delete</Button>
        </Box>
      </CardActions>  
    </Card>
  )
}
