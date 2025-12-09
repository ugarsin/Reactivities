import { AppBar, Box, CircularProgress, Container, Toolbar, Typography } from "@mui/material";
import { Group } from "@mui/icons-material";
import { NavLink } from "react-router";
import MenuItemLink from "../shared/components/MenuItemLink";
import { useStore } from "../../lib/hooks/useStore";
import { Observer } from "mobx-react-lite";
import UserMenu from "./UserMenu";

export default function NavBar() {
	const { uiStore } = useStore();
	
	return (
		<>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar
					position="fixed"
					sx={{
						backgroundImage: "linear-gradient(135deg, #182173 0%, #218aae 69%, #20a7ac 89%)",
						position: "fixed"
					}}
				>
					<Container 
						maxWidth="xl"
					>
						<Toolbar
							sx={{
								display: "flex",
								justifyContent: "space-between"
							}}
						>
							<Box
								overflow="visible"
								component={NavLink}
								to="/"
								sx={{
									display: "flex",
									gap: 2,
									alignItems: "center",
									textDecoration: "none",
									color: "inherit"
								}}
							>
								<Group fontSize="large" />
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 5
									}}
								>
									<Typography variant="h4" fontWeight="bold">
										Reactivities
									</Typography>
									<Box sx={{ width: 22 }}>
										{/* <CircularProgress size={50} sx={{ color: "yellow" }} /> */}
										<Observer>
											{() =>
												uiStore.isLoading
													?
													<CircularProgress
														size={20}
														thickness={7}
														sx={{ color: "white" }}
													/>
													:
													null
											}
										</Observer>
									</Box>
								</Box>
							</Box>
							<Box
								sx={{ display: "flex", alignItems: "center" }}
							>
								<MenuItemLink to="/activities">
									ACTIVITIES
								</MenuItemLink>
								<MenuItemLink to="/createActivity">
									CREATE ACTIVITY
								</MenuItemLink>
								<MenuItemLink to="/counter">
									COUNTER
								</MenuItemLink>
								<MenuItemLink to="/errors">
									ERRORS
								</MenuItemLink>
							</Box>
							<UserMenu></UserMenu>
						</Toolbar>
					</Container>
				</AppBar>
			</Box>
		</>
	)
}
