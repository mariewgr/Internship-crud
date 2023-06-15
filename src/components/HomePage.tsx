import BasicTable from "./BasicTable";
import FormUser from "./FormUser";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Container,
  Fab,
  FormControlLabel,
  InputBase,
  TextField,
  Toolbar,
  alpha,
  styled,
} from "@material-ui/core";
import UsersContext, { User } from "../contexts/UsersContext";
import { ChangeEvent, useContext, useEffect } from "react";
import { Alert } from "@mui/material";
import dayjs from "dayjs";
import useLocalStore, { StoreConfig } from "state-decorator";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export const filteredUsers = (
  users: User[],
  checked: boolean,
  year: number,
  searchTerm: string
) => {
  var searchedUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName} ${user.firstName}`
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(searchTerm) ||
      user.id
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(searchTerm)
  );
  if (checked) {
    searchedUsers = searchedUsers.filter((user) => user.birthdate !== null);
  }
  if (year > 1800) {
    searchedUsers = searchedUsers.filter(
      (user) => user.birthdate !== null && dayjs(user.birthdate).year() === year
    );
  }

  return searchedUsers;
};

type Actions = {
  setSearchTerm: (searchTerm: string) => void;
  setYear: (year: number) => void;
  setInputYear: (inputYear: string) => void;
  setChecked: (checked: boolean) => void;
  setIsANumber: (IsANumber: boolean) => void;
  setUsers: (users: User[]) => void;
};

export type State = {
  searchTerm: string;
  year: number;
  inputYear: string;
  checked: boolean;
  isANumber: boolean;
  users: User[];
};

type DerivedState = {
  filteredUsers: User[];
};
// Initial state & actions
export const configHomePage: StoreConfig<State, Actions, any, DerivedState> = {
  getInitialState: () => ({
    searchTerm: "",
    year: 0,
    inputYear: "",
    checked: false,
    isANumber: true,
    users: [],
  }),

  actions: {
    setSearchTerm: ({ args: [searchTerm] }) => ({ searchTerm }),
    setYear: ({ args: [year] }) => ({ year }),
    setInputYear: ({ args: [inputYear] }) => ({ inputYear }),
    setChecked: ({ args: [checked] }) => ({ checked }),
    setIsANumber: ({ args: [isANumber] }) => ({ isANumber }),
    setUsers: ({ args: [users] }) => ({ users }),
  },
  derivedState: {
    filteredUsers: {
      getDeps: ({ s }) => [s.searchTerm, s.checked, s.year, s.users],
      get: ({ s }) => filteredUsers(s.users, s.checked, s.year, s.searchTerm),
    },
  },
  logEnabled: true,
};

export default function HomePage() {
  const {
    users,
    createUser,
    showCreateModal,
    openCreate,
    loadingMap,
    errorMap,
  } = useContext(UsersContext);
  const { state: s, actions: a } = useLocalStore(configHomePage);
  const ariaLabel = { "aria-label": "description" };

  useEffect(() => {
    a.setUsers(users);
  }, [users]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    a.setSearchTerm(event.target.value.toLowerCase());
  };
  const handleYearChoice = (event: ChangeEvent<HTMLInputElement>) => {
    a.setInputYear(event.target.value);
    if (parseInt(event.target.value)) {
      a.setYear(parseInt(event.target.value));
      a.setIsANumber(true);
    } else if (event.target.value === "") {
      a.setYear(0);
      a.setIsANumber(true);
    } else {
      a.setIsANumber(false);
    }
  };

  const handleCheckBox = () => {
    a.setChecked(!s.checked);
  };

  return (
    <>
      <Box className="container">
        <AppBar component="nav">
          <Toolbar
            id="back-to-top-anchor"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 30,
            }}
          >
            <Box style={{ paddingRight: 3 }}>Users List</Box>
          </Toolbar>
        </AppBar>
        {errorMap.deleteUser && (
          <Alert severity="error">This is an error alert — check it out!</Alert>
        )}
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 5,
            paddingBottom: 10,
            paddingRight: 10,
            background: "lightgrey",
          }}
        >
          <Container
            style={{
              padding: 5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
              }}
            >
              <Search
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SearchIcon />
                <StyledInputBase
                  placeholder="  Search…"
                  inputProps={{ "aria-label": "search" }}
                  onChange={handleSearch}
                />
              </Search>
              <p style={{ paddingRight: 40 }}>Filters:</p>
              <FormControlLabel
                control={<Checkbox />}
                label="Birthdate known"
                color="secondary"
                onClick={handleCheckBox}
              />
              {s.isANumber ? (
                <TextField
                  value={s.inputYear}
                  placeholder="ex: 1990"
                  inputProps={ariaLabel}
                  onChange={handleYearChoice}
                  variant="outlined"
                  label="Year of Birth"
                  style={{ margin: 10 }}
                />
              ) : (
                <TextField
                  error
                  value={s.inputYear}
                  label="Year of Birth"
                  placeholder="ex: 1990"
                  inputProps={ariaLabel}
                  onChange={handleYearChoice}
                  variant="outlined"
                  helperText="Must be a number"
                />
              )}
            </div>
          </Container>
        </Box>
        <Container style={{ alignContent: "center" }}>
          <FormUser
            action={createUser}
            isError={errorMap.createUser}
            isLoading={loadingMap.createUser}
            showModal={showCreateModal}
            open={openCreate}
            user={{
              id: "",
              firstName: "",
              lastName: "",
              birthdate: null,
              imageUrl: "",
            }}
            title="Create User"
          ></FormUser>
          <BasicTable users={s.filteredUsers} />
          <Button
            onClick={() => showCreateModal(true)}
            style={{ color: "#fff", borderRadius: 150 }}
          >
            <Fab
              aria-label="add"
              style={{
                position: "fixed",
                bottom: 16,
                right: 16,
                background: "orange",
                color: "white",
              }}
            >
              <AddIcon />
            </Fab>
          </Button>
        </Container>
      </Box>
    </>
  );
}
