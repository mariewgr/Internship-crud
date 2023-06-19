import {
  Dialog,
  DialogTitle,
  DialogActions,
  useMediaQuery,
  useTheme,
  DialogContent,
  Snackbar,
} from "@material-ui/core";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { Link } from "react-router-dom";
import UsersContext from "../contexts/UsersContext";
import { Alert, Typography } from "@mui/material";

type DialogDeleteProps = {
  open: boolean;
  setOpen: (bool: boolean) => void;
  id: string;
  setOpenSucces: (bool: boolean) => void;
};
export default function DialogDelete(p: DialogDeleteProps) {
  const { open, setOpen } = p;
  const {
    loadingMap,
    errorMap,
    deleteUser,
    setOpenDeleteSuccess,
    openDeleteSucces,
  } = useContext(UsersContext);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle
          id="responsive-dialog-title"
          style={{
            minHeight: 50,
            textAlign: "center",
            padding: 0,
            fontStyle: "Helvetica",
          }}
        >
          Delete User
        </DialogTitle>
        <DialogContent style={{ fontStyle: "Helvetica" }}>
          <Typography>Are you sure you want to Delete ?</Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: "space-between" }}>
          <Button
            onClick={() => setOpen(false)}
            style={{ color: "grey" }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Link to={"/"}>
            <Button
              onClick={() => {
                deleteUser(p.id);
                if (!errorMap.deleteUser) {
                  setOpen(false);
                  p.setOpenSucces(true);
                }
              }}
              disabled={loadingMap.deleteUser}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openDeleteSucces}
        autoHideDuration={3000}
        onClose={() => setOpenDeleteSuccess(false)}
      >
        <Alert
          onClose={() => setOpenDeleteSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          User Deleted with success
        </Alert>
      </Snackbar>
    </>
  );
}
