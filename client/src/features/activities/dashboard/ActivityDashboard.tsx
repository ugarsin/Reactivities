import { Grid } from '@mui/material';
import ActivityList from './ActivityList';
import ActivityFilters from './ActivityFilters';
import { useActivities } from '../../../lib/hooks/useActivities';

export default function ActivityDashboard() {
  const {
    activitiesGroup,
    fetchNextPage,
    hasNextPage,
    isPending
  } = useActivities();

  return (
    // <>
    //   {/* <Container
    //     maxWidth={false}
    //     sx={{
    //       width: "100%",
    //       backgroundColor: "#f4f4f4",
    //     }}
    //   >
    //     <Button
    //       variant="contained"
    //       onClick={() => fetchNextPage()}
    //     >Load more...</Button>
    //   </Container> */}
    //   <Box
    //     sx={{
    //       width: "100%",
    //       backgroundColor: "red",
    //       py: 2
    //     }}
    //   >
    //     {/* This centers the entire activity grid */}
    //     <Box
    //       sx={{
    //         maxWidth: "1600px",   // the centered container size
    //         mx: "auto"            // <- center horizontally
    //       }}
    //     >
    //       <Grid container spacing={3}>
    //         {/* LEFT SIDE – 70% */}
    //         <Grid size={{ xs: 12, md: 8 }}>
    //           <Box sx={{ maxWidth: "1120px", width: "100%" }}>
    //             <ActivityList
    //               activities={{
    //                 activitiesGroup,
    //                 fetchNextPage,
    //                 hasNextPage,
    //                 isPending,
    //               }}
    //             />
    //           </Box>
    //         </Grid>
    //         {/* RIGHT SIDE – 30% */}
    //         <Grid
    //           size={{ xs: 12, md: 4 }}
    //           sx={{
    //             px: 2,
    //             position: "sticky",
    //             top: 14 * 8,
    //             alignSelf: "flex-start",
    //           }}
    //         >
    //           <ActivityFilters />
    //         </Grid>
    //       </Grid>
    //     </Box>
    //   </Box>
    // </>
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
}
