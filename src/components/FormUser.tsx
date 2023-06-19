import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { ChangeEvent, useEffect, useState } from "react";
import { useLocalStore, StoreConfig } from "state-decorator";
import { Alert, Container, Snackbar, Stack } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { User } from "../contexts/UsersContext";
import { useTranslation } from "react-i18next";

export type Actions = {
  firstNameOnTextChange: (firstNameText: string) => void;
  lastNameOnTextChange: (lastNameText: string) => void;
  birthdateOnTextChange: (birthdateText: Dayjs | null) => void;
  imageUrlOnTextChange: (imageUrlText: string) => void;
  setRequireFirstName: (requireFirstName: string) => void;
  setRequireLastName: (requireLastName: string) => void;
  setRequireImageUrl: (requireImageUrl: string) => void;
};

export type State = {
  firstNameText: string;
  lastNameText: string;
  birthdateText: Dayjs | null;
  imageUrl: string;
  requireFirstName: boolean;
  requireLastName: boolean;
  requireImageUrl: boolean;
};

export const config: StoreConfig<State, Actions> = {
  getInitialState: () => ({
    firstNameText: "",
    lastNameText: "",
    birthdateText: null,
    imageUrl: "",
    requireFirstName: true,
    requireLastName: true,
    requireImageUrl: true,
  }),
  actions: {
    firstNameOnTextChange: ({ args: [firstNameText] }) => ({ firstNameText }),
    lastNameOnTextChange: ({ args: [lastNameText] }) => ({ lastNameText }),
    birthdateOnTextChange: ({ args: [birthdateText] }) => ({ birthdateText }),
    imageUrlOnTextChange: ({ args: [imageUrl] }) => ({ imageUrl }),
    setRequireFirstName: ({ args: [firstNameText] }) => ({
      requireFirstName: firstNameText !== "",
    }),
    setRequireLastName: ({ args: [lastNameText] }) => ({
      requireLastName: lastNameText !== "",
    }),
    setRequireImageUrl: ({ args: [imageUrl] }) => ({
      requireImageUrl:
        imageUrl.match(
          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
        ) !== null,
    }),
  },
};

export function validateForm(
  firstNameText: string,
  lastNameText: string,
  imageUrlText: string
) {
  return (
    firstNameText !== "" &&
    lastNameText !== "" &&
    imageUrlText.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    ) !== null
  );
}
type ModalUserProps = {
  action: (
    id: string,
    firstName: string,
    lastName: string,
    birthdate: Dayjs | null,
    imageUrl: string
  ) => Promise<User>;
  isError: undefined | Error;
  isLoading: boolean | undefined;
  showModal: (open: boolean) => void;
  open: boolean;
  user: User;
  title: string;
  messageSuccess: string;
};

