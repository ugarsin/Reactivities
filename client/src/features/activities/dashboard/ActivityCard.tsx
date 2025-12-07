import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Divider, Typography } from "@mui/material";
import type { Activity } from "../../../lib/types";
import { Link } from "react-router";
import { AccessTime, Place } from "@mui/icons-material";
import { formatDate } from "../../../lib/util/util";
import AvatarPopover from "../../../app/shared/components/AvatarPopover";

type Props = {
  activity: Activity;
}

export default function ActivityCard({ activity }: Props) {
  const label = activity.isHost ? "You are hosting" : "You are going";
  const color = activity.isHost ? "secondary" : activity.isGoing ? "warning" : "default";

  return (
    <Card sx={{ borderRadius: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <CardHeader
          avatar={
            <Avatar
              src={activity.hostImageUrl}
              sx={{ width: 80, height: 80 }}
              slotProps={{
                img: {
                  style: {
                    objectFit: "cover",
                    objectPosition: "top",   // 👈 the key fix
                  }
                }
              }}
              alt={`${activity.hostDisplayName}'s image`}
            />
          }
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
              Hosted by{" "} <Link to={`/profiles/${activity.hostId}`}>{activity.hostDisplayName}</Link>
            </>
          }
        />
        <Box display="flex" flexDirection="column" gap={2} mr={2}>
          {
            (activity.isHost || activity.isGoing)
            &&
            <Chip label={label} color={color} sx={{ borderRadius: 2 }} />
          }
          {
            (activity.isCancelled)
            &&
            <Chip label="Cancelled" color="error" sx={{ borderRadius: 2 }} />
          }
        </Box>
      </Box>
      <Divider sx={{ mb: 3 }}></Divider>
      <CardContent sx={{ p: 0 }}>
        <Box display="flex" alignItems="center" mb={2} px={2}>
          <Box display="flex" flexGrow={0} alignItems="center">
            <AccessTime sx={{ mr: 1 }}></AccessTime>
            <Typography variant="body2">{formatDate(activity.date)}</Typography>
          </Box>
          <Place sx={{ ml: 3, mr: 1 }} />
          <Typography variant="body2">{activity.venue}</Typography>
        </Box>
        <Divider></Divider>
        <Box display="flex" gap={2} sx={{ backgroundColor: "grey.200", py: 3, pl: 2 }}>
          {activity.attendees.map(att => (
            <AvatarPopover
              profile={att} key={att.id}
            ></AvatarPopover>
          ))}
        </Box>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "space-between", paddingBottom: 2 }}>
        <Typography variant="body2">{activity.description}</Typography>
        <Box sx={{ display: "flex", paddingRight: "6px" }} gap={2}>
          <Button
            component={Link} to={`/activities/${activity.id}`}
            size="medium"
            variant="contained"
            sx={{ display: "flex", justifySelf: "self-end", borderRadius: 3 }}
          >View</Button>
        </Box>
      </CardActions>
    </Card>
  )
}
