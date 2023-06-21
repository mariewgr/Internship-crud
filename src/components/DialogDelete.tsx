import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { Link } from "react-router-dom";
import UsersContext from "../contexts/UsersContext";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

type DialogDeleteProps = {
  open: boolean;
  setOpen: (bool: boolean) => void;
  id: string;
  object: any;
};
export default function DialogDelete(p: DialogDeleteProps) {
  const { open, setOpen } = p;
  const { loadingMap, errorMap, deleteUser, setOpenDeleteSuccess } =
    useContext(UsersContext);

  const { t } = useTranslation();

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setTimeout(() => p.object?.focus(), 100);
        }}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle
          id="responsive-dialog-title"
          style={{
            minHeight: 50,
            textAlign: "center",
            paddingTop: 20,
            fontStyle: "Helvetica",
          }}
        >
          {t("deleteUser")}
        </DialogTitle>
        <DialogContent style={{ fontStyle: "Helvetica" }}>
          <Typography style={{ paddingBottom: 10 }}>
            {" "}
            {t("deleteUserConfirmation")}
          </Typography>{" "}
        </DialogContent>
        <DialogActions style={{ justifyContent: "space-between" }}>
          <Button
            onClick={() => {
              setOpen(false);
              setTimeout(() => p.object?.focus(), 100);
            }}
            style={{ color: "grey" }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              deleteUser(p.id);
              if (!errorMap.deleteUser) {
                setOpen(false);
                setOpenDeleteSuccess(true);
              }
            }}
            disabled={loadingMap.deleteUser}
            color="error"
            variant="contained"
          >
            <Link to={"/"} style={{ color: "white" }}>
              {t("delete")}
            </Link>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
