import { Avatar, Box, Button, Chip, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import type { Profile } from "../../lib/types";
import { useAccount } from "../../lib/hooks/useAccount";
import { useProfile } from "../../lib/hooks/useProfile";

type Props = {
  profile: Profile;
}

export default function ProfileHeader(
  { profile }: Props
) {
  const { currentUser } = useAccount();
  const { updateFollow } = useProfile(profile.id);
  const toggleFollow = (id: string) => { updateFollow.mutate(id) }
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4, borderRadius: 3
      }}
    >
      <Grid container spacing={2}>
        <Grid size={8}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              src={profile?.imageUrl}
              sx={{
                width: 150,
                height: 150
              }}
              slotProps={{
                img: {
                  style: {
                    objectFit: "cover",
                    objectPosition: "top",
                  }
                }
              }}
            >
            </Avatar>
            <Box display="flex" flexDirection="column" gap={3}>
              <Typography
                variant="h4"
              >
                {profile?.displayName}
              </Typography>
              {
                profile.following
                &&
                <Chip
                  variant="outlined"
                  color="secondary"
                  label="Following"
                >
                </Chip>
              }
            </Box>
          </Stack>
        </Grid>
        <Grid
          size={4}
        >
          <Stack
            spacing={2}
            alignItems="center"
          >
            <Box
              display="flex"
              justifyContent="space-around"
              width="100%"
            >
              <Box
                textAlign="center"
              >
                <Typography
                  variant="h6"
                >Followers</Typography>
                <Typography
                  variant="h3"
                >{profile.followersCount}</Typography>
              </Box>
              <Box
                textAlign="center"
              >
                <Typography
                  variant="h6"
                >Following</Typography>
                <Typography
                  variant="h3"
                >{profile.followingsCount}</Typography>
              </Box>
            </Box>
            <Divider
              sx={{ width: "100%" }}
            ></Divider>
            {
              currentUser?.id != profile.id
              &&             
              <Button
                fullWidth
                variant="outlined"
                color={profile.following ? "error" : "success"}
                onClick={() => toggleFollow(profile.id)}
              >
                {profile.following ? "Unfollow" : "Follow"}
              </Button>
            }
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  )
}
