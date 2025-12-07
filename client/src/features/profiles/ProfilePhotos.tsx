import { Box, Button, Divider, ImageList, ImageListItem, Typography } from "@mui/material";
import { useParams } from "react-router";
import { useProfile } from "../../lib/hooks/useProfile";
import { useState } from "react";
import PhotoUploadWidget from "../../app/shared/components/PhotoUploadWidget";
import { Star, StarBorder } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ProfilePhotos({ onPhotoUploaded }: { onPhotoUploaded: () => void }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const { id } = useParams();
  const {
    photos,
    loadingPhotos,
    isCurrentUser,
    uploadPhoto,
    setMainPhoto,
    deletePhoto
  } = useProfile(id);
  const [editMode, setEditMode] = useState(false);
  const handleUploaded = () => {
    setEditMode(false);     // close upload mode
    onPhotoUploaded();      // notify parent to switch tabs
  };

  if (loadingPhotos) return <Typography>Loading photos...</Typography>
  if (!photos) return <Typography>No photos found for this user</Typography>

  return (
    <>
      <Box>
        <Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h5" sx={{ fontWeight: "bold", fontStyle: "italic", gap: "2" }}>Photos</Typography>
            {
              isCurrentUser
              &&
              <Button
                variant="contained"
                disabled={!isCurrentUser}
                onClick={() => { setEditMode(!editMode); }}
              >{editMode ? "Cancel" : "Add photo"}</Button>
            }
          </Box>
        </Box>
        <Divider sx={{ my: 2 }}></Divider>
        {
          photos.length === 0
          &&
          (
            editMode
              ?
              <></>
              :
              <>
                <Typography>No photos added for this profile</Typography>
              </>
          )
        }
        {
          editMode
            ?
            <PhotoUploadWidget uploadPhoto={uploadPhoto.mutateAsync} onUploaded={handleUploaded} />
            :
            <ImageList sx={{ display: "flex", gap: "8px" }}>
              {
                photos.map(
                  photo =>
                  (
                    <ImageListItem key={photo.id} sx={{ width: "200px" }}>
                      <img src={photo.url} style={{ width: "100%" }} />
                      {
                        isCurrentUser
                        &&
                        (
                          <Button
                            onClick={() => setMainPhoto.mutate(photo.id)}
                            sx={{
                              position: "absolute",
                              top: 5,
                              left: 5,
                              minWidth: "auto",
                              p: 0.5,
                              bgcolor: "rgba(0,0,0,0.4)",
                              color: "white",
                              borderRadius: "50%"
                            }}
                          >
                            {
                              photo.isMain
                                ?
                                (
                                  <Star sx={{ color: "gold" }} />
                                ) :
                                (
                                  <StarBorder sx={{ color: "white" }} />
                                )
                            }
                          </Button>
                        )
                      }
                      {/* Delete button (hidden on main photo) */}
                      {
                        isCurrentUser
                        &&
                        !photo.isMain
                        &&
                        (
                          <IconButton
                            onClick={() => {
                              setSelectedPhotoId(photo.id);
                              setConfirmOpen(true);
                            }
                            }
                            sx={{
                              position: "absolute",
                              top: 5,
                              right: 5,
                              backgroundColor: "rgba(0,0,0,0.4)",
                              color: "red",
                              "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.7)"
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )
                      }
                    </ImageListItem>
                  )
                )
              }
            </ImageList>
        }
      </Box>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle>Delete Photo</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this photo? This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            No
          </Button>

          <Button
            onClick={() => {
              if (selectedPhotoId) deletePhoto.mutate(selectedPhotoId);
              setConfirmOpen(false);
            }}
            color="error"
            variant="contained"
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
