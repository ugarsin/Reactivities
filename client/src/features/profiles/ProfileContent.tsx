import { Box, Paper, Tab, Tabs } from "@mui/material";
import { useState, type SyntheticEvent } from "react";
import ProfilePhotos from "./ProfilePhotos";
import ProfileAbout from "./ProfileAbout";
import ProfileActivities from "./ProfileActivities";

export default function ProfileContent() {
  const handlePhotoUploaded = () => {
    setValue(1); // Switch to Photos tab
  };
  const [value, setValue] = useState(0);
  const tabContent = [
    { label: "About", content: <ProfileAbout></ProfileAbout> },
    { label: "Photos", content: <ProfilePhotos onPhotoUploaded={handlePhotoUploaded} /> },
    { label: "Events", content: < ProfileActivities /> },
    { label: "Followers", content: <div>Followers</div> },
    { label: "Following", content: <div>Following</div> }
  ]

  const handleChange = (_: SyntheticEvent, newValue: number,) => {
    setValue(newValue);
  }

  return (
    <Box
      component={Paper}
      mt={2}
      mb={2}
      p={3}
      elevation={3}
      height={500}
      sx={{
        display: "flex",
        borderRadius: 3
      }}
    >
      {/* Tabs Section (e.g., 25% of width) */}
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        sx={{
          width: "10%",     // 👈 give this a fixed percentage
          borderRight: 1,
          height: 450,
        }}
      >
        {tabContent.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      {/* Content Section (e.g., 75% of width) */}
      <Box
        sx={{
          width: "90%",     // 👈 remaining width
          p: 3,
          overflow: "auto"  // helps if content is large
        }}
      >
        {tabContent[value].content}
      </Box>
    </Box>
  );
}
