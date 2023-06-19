import {
  Button,
  Fab,
  Dialog,
  Box,
  DialogActions,
  DialogTitle,
  TextField,
  Snackbar,
} from "@material-ui/core";
import { Alert, Stack } from "@mui/material";
import { ChangeEvent, useContext, useState } from "react";
import UsersContext, { User } from "../contexts/UsersContext";
import ImageIcon from "@mui/icons-material/Image";

type ImageUpdateProps = {
  openImage: boolean;
  setOpenImage: (openImage: boolean) => void;
  user: User;
};

export default function ImageUpdate(p: ImageUpdateProps) {
  const { errorMap, updateUser, loadingMap } = useContext(UsersContext);

  const [imageInput, setImageInput] = useState(p.user.imageUrl);
  const [wrongInput, setWrongInput] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const handleImageChange = () => {
    if (
      imageInput.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      ) !== null
    ) {
      updateUser(
        p.user.id,
        p.user.firstName,
        p.user.lastName,
        p.user.birthdate,
        imageInput
      );
      setWrongInput(false);

      if (!errorMap.updateUser) {
        setOpenSuccess(true);
        p.setOpenImage(false);
      }
    } else {
      setWrongInput(true);
    }
  };

  const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImageInput(event.target.value);
  };

  return (
    <>
      <Button
        onClick={() => p.setOpenImage(true)}
        style={{
          borderRadius: 10,
        }}
      >
        <Fab
          color="secondary"
          className="edit"
          aria-label="image"
          style={{
            color: "white",
            position: "fixed",
            top: 75,
            right: 85,
          }}
        >
          <ImageIcon />
        </Fab>
      </Button>
      <Dialog
        open={p.openImage}
        onClose={() => p.setOpenImage(false)}
        aria-labelledby="responsive-dialog-title"
      >
        {errorMap.updateUser && (
          <Alert severity="error">Could not update Image</Alert>
        )}

        <DialogTitle
          id="responsive-dialog-title"
          style={{
            textAlign: "center",
            verticalAlign: "text-bottom",
            paddingTop: 0,
          }}
        >
          <p style={{ fontSize: 30 }}>Update Image</p>
        </DialogTitle>
        <DialogActions style={{ minWidth: 300, justifyContent: "center" }}>
          <Stack spacing={3}>
            {wrongInput ? (
              <TextField
                error
                label="Image URL*"
                placeholder="Image URL*"
                onChange={handleImageInputChange}
                variant="outlined"
                defaultValue={p.user.imageUrl}
              />
            ) : (
              <TextField
                label="Image URL*"
                placeholder="Image URL*"
                onChange={handleImageInputChange}
                variant="outlined"
                defaultValue={p.user.imageUrl}
              />
            )}
            <Box
              style={{
                display: "flex",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() => p.setOpenImage(false)}
                disabled={loadingMap.updateUser}
                variant="contained"
                style={{ marginRight: 7 }}
              >
                Cancel
              </Button>
              <Button
                color="secondary"
                onClick={handleImageChange}
                disabled={loadingMap.updateUser}
                variant="contained"
                style={{ color: "white" }}
              >
                Submit
              </Button>
            </Box>
          </Stack>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSuccess}
        autoHideDuration={3000}
        onClose={() => setOpenSuccess(false)}
      >
        <Alert
          onClose={() => setOpenSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          User Image Update
        </Alert>
      </Snackbar>
    </>
  );
}
