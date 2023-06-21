import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import { ChangeEvent } from "react";
import { useLocalStore, StoreConfig } from "state-decorator";
import { Alert, Container, Stack } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { User } from "../contexts/UsersContext";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { setArgIn } from "state-decorator/helpers";

type ModalUserProps = {
  submitAction: (
    id: string,
    firstName: string,
    lastName: string,
    birthdate: Dayjs | null,
    imageUrl: string
  ) => Promise<User>;
  isError: boolean;
  isLoading: boolean;
  setOpenModal: (open: boolean) => void;
  openModal: boolean;
  user: User;
  title: string;
  messageSuccess: string;
  messageError: string;
  activeObject: any;
};

type Props = ModalUserProps;

export type Actions = {
  firstNameOnTextChange: (firstNameInput: string) => void;
  lastNameOnTextChange: (lastNameInput: string) => void;
  birthdateOnTextChange: (birthdateInput: Dayjs | null) => void;
  imageUrlOnTextChange: (imageUrlInput: string) => void;
  setFirstName: (FirstName: string) => void;
  setLastName: (LastName: string) => void;
  setImageUrl: (ImageUrl: string) => void;
};

export type State = {
  firstNameInput: string;
  lastNameInput: string;
  birthdateInput: Dayjs | null;
  imageUrlInput: string;
  isVerifiedFirstName: boolean;
  isVerifiedLastName: boolean;
  isVerifiedImageUrl: boolean;
};

export const config: StoreConfig<State, Actions, Props> = {
  getInitialState: (p) => ({
    firstNameInput: p.user.firstName,
    lastNameInput: p.user.lastName,
    birthdateInput: p.user.birthdate,
    imageUrlInput: p.user.imageUrl,
    isVerifiedFirstName: true,
    isVerifiedLastName: true,
    isVerifiedImageUrl: true,
  }),
  actions: {
    firstNameOnTextChange: setArgIn("firstNameInput"),
    lastNameOnTextChange: setArgIn("lastNameInput"),
    birthdateOnTextChange: setArgIn("birthdateInput"),
    imageUrlOnTextChange: setArgIn("imageUrlInput"),
    setFirstName: ({ args: [firstNameInput] }) => ({
      isVerifiedFirstName: firstNameInput !== "",
    }),
    setLastName: ({ args: [lastNameInput] }) => ({
      isVerifiedLastName: lastNameInput !== "",
    }),
    setImageUrl: ({ args: [imageUrlInput] }) => ({
      isVerifiedImageUrl:
        imageUrlInput !== null &&
        imageUrlInput.match(
          /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
        ) !== null,
    }),
  },
};

export function validateForm(
  firstNameInput: string,
  lastNameInput: string,
  imageUrlInput: string
) {
  const validateImageUrl =
    imageUrlInput !== null &&
    imageUrlInput.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    ) !== null;
  return firstNameInput !== "" && lastNameInput !== "" && validateImageUrl;
}

export default function FormUser(p: ModalUserProps) {
  const { state: s, actions } = useLocalStore(config, p);

  const ariaLabel = { "aria-label": "description" };

  const { t } = useTranslation();

  const handleFirstNameInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    actions.firstNameOnTextChange(event.target.value);
  };

  const handleLastNameInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    actions.lastNameOnTextChange(event.target.value);
  };

  const handleBirthdateInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    actions.birthdateOnTextChange(dayjs(event as undefined));
  };

  const handleImageUrlInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    actions.imageUrlOnTextChange(event.target.value);
  };

  const handleAction = () => {
    actions.setFirstName(s.firstNameInput);
    actions.setLastName(s.lastNameInput);
    actions.setImageUrl(s.imageUrlInput);
    if (validateForm(s.firstNameInput, s.lastNameInput, s.imageUrlInput)) {
      p.submitAction(
        p.user.id,
        s.firstNameInput,
        s.lastNameInput,
        s.birthdateInput,
        s.imageUrlInput
      );
      if (!p.isError) {
        p.setOpenModal(false);
        setTimeout(() => p.activeObject?.focus(), 100);
      }
    }
  };
  return (
    <Dialog
      open={p.openModal}
      onClose={() => {
        p.setOpenModal(false);
        setTimeout(() => p.activeObject?.focus(), 200);
      }}
      aria-labelledby="responsive-dialog-title"
    >
      {p.isError && <Alert severity="error">{p.messageError}</Alert>}
      <DialogTitle
        id="responsive-dialog-title"
        style={{
          textAlign: "center",
          verticalAlign: "text-bottom",
          padding: 0,
          marginTop: 10,
        }}
      >
        <Typography style={{ fontSize: 30 }}>{p.title}</Typography>
      </DialogTitle>
      <DialogActions
        style={{
          minWidth: 420,
          minHeight: 400,
          justifyContent: "center",
          padding: 0,
        }}
      >
        <Stack
          component="form"
          sx={{
            width: "25ch",
            pt: 0,
          }}
          style={{ alignItems: "center", textAlign: "center" }}
          spacing={2}
        >
          <Stack
            style={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
            }}
            spacing={3}
          >
            <TextField
              required
              size="small"
              error={!s.isVerifiedFirstName}
              label={t("firstname")}
              placeholder={t("firstname")}
              inputProps={ariaLabel}
              onChange={handleFirstNameInputChange}
              variant="outlined"
              helperText={!s.isVerifiedFirstName && t("required")}
              defaultValue={p.user.firstName}
            />
            <TextField
              error={!s.isVerifiedLastName}
              required
              size="small"
              label={t("lastname")}
              placeholder={t("lastname")}
              inputProps={ariaLabel}
              onChange={handleLastNameInputChange}
              variant="outlined"
              helperText={!s.isVerifiedLastName && t("required")}
              defaultValue={p.user.lastName}
            />
            <DatePicker
              size="small"
              label={t("birthdate")}
              onChange={handleBirthdateInputChange}
              defaultValue={
                p.user.birthdate === null
                  ? null
                  : (dayjs(p.user.birthdate) as undefined)
              }
            />
            <TextField
              required
              error={!s.isVerifiedImageUrl}
              size="small"
              label={t("imageUrl")}
              placeholder={t("imageUrl")}
              inputProps={ariaLabel}
              onChange={handleImageUrlInputChange}
              variant="outlined"
              helperText={!s.isVerifiedImageUrl && t("notALink")}
              defaultValue={p.user.imageUrl}
            />
          </Stack>
        </Stack>
      </DialogActions>
      <Container
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row-reverse",
          padding: 5,
        }}
      >
        <Button
          color="secondary"
          onClick={handleAction}
          disabled={p.isLoading}
          variant="contained"
          style={{
            color: "white",
          }}
        >
          {t("submit")}
        </Button>
        <Button
          onClick={() => {
            p.setOpenModal(false);
            setTimeout(() => p.activeObject?.focus(), 100);
          }}
          disabled={p.isLoading}
          variant="outlined"
        >
          {t("cancel")}
        </Button>
      </Container>
    </Dialog>
  );
}
