import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useAccount } from '../../lib/hooks/useAccount';
import { Avatar, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router';

export default function UserMenu() {
  const navigate = useNavigate();
  const { logoutUser, currentUser } = useAccount();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const logOut = async () => {
    await logoutUser.mutateAsync();
  };

  return (
    <div>
      <Button
        color="inherit"
        size="large"
        onClick={handleClick}
        sx={{
          size: "1.1rem"
        }}
      >
        <Box display="flex" alignItems="center">
          <Avatar
            alt={currentUser?.displayName}
            src={currentUser?.imageUrl}
            sx={{ width: 75, height: 75, mr: 3 }}
            slotProps={{
              img: {
                style: {
                  objectFit: "cover",
                  objectPosition: "top",   // 👈 the key fix
                }
              }
            }}
          ></Avatar>
          {currentUser?.displayName}
        </Box>
      </Button>
      {
        currentUser
          ?
          (
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-button',
                },
              }}
            >
              <MenuItem
                component={Link}
                to={`/profiles/${currentUser.id}`}
                onClick={handleClose}
              >Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={logOut}>Logout</MenuItem>
            </Menu>
          )
          :
          (
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-button',
                },
              }}
            >
              <MenuItem onClick={() => {
                navigate("/login");
                handleClose();
              }}>Login</MenuItem>
              <MenuItem onClick={() => {
                navigate("/register");
                handleClose();
              }}>Register</MenuItem>
            </Menu>
          )
      }
    </div>
  );
}