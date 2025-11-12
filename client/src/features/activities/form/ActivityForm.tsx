import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import type { Activity } from "../../../lib/types";
import type { FormEvent } from "react";
import { useActivities } from "../../../lib/hooks/useActivities";

type Props = {
  activity?: Activity;
  closeForm: () => void;
}

export default function ActivityForm({
  activity,
  closeForm
}: Props) {
  const {updateActivity} = useActivities();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    if (activity) {
      data.id = activity.id;
      await updateActivity.mutateAsync(data as unknown as Activity);
      // console.log(data);
      closeForm();
    }
  }

  return (
    <Paper sx={{borderRadius: 3, padding: 3}}>
      <Typography variant="h5" gutterBottom color="primary">Create activity</Typography>
      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={3}>
        <TextField name="title" label="Title" defaultValue={activity?.title} />
        <TextField name="description" label="Description" defaultValue={activity?.description} multiline minRows={4} maxRows={5} />
        <TextField name="category" label="Category" defaultValue={activity?.category} />
        <TextField 
          name="date" 
          label="Date" 
          defaultValue={
            activity?.date 
            ?
            new Date(activity.date).toISOString().split('T')[0]
            :
            new Date().toISOString().split('T')[0]
          } 
          type="date" 
        />
        <TextField name="city" label="City" defaultValue={activity?.city} />
        <TextField name="venue" label="Venue" defaultValue={activity?.venue} />
        <Box display="flex" justifyContent="end" gap={3}>
          <Button onClick={closeForm} color="inherit">Cancel</Button>
          <Button 
            type="submit" 
            color="success" 
            variant="contained"
            disabled={updateActivity.isPending}
          >Submit</Button>
        </Box>
      </Box>
    </Paper>
  )
}
