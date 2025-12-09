import { FilterList, Event } from "@mui/icons-material";
import { Box, Card, ListItemText, MenuItem, MenuList, Paper, Stack, Typography } from "@mui/material";
import "react-calendar/dist/Calendar.css"
import "./Mycalendaroverrides.css"
import { Calendar } from "react-calendar"

export default function ActivityFilters() {
  return (
    <Card sx={{ display: "flex", direction: "column", gap: 3, borderRadius: 3, width: "100%", background: "transparent" }}>
      <Stack spacing={3} sx={{width: "100%"}}>
        <Box component={Paper} sx={{ width: "100%", p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center", mb: 1, color: "primary.main" }}>
            <FilterList sx={{ mr: 1 }} />Filters
          </Typography>
          <MenuList>
            <MenuItem>
              <ListItemText primary="All events"></ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemText primary="I'm going"></ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemText primary="I'm hosting"></ListItemText>
            </MenuItem>
          </MenuList>
        </Box>
        <Box component={Paper} sx={{ width: "100%", p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center", mb: 1, color: "primary.main" }}>
            <Event sx={{ mr: 1 }} />Select date
          </Typography>
          <Calendar></Calendar>
        </Box>
      </Stack>
    </Card>
  )
}
