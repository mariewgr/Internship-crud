import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { ChangeEvent, useContext, useEffect } from "react";
import { useLocalStore, StoreConfig } from "state-decorator";
import { Alert, Stack } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { UserContext } from "./UserRow";
import UsersContext, { User } from "../contexts/UsersContext";

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
};

export default function FormUser(p: ModalUserProps) {
  const { state: s, actions } = useLocalStore(config);

  const ariaLabel = { "aria-label": "description" };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleFirstNameTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    actions.firstNameOnTextChange(event.target.value);
  };

  const handleLastNameTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    actions.lastNameOnTextChange(event.target.value);
  };

  const handleBirthdateTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    actions.birthdateOnTextChange(dayjs(event as unknown as string));
  };

  const handleImageUrlTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    actions.imageUrlOnTextChange(event.target.value);
  };

  const handleAction = () => {
    console.log(
      "validate Form" +
        validateForm(s.firstNameText, s.lastNameText, s.imageUrl)
    );
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
        fullScreen={fullScreen}
        open={p.open}
        onClose={() => p.showModal(false)}
        aria-labelledby="responsive-dialog-title"
      >
        {p.isError && (
          <Alert severity="error">This is an error alert — check it out!</Alert>
        )}
        <DialogTitle
          id="responsive-dialog-title"
          style={{ textAlign: "center" }}
        >
          {p.title}
        </DialogTitle>
        <DialogActions>
          <Stack
            component="form"
            sx={{
              width: "25ch",
            }}
            spacing={2}
            noValidate
            autoComplete="off"
          >
            {s.requireFirstName ? (
              <TextField
                label="FirstName*"
                placeholder="FirstName*"
                inputProps={ariaLabel}
                onChange={handleFirstNameTextChange}
                variant="outlined"
                defaultValue={p.user.firstName}
              />
            ) : (
              <TextField
                required
                error
                label="FirstName*"
                placeholder="FirstName*"
                inputProps={ariaLabel}
                onChange={handleFirstNameTextChange}
                variant="outlined"
                helperText="Required"
                defaultValue={p.user.lastName}
              />
            )}
            {s.requireLastName ? (
              <TextField
                label="LastName*"
                placeholder="LastName*"
                inputProps={ariaLabel}
                onChange={handleLastNameTextChange}
                variant="outlined"
                defaultValue={p.user.lastName}
              />
            ) : (
              <TextField
                error
                required
                label="LastName*"
                placeholder="LastName*"
                inputProps={ariaLabel}
                onChange={handleLastNameTextChange}
                variant="outlined"
                helperText="Required"
                defaultValue={p.user.lastName}
              />
            )}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Birthdate"
                // TODO:
                onChange={handleBirthdateTextChange as any}
                defaultValue={dayjs(p.user.birthdate) as any}
              />
            </LocalizationProvider>
            {s.requireImageUrl ? (
              <TextField
                label="Image URL*"
                placeholder="Image URL*"
                inputProps={ariaLabel}
                onChange={handleImageUrlTextChange}
                variant="outlined"
                defaultValue={p.user.imageUrl}
              />
            ) : (
              <TextField
                error
                label="Image URL*"
                placeholder="Image URL*"
                inputProps={ariaLabel}
                onChange={handleImageUrlTextChange}
                variant="outlined"
                helperText="Must be a link"
                defaultValue={p.user.imageUrl}
              />
            )}
            <Button
              onClick={handleAction}
              disabled={p.isLoading}
              variant="contained"
              color="secondary"
            >
              Submit
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </div>
  );
}
