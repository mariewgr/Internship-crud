import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Alert } from "@mui/material";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserRow";

type DialogDeleteProps = {
  open: boolean;
  isError: Error | undefined;
  setOpen: (bool: boolean) => void;
  deleteUser: (id: string) => void;
  isLoading: boolean | undefined;
  id: string;
};
export default function DialogDelete(p: DialogDeleteProps) {
  const { open, isError, setOpen, deleteUser, isLoading } = p;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const user = useContext(UserContext);

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="responsive-dialog-title"
    >
      {isError && (
        <Alert severity="error">This is an error alert — check it out!</Alert>
      )}
      <DialogTitle id="responsive-dialog-title">Delete User ?</DialogTitle>
      <DialogActions>
        <Link to={"/"}>
          <Button
            onClick={() => {
              deleteUser(user.id); //p.id
              setOpen(false);
            }}
            disabled={isLoading}
          >
            {" "}
            Confirmer{" "}
          </Button>
        </Link>
        <Button onClick={() => setOpen(false)}>Annuler</Button>
      </DialogActions>
    </Dialog>
  );
}
