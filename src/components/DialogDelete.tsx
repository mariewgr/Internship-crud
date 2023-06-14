import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useContext } from "react";
import { Link } from "react-router-dom";
import UsersContext, { User } from "../contexts/UsersContext";

type DialogDeleteProps = {
  open: boolean;
  setOpen: (bool: boolean) => void;
  id: string;
  action: (userId: string) => Promise<unknown>;
};
export default function DialogDelete(p: DialogDeleteProps) {
  const { open, setOpen, action } = p;
  const { loadingMap } = useContext(UsersContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Confirm delete</DialogTitle>
      <DialogActions>
        <Button onClick={() => setOpen(false)} style={{ color: "grey" }}>
          Cancel
        </Button>
        <Link to={"/"}>
          <Button
            onClick={() => {
              action(p.id);
              setOpen(false);
            }}
            disabled={loadingMap.deleteUser}
            style={{ color: "red" }}
          >
            Delete
          </Button>
        </Link>
      </DialogActions>
    </Dialog>
  );
}
