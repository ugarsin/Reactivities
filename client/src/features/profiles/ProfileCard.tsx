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
      to={`/profiles/${profile?.id}`}
      style={{ textDecoration: "none" }}
    >
      <Card
        sx={{ borderRadius: 3, p: 3, maxWidth: 300, textDecoration: "none" }}
      >
        <CardMedia
          component="img"
          alt={profile.displayName + " image"}
          src={profile?.imageUrl || "/images/user.png"}
          sx={{
            width: 200,
            height: 200,
            objectFit: "cover",
            objectPosition: "top",
            borderRadius: 2, // optional
          }}
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
              {
                profile.displayName
                &&
                (
                  <Typography
                    variant="body2"
                    sx={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {profile.bio}
                  </Typography>
                )
              }
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
          sx={{ display: "flex", alignItems: "center", justifyContent: "start" }}
        >
          <Person></Person>
          <Typography sx={{ ml: 1 }}>20 Followers</Typography>
        </Box>
      </Card>
    </Link>
  )
}
