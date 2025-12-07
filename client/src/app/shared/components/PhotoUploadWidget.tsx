import { CloudUpload } from "@mui/icons-material";
import { Box, Typography, Button } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper, { type ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import Grid from "@mui/material/Grid";
import type { Photo } from "../../../lib/types";
import { useNavigate } from "react-router";
import { useAccount } from "../../../lib/hooks/useAccount";

type PhotoUploadWidgetProps = {
  uploadPhoto: (file: Blob) => Promise<Photo>;
  onUploaded: () => void;
};

export default function PhotoUploadWidget(
  {
    uploadPhoto,
    onUploaded
  }: PhotoUploadWidgetProps
) {
  const [files, setFiles] = useState<(File & { preview: string })[]>([]);
  const cropperRef = useRef<ReactCropperElement>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    }
  }, [files]);

  const { currentUser } = useAccount();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      )
    );
    setCroppedImage(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas();
    setCroppedImage(canvas.toDataURL());
  };

  const base64ToBlob = (base64: string): Blob => {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }

    return new Blob([new Uint8Array(byteArrays)], { type: "image/jpeg" });
  };

  const handleUpload = async () => {
    if (!croppedImage) return;

    const blob = base64ToBlob(croppedImage);

    await uploadPhoto(blob); // call mutation

    // Clear UI
    resetUI();
  };

  const handleUploadFullImage = async (file: Blob) => {
    if (!(file instanceof Blob)) return;
    await uploadPhoto(file);
    resetUI();
  };

  const resetUI = () => {
    setFiles([]);
    setCroppedImage(null);
    onUploaded();
  };

  return (
    <Grid
      component="div"
      container
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
        gap: 3,
        mt: 1
      }}
    >
      {/* STEP 1 */}
      <Grid component="div">
        <Typography variant="overline" color="secondary">
          Step 1 — Add a photo
        </Typography>

        <Box
          {...getRootProps()}
          sx={{
            border: "dashed 2px #eee",
            borderColor: isDragActive ? "green" : "#eee",
            borderRadius: "10px",
            paddingTop: "20px",
            textAlign: "center",
            height: "280px",
            cursor: "pointer",
          }}
        >
          <input {...getInputProps()} />
          <CloudUpload sx={{ fontSize: 60 }} />
          <Typography variant="h6">Drop image here</Typography>

          {files[0] && (
            <img
              src={files[0].preview}
              alt="preview"
              style={{ width: "90%", marginTop: "10px", borderRadius: 5 }}
            />
          )}
        </Box>
      </Grid>

      {/* STEP 2 */}
      <Grid component="div">
        <Typography variant="overline" color="secondary">
          Step 2 — Resize
        </Typography>

        {files[0] ? (
          <div style={{ width: "100%", height: "100%" }}>   {/* FIXED HEIGHT */}
            <Button
              variant="contained"
              fullWidth sx={{ mb: 2 }}
              onClick={() => {
                  handleUploadFullImage(files[0]);
                  navigate(`/profiles/${currentUser?.id}`)
                }
              }
            >
              Upload full sized image
            </Button>
            <Cropper
              src={files[0].preview}
              style={{ width: "100%", height: "100%" }}
              viewMode={1}
              guides={false}
              background={false}
              autoCropArea={1}
              aspectRatio={undefined}
              ref={cropperRef}
              ready={() => {
                const cropper = cropperRef.current?.cropper;
                if (!cropper) return;

                const data = cropper.getImageData();
                cropper.setCropBoxData({
                  left: data.left,
                  top: data.top,
                  width: data.width,
                  height: data.height
                });
              }}
            />
          </div>
        ) : (
          <Typography>No image selected</Typography>
        )}
      </Grid>

      {/* STEP 3 */}
      <Grid component="div">
        <Typography variant="overline" color="secondary">
          Step 3 — Upload
        </Typography>

        {files[0] && (
          <>
            <Button variant="contained" fullWidth sx={{ mt: 1 }} onClick={handleCrop}>
              Crop Image
            </Button>
          </>
        )}

        {croppedImage && (
          <>
            <Typography mt={2}>Cropped Image Preview:</Typography>
            <img
              src={croppedImage}
              alt="cropped"
              style={{ width: "100%", borderRadius: 5, marginTop: 10 }}
            />

            <Button
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleUpload}
            >
              Upload
            </Button>
          </>
        )}
      </Grid>
    </Grid>
  );
}