export default function FormUser(p: ModalUserProps) {
  const { state: s, actions } = useLocalStore(config);

  const ariaLabel = { "aria-label": "description" };

  const [openSuccess, setOpenSucces] = useState(false);

  const { t } = useTranslation();

  const handleFirstNameTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    actions.firstNameOnTextChange(event.target.value);
  };

  const handleLastNameTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    actions.lastNameOnTextChange(event.target.value);
  };

  const handleBirthdateTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    actions.birthdateOnTextChange(dayjs(event.target.value));
  };

  const handleImageUrlTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    actions.imageUrlOnTextChange(event.target.value);
  };

  const handleAction = () => {
    actions.setRequireFirstName(s.firstNameText);
    actions.setRequireLastName(s.lastNameText);
    actions.setRequireImageUrl(s.imageUrl);
    if (validateForm(s.firstNameText, s.lastNameText, s.imageUrl)) {
      p.action(
        p.user.id,
        s.firstNameText,
        s.lastNameText,
        s.birthdateText,
        s.imageUrl
      );
      if (p.isError) {
        actions.firstNameOnTextChange(s.firstNameText);
        actions.lastNameOnTextChange(s.lastNameText);
        actions.birthdateOnTextChange(s.birthdateText);
        actions.imageUrlOnTextChange(s.imageUrl);
      } else {
        p.showModal(false);
        setOpenSucces(true);
      }
    }
  };

  useEffect(() => {
    actions.firstNameOnTextChange(p.user.firstName);
    actions.lastNameOnTextChange(p.user.lastName);
    actions.birthdateOnTextChange(p.user.birthdate);
    actions.imageUrlOnTextChange(p.user.imageUrl);
  }, []);

  return (
    <div>
      <Dialog
        open={p.open}
        onClose={() => p.showModal(false)}
        aria-labelledby="responsive-dialog-title"
      >
        {p.isError && (
          <Alert severity="error">This is an error alert — check it out!</Alert>
        )}
        <DialogTitle
          id="responsive-dialog-title"
          style={{
            textAlign: "center",
            verticalAlign: "text-bottom",
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          <p style={{ fontSize: 30 }}>{p.title}</p>
        </DialogTitle>
        <DialogActions
          style={{ minWidth: 320, minHeight: 300, justifyContent: "center" }}
        >
          <Stack
            component="form"
            sx={{
              width: "25ch",
              pt: 0,
            }}
            style={{ alignItems: "center", textAlign: "center" }}
            spacing={2}
            noValidate
            autoComplete="off"
          >
            <Stack
              style={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
              spacing={2}
            >
              {s.requireFirstName ? (
                <TextField
                  style={{ minWidth: 250 }}
                  label={t("firstname")}
                  placeholder={t("firstname")}
                  inputProps={ariaLabel}
                  onChange={handleFirstNameTextChange}
                  variant="outlined"
                  defaultValue={p.user.firstName}
                />
              ) : (
                <TextField
                  required
                  error
                  style={{ minWidth: 250 }}
                  label={t("firstname")}
                  placeholder={t("firstname")}
                  inputProps={ariaLabel}
                  onChange={handleFirstNameTextChange}
                  variant="outlined"
                  helperText="Required"
                  defaultValue={p.user.lastName}
                />
              )}
              {s.requireLastName ? (
                <TextField
                  style={{ minWidth: 250 }}
                  label={t("lastname")}
                  placeholder={t("lastname")}
                  inputProps={ariaLabel}
                  onChange={handleLastNameTextChange}
                  variant="outlined"
                  defaultValue={p.user.lastName}
                />
              ) : (
                <TextField
                  error
                  required
                  style={{ minWidth: 250 }}
                  label={t("lastname")}
                  placeholder={t("lastname")}
                  inputProps={ariaLabel}
                  onChange={handleLastNameTextChange}
                  variant="outlined"
                  helperText="Required"
                  defaultValue={p.user.lastName}
                />
              )}
              {p.user.birthdate === null ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ minWidth: 250 }}
                    label={t("birthdate")}
                    onChange={handleBirthdateTextChange}
                  />
                </LocalizationProvider>
              ) : (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ minWidth: 250 }}
                    label={t("birthdate")}
                    onChange={handleBirthdateTextChange}
                    defaultValue={dayjs(p.user.birthdate) as undefined}
                  />
                </LocalizationProvider>
              )}
              {s.requireImageUrl ? (
                <TextField
                  style={{ minWidth: 250 }}
                  label={t("imageUrl")}
                  placeholder={t("imageUrl")}
                  inputProps={ariaLabel}
                  onChange={handleImageUrlTextChange}
                  variant="outlined"
                  defaultValue={p.user.imageUrl}
                />
              ) : (
                <TextField
                  error
                  style={{ minWidth: 250 }}
                  label={t("imageUrl")}
                  placeholder={t("imageUrl")}
                  inputProps={ariaLabel}
                  onChange={handleImageUrlTextChange}
                  variant="outlined"
                  helperText={t("notALink")}
                  defaultValue={p.user.imageUrl}
                />
              )}
            </Stack>
          </Stack>
        </DialogActions>
        <Container
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 5,
          }}
        >
          <Button
            onClick={() => {
              p.showModal(false);
            }}
            disabled={p.isLoading}
            variant="outlined"
          >
            {t("cancel")}
          </Button>
          <Button
            color="secondary"
            className="submit"
            onClick={handleAction}
            disabled={p.isLoading}
            variant="contained"
            style={{
              color: "white",
            }}
          >
            {t("submit")}
          </Button>
        </Container>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSuccess}
        autoHideDuration={3000}
        onClose={() => setOpenSucces(false)}
      >
        <Alert
          onClose={() => setOpenSucces(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {p.messageSuccess}
        </Alert>
      </Snackbar>
    </div>
  );
}
