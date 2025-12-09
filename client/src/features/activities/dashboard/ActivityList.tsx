import { Box, Typography } from "@mui/material";
import ActivityCard from "./ActivityCard";
import type { Activity } from "../../../lib/types";
import type { InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

type Props = {
  activities: {
    activitiesGroup?: InfiniteData<{ items: Activity[]; nextCursor: string | null }>;
    fetchNextPage: InfiniteQueryObserverResult["fetchNextPage"];
    hasNextPage: boolean;
    isPending: boolean;
  }
};

export default function ActivityList({ activities }: Props) {
  const { 
    activitiesGroup, 
    fetchNextPage, 
    hasNextPage, 
    isPending 
  } = activities;
 	const { ref, inView } = useInView({
		threshold: 0.5
	});

	useEffect(() => {
		if (inView && hasNextPage) {
      fetchNextPage();
    }
	}, [inView, hasNextPage, fetchNextPage]);
 
  if (isPending) return <Typography>Loading...</Typography>;

  const items: Activity[] =
    activitiesGroup?.pages.flatMap(page => page.items) ?? [];

  return (
    // <Box 
    //   sx={{ 
    //     display: "flex", 
    //     flexDirection: "column", 
    //     gap: 3 
    //   }}
    // >
    <>
      {items.map((activity, index) => (
        // <Card sx={{position: "relative", background: "blue"}}>
        // </Card>
          <Box
            id={activity.id} 
            key={index}
            ref={index === items.length - 1 ? ref : null}
            display="flex"
            alignSelf="flex-start"
            // sx={{background: "blue"}}
          >
            <ActivityCard activity={activity} />
          </Box>
      ))}
      </>
  );
}
