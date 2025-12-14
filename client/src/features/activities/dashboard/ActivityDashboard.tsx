import { Grid } from '@mui/material';
import ActivityList from './ActivityList';
import ActivityFilters from './ActivityFilters';
import { useActivities } from '../../../lib/hooks/useActivities';
import { observer } from 'mobx-react-lite';

const ActivityDashboard = observer(function ActivityDashboard() {
  const {
    activitiesGroup,
    fetchNextPage,
    hasNextPage,
    isPending
  } = useActivities();

  return (
    <>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <ActivityList
            activities={{
              activitiesGroup,
              fetchNextPage,
              hasNextPage,
              isPending,
            }}
          />
        </Grid>
        <Grid
          size={{ xs: 12, md: 4 }}
          sx={{
            position: "sticky",
            top: 14 * 8,
            alignSelf: "flex-start",
          }}
        >
          <ActivityFilters />
        </Grid>
      </Grid>
    </>
  );
});

export default ActivityDashboard;
