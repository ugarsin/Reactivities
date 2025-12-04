import { Box, Button, Paper, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { activitySchema, type ActivitySchema } from "../../../lib/schemas/activitySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../../app/shared/components/TextInput";
import SelectInput from "../../../app/shared/components/SelectInput";
import { categoryOptions } from "./categoryOptions";
import DateTimeInput from "../../../app/shared/components/DateTimeInput";
import LocationInput from "../../../app/shared/components/LocationInput";
import dayjs from "dayjs";

export default function ActivityForm() {
  const navigate = useNavigate();
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
          city: "",
          latitude: 0,
          longitude: 0
        }
      }
    }
  );

  useEffect(() => {
    if (activity) {
      reset({
        ...activity,
        date: activity.date ? dayjs(activity.date).format("YYYY-MM-DDTHH:mm") : "",
        location: {
          venue: activity.venue,
          latitude: activity.latitude,
          longitude: activity.longitude,
          city: activity.city
        },
      });
    }
  }, [activity, reset]);

  const onSubmit = (data: ActivitySchema) => {
    const {location, ...rest} = data;
    const flattenedData = {...rest, ...location};
    try {
      if (activity) {
        updateActivity.mutate(
          {...activity, ...flattenedData},
          {
            onSuccess: () => navigate(`/activities/${activity.id}`)
          }
        );
      } else {
        createActivity.mutate(
          flattenedData,
          {
            onSuccess: (id) => navigate(`/activities/${id}`)
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
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
        <Box display="flex" gap={3}>
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
        </Box>
        <LocationInput
          control={control}
          label="Enter the location"
          name="location"
        />
        <Box display="flex" justifyContent="end" gap={3}>
          <Button onClick={() => 
            {
              if (id) {
                navigate(`/activities/${id}`);
              } else {
                navigate("/activities");
              }
            }
          }
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
