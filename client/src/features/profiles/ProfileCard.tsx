import { Person } from "@mui/icons-material";
import { Box, Card, CardContent, CardMedia, Chip, Divider, Typography } from "@mui/material";
import { Link } from "react-router";
import type { Profile } from "../../lib/types";

type Props = {
  profile: Profile;
}

export default function ProfileCard({ profile }: Props) {
  const following = false;
  return (
    <Link
      to={`/profiles/${profile.id}`}
      style={{textDecoration: "none"}}
    >
      <Card
        sx={{borderRadius: 3, p: 3, maxWidth: 300, textDecoration: "none"}}
      >
        <CardMedia
          component="img"
          src={profile?.imageUrl || "/images/user.png"}
          alt={profile.displayName + " image"}
        />
        <CardContent>
          <Box
            display="flex" 
            alignItems="center"
            gap={1}
          >
            <Typography
              variant="h5"
            >
              {profile.displayName}
            </Typography>
            {
              following
              &&
              <Chip size="small" label="following" color="secondary" variant="outlined">
              </Chip> 
            }
          </Box>
        </CardContent>
        <Divider></Divider>
        <Box
          sx={{display: "flex", alignItems: "center", justifyContent: "start"}}
        >
          <Person></Person>
          <Typography sx={{ml: 1}}>20 Followers</Typography>
        </Box>
      </Card>
    </Link>
  )
}
