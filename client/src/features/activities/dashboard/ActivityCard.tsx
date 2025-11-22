import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Divider, Typography } from "@mui/material";
import type { Activity } from "../../../lib/types";
import { Link } from "react-router";
import { AccessTime, Place } from "@mui/icons-material";

type Props = {
  activity: Activity;
}

export default function ActivityCard({activity}: Props) {
  const isHost = false;
  const isGoing = false;
  const label = isHost ? "You are hosting" : "You are going";
  const isCancelled = false;
  const color = isHost ? "secondary" : isGoing ? "warning" : "default";

  return (
    <Card sx={{borderRadius: 3}}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <CardHeader
          avatar={<Avatar sx={{height: 80, width: 80}} />}
          title={activity.title}
          slotProps={{
            title: {
              sx: {
                fontWeight: "bold",
                fontSize: 20
              },
            },
          }}
          subheader={
            <>
              Hosted by{" "} <Link to={"/profiles/bob"}></Link>
            </>
          }
        />
        <Box display="flex" flexDirection="column" gap={2} mr={2}>
          {
            (isHost || isGoing) 
            &&
            <Chip label={label} color={color} sx={{borderRadius: 2}} /> 
          }
          {
            (isCancelled) 
            &&
            <Chip label="Cancelled" color="error" sx={{borderRadius: 2}} />
          }
        </Box>
      </Box>
      <Divider sx={{mb: 3}}></Divider>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2} px={2}>
          <AccessTime sx={{mr: 1}}></AccessTime>
          <Typography variant="body2">{activity.date}</Typography>
          <Place sx={{ml:3, mr: 1}}>{activity.date}</Place>
          <Typography variant="body2">{activity.venue}</Typography>
        </Box>
        <Divider></Divider>
        <Box display="flex" gap={2} sx={{backgroundColor: "grey:200", py: 3, pl: 2}}>
          Attendees go here
        </Box>
      </CardContent>
      <CardActions sx={{display: "flex", justifyContent: "space-between", paddingBottom: 2}}>
        <Typography variant="body2">{activity.description}</Typography>
        <Box sx={{display: "flex", paddingRight: "6px"}} gap={2}>
          <Button
            component={Link} to={`/activities/${activity.id}`} 
            size="medium" 
            variant="contained"
            sx={{display: "flex", justifySelf: "self-end", borderRadius: 3}}
          >View</Button>
        </Box>
      </CardActions>  
    </Card>
  )
}
