import { Box, Button, Paper, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useParams } from "react-router";
import { activitySchema, type ActivitySchema } from "../../../lib/schemas/activitySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../../app/shared/components/TextInput";
import SelectInput from "../../../app/shared/components/SelectInput";
import { categoryOptions } from "./categoryOptions";
import DateTimeInput from "../../../app/shared/components/DateTimeInput";
import LocationInput from "../../../app/shared/components/LocationInput";

export default function ActivityForm() {
  const { id } = useParams();
  const { updateActivity, createActivity, activity, isLoadingActivity } = useActivities(id);
  const { control, reset, handleSubmit } = useForm<ActivitySchema>(
    {
      mode: "onTouched",
      resolver: zodResolver(activitySchema),
      defaultValues: {
        title: "",
        description: "",
        category: "",
        date: "",
        location: {
          venue: "",
          city: undefined,
          latitude: 0,
          longitude: 0
        }
      }
    }
  );

  useEffect(() => {
    if (activity) {
      // return reset(activity);
      reset({
        ...activity,
        date: activity.date ? activity.date.split("T")[0] : "",
        location: {
          venue: activity.venue,
          latitude: activity.latitude,
          longitude: activity.longitude,
          city: undefined
        },
      });
      // reset({
      //   ...activity,
      //   date: activity.date ? activity.date.split("T")[0] : ""
      // });
    }
  }, [activity, reset]);

  const onSubmit = (data: ActivitySchema) => {
    console.log(data)
  }

  if (isLoadingActivity) {
    return <Typography>Loading activity</Typography>
  }

  return (
    <Paper sx={{ borderRadius: 3, padding: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        {activity ? "Edit activity" : "Create activity"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={3}>
        <TextInput
          label="Title"
          name="title"
          control={control}
        />
        <TextInput
          label="Description"
          name="description"
          multiline
          rows={3}
          control={control}
        />
        <SelectInput
          name="category"
          label="Category"
          control={control}
          items={categoryOptions}
        />
        <DateTimeInput
          name="date"
          label="Date"
          control={control}
        />
        <LocationInput
          control={control}
          label="Enter the location"
          name="location"
        />
        <Box display="flex" justifyContent="end" gap={3}>
          <Button onClick={() => { }}
            color="inherit"
          >Cancel</Button>
          <Button
            type="submit"
            color="success"
            variant="contained"
            disabled={updateActivity.isPending || createActivity.isPending}
          >Submit</Button>
        </Box>
      </Box>
    </Paper>
  )
}
