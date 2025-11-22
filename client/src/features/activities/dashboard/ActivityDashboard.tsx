import { Container, Grid } from '@mui/material';
import ActivityList from './ActivityList';
import ActivityFilters from './ActivityFilters';

export default function ActivityDashboard() {
  return (
    <Container maxWidth="lg" sx={{mt: 3}}>
      <Grid container spacing={3}>
        <Grid size={{xs: 12, md: 7}}>
          <ActivityList />
        </Grid>
        <Grid size={{xs: 12, md: 5}}>
          <ActivityFilters />
        </Grid>
      </Grid>
    </Container>
  );
}
