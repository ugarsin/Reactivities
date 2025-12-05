import * as React from 'react';
import Popover from '@mui/material/Popover';
import type { Profile } from '../../../lib/types';
import { Avatar } from '@mui/material';
import { Link } from 'react-router';
import ProfileCard from '../../../features/profiles/ProfileCard';

type Props = {
  profile: Profile
}

export default function AvatarPopover({ profile }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Avatar
        key={profile.id}
        alt={profile.displayName + " image"}
        src={profile.imageUrl}
        sx={{ width: 40, height: 40 }}
        slotProps={{
          img: {
            style: {
              objectFit: "cover",
              objectPosition: "top",   // 👈 the key fix
            }
          }
        }}
        component={Link}
        to={`/profiles/${profile.id}`}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <ProfileCard profile={profile}></ProfileCard>
      </Popover>
    </div>
  );
}
