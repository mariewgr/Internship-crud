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

type ModalUserProps = {
  action: (
    id: string,
    firstName: string,
    lastName: string,
    birthdate: Dayjs | null,
    imageUrl: string
  ) => Promise<User>;
  isError: boolean;
  isLoading: boolean;
  showModal: (open: boolean) => void;
  open: boolean;
  user: User;
  title: string;
  messageSuccess: string;
  messageError: string;
};

type Props = ModalUserProps;

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

export const config: StoreConfig<State, Actions, Props> = {
  getInitialState: (p) => ({
    firstNameText: p.user.firstName,
    lastNameText: p.user.lastName,
    birthdateText: p.user.birthdate,
    imageUrl: p.user.imageUrl,
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
        imageUrl !== null &&
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
  const validateImageUrl =
    imageUrlText !== null &&
    imageUrlText.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    ) !== null;
  return firstNameText !== "" && lastNameText !== "" && validateImageUrl;
}

export default function FormUser(p: ModalUserProps) {
  const { state: s, actions } = useLocalStore(config, p);

  const ariaLabel = { "aria-label": "description" };

  const { t } = useTranslation();

  const handleFirstNameTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    actions.firstNameOnTextChange(event.target.value);
  };

  const handleLastNameTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    actions.lastNameOnTextChange(event.target.value);
  };

  const handleBirthdateTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    actions.birthdateOnTextChange(dayjs(event as undefined));
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
    }
  };
  return (
    <div>
      <Dialog
        open={p.open}
        onClose={() => p.showModal(false)}
        aria-labelledby="responsive-dialog-title"
      >
        {p.isError && <Alert severity="error">{p.messageError}</Alert>}
        <DialogTitle
          id="responsive-dialog-title"
          style={{
            textAlign: "center",
            verticalAlign: "text-bottom",
            padding: 0,
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
            noValidate
            autoComplete="off"
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
                error={!s.requireFirstName}
                label={t("firstname")}
                placeholder={t("firstname")}
                inputProps={ariaLabel}
                onChange={handleFirstNameTextChange}
                variant="outlined"
                helperText={!s.requireFirstName && t("required")}
                defaultValue={p.user.firstName}
              />
              <TextField
                error={!s.requireLastName}
                required
                size="small"
                label={t("lastname")}
                placeholder={t("lastname")}
                inputProps={ariaLabel}
                onChange={handleLastNameTextChange}
                variant="outlined"
                helperText={!s.requireLastName && t("required")}
                defaultValue={p.user.lastName}
              />
              <DatePicker
                label={t("birthdate")}
                onChange={handleBirthdateTextChange}
                defaultValue={
                  p.user.birthdate === null
                    ? null
                    : (dayjs(p.user.birthdate) as undefined)
                }
              />
              <TextField
                error={!s.requireImageUrl}
                size="small"
                label={t("imageUrl")}
                placeholder={t("imageUrl")}
                inputProps={ariaLabel}
                onChange={handleImageUrlTextChange}
                variant="outlined"
                helperText={!s.requireImageUrl && t("notALink")}
                defaultValue={p.user.imageUrl}
              />
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
    </div>
  );
}
