import { Box, Typography } from "@mui/material";
import ActivityCard from "./ActivityCard";
import type { Activity } from "../../../lib/types";
import type { InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";

type Props = {
  activities: {
    activitiesGroup?: InfiniteData<{ items: Activity[]; nextCursor: string | null }>;
    fetchNextPage: InfiniteQueryObserverResult["fetchNextPage"];
    hasNextPage: boolean;
    isPending: boolean;
  }
};

const ActivityList = observer(function ActivityList({ activities }: Props) {
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
    <>
      {items.map((activity, index) => (
          <Box
            id={activity.id} 
            key={activity.id}
            ref={index === items.length - 1 ? ref : null}
            display="flex"
            alignSelf="flex-start"
          >
            <ActivityCard activity={activity} />
          </Box>
      ))}
    </>
  );
});

export default ActivityList;