import {
  Button,
  Dialog,
  Box,
  DialogActions,
  DialogTitle,
  TextField,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { Alert, Stack } from "@mui/material";
import { ChangeEvent, useContext, useState } from "react";
import UsersContext, { User } from "../contexts/UsersContext";
import { useTranslation } from "react-i18next";

type ImageUpdateProps = {
  user: User;
  activeObject: any;
};

export default function ImageUpdate(p: ImageUpdateProps) {
  const {
    errorMap,
    updateUser,
    loadingMap,
    openUpdateImageSuccess,
    setOpenUpdateImageSuccess,
    setOpenUpdateImageModal,
    openUpdateImageModal,
  } = useContext(UsersContext);

  const { user, activeObject } = p;

  const [imageInput, setImageInput] = useState(p.user.imageUrl);
  const [isVerifiedImage, setIsVerifiedImage] = useState(false);

  const { t } = useTranslation();

  const handleImageChange = () => {
    if (
      imageInput.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      ) !== null
    ) {
      updateUser(
        user.id,
        user.firstName,
        user.lastName,
        user.birthdate,
        imageInput
      );
      setIsVerifiedImage(true);

      if (!errorMap.updateUser) {
        setOpenUpdateImageSuccess(true);
        setOpenUpdateImageModal(false);
        setTimeout(() => activeObject?.focus(), 100);
      }
    } else {
      setIsVerifiedImage(false);
    }
  };

  const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImageInput(event.target.value);
  };

  return (
    <>
      <Dialog
        open={openUpdateImageModal}
        onClose={() => {
          setOpenUpdateImageModal(false);
          setTimeout(() => activeObject?.focus(), 200);
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
              error={isVerifiedImage}
              label={t("imageUrl")}
              placeholder={t("imageUrl")}
              onChange={handleImageInputChange}
              variant="outlined"
              defaultValue={user.imageUrl}
              helperText={isVerifiedImage && t("notALink")}
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
              setOpenUpdateImageModal(false);
              setTimeout(() => activeObject?.focus(), 100);
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
        open={openUpdateImageSuccess}
        autoHideDuration={3000}
        onClose={() => setOpenUpdateImageSuccess(false)}
      >
        <Alert
          onClose={() => setOpenUpdateImageSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {t("updateImageSuccess")}
        </Alert>
      </Snackbar>
    </>
  );
}
