import {
  Button,
  Fab,
  Dialog,
  Box,
  DialogActions,
  DialogTitle,
  TextField,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { Alert, Stack } from "@mui/material";
import { ChangeEvent, useContext, useRef, useState } from "react";
import UsersContext, { User } from "../contexts/UsersContext";
import ImageIcon from "@mui/icons-material/Image";
import { useTranslation } from "react-i18next";

type ImageUpdateProps = {
  openImage: boolean;
  setOpenImage: (openImage: boolean) => void;
  user: User;
};

export default function ImageUpdate(p: ImageUpdateProps) {
  const {
    errorMap,
    updateUser,
    loadingMap,
    openUpdateSuccess,
    setOpenUpdateSuccess,
  } = useContext(UsersContext);

  const [imageInput, setImageInput] = useState(p.user.imageUrl);
  const [wrongInput, setWrongInput] = useState(false);

  const { t } = useTranslation();

  const refImage = useRef(null);

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
        setOpenUpdateSuccess(true);
        p.setOpenImage(false);
      }
    } else {
      setWrongInput(true);
    }
    setTimeout(() => refImage.current?.focus(), 100);
  };

  const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImageInput(event.target.value);
  };

  return (
    <>
      <Fab
        onClick={() => {
          p.setOpenImage(true);
          refImage.current = document.activeElement;
        }}
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
      <Dialog
        open={p.openImage}
        onClose={() => {
          p.setOpenImage(false);
          setTimeout(() => refImage.current?.focus(), 200);
        }}
        aria-labelledby="responsive-dialog-title"
      >
        {errorMap.updateUser && (
          <Alert severity="error"> {t("noUpdateImage")}</Alert>
        )}

        <DialogTitle
          id="responsive-dialog-title"
          style={{
            textAlign: "center",
            verticalAlign: "text-bottom",
            padding: 0,
            marginTop: 10,
          }}
        >
          <Typography style={{ fontSize: 30 }}>{t("updateImage")}</Typography>
        </DialogTitle>
        <DialogActions
          style={{ minWidth: 300, justifyContent: "center", margin: 30 }}
        >
          <Stack spacing={3}>
            <TextField
              size="small"
              error={wrongInput}
              label={t("imageUrl")}
              placeholder={t("imageUrl")}
              onChange={handleImageInputChange}
              variant="outlined"
              defaultValue={p.user.imageUrl}
              helperText={wrongInput && t("notALink")}
              style={{ paddingBottom: 5 }}
            />
          </Stack>
        </DialogActions>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row-reverse",
            padding: 5,
          }}
        >
          <Button
            color="secondary"
            onClick={handleImageChange}
            disabled={loadingMap.updateUser}
            variant="contained"
            style={{ color: "white" }}
          >
            {t("submit")}
          </Button>
          <Button
            onClick={() => {
              p.setOpenImage(false);
              setTimeout(() => refImage.current?.focus(), 100);
            }}
            disabled={loadingMap.updateUser}
            variant="contained"
            style={{ marginRight: 7 }}
          >
            {t("cancel")}
          </Button>
        </Box>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openUpdateSuccess}
        autoHideDuration={3000}
        onClose={() => setOpenUpdateSuccess(false)}
      >
        <Alert
          onClose={() => setOpenUpdateSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {t("updateImageSuccess")}
        </Alert>
      </Snackbar>
    </>
  );
}
