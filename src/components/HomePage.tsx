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
  Snackbar,
  TextField,
  Toolbar,
  Typography,
  alpha,
  styled,
} from "@material-ui/core";
import UsersContext, { User } from "../contexts/UsersContext";
import { ChangeEvent, useContext, useEffect } from "react";
import { Alert, Pagination } from "@mui/material";
import dayjs from "dayjs";
import useLocalStore, { StoreConfig } from "state-decorator";
import { useTranslation } from "react-i18next";
import Langue from "./Language";

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
    page: 1,
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
    setPage,
    page,
    openCreateSuccess,
    setOpenCreateSuccess,
  } = useContext(UsersContext);
  const { state: s, actions: a } = useLocalStore(configHomePage);
  const ariaLabel = { "aria-label": "description" };
  const usersPerPage = 10;
  const { t } = useTranslation();

  useEffect(() => {
    a.setUsers(users);
  }, [users]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    a.setSearchTerm(event.target.value.toLowerCase());
    setPage(1);
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
    setPage(1);
  };

  const handleCheckBox = () => {
    a.setChecked(!s.checked);
    setPage(1);
  };

  const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <>
      <Box className="container">
        <AppBar component="nav">
          <Toolbar
            id="back-to-top-anchor"
            style={{
              fontSize: 30,
              color: "white",
              justifyContent: "center",
            }}
          >
            <Box
              style={{
                paddingRight: 3,
              }}
            >
              {t("usersList")}
            </Box>
            <Box style={{ position: "fixed", right: 5 }}>
              <Langue />
            </Box>
          </Toolbar>
        </AppBar>
        {errorMap.deleteUser && <Alert severity="error">{t("noDelete")}</Alert>}
        <Box
          style={{
            display: "flex",
            background: "lightgrey",
            flexDirection: "column",
          }}
        >
          <Container
            style={{
              padding: 5,
              margin: 0,
              marginBottom: 10,
              borderRadius: 5,
              background: "white",
              maxWidth: 5000,
              display: "flex",
              alignItems: "center",
              alignContent: "space-around",
              justifyContent: "space-evenly",
            }}
          >
            <Search
              style={{
                padding: 7,
                margin: 0,
                maxWidth: 300,
                flexGrow: 1,
              }}
            >
              <SearchIcon />
              <StyledInputBase
                placeholder={t("search")}
                inputProps={{ "aria-label": "search" }}
                onChange={handleSearch}
              />
            </Search>
            <Typography style={{ fontStyle: "bold" }}>
              {t("filters")}
            </Typography>
            <FormControlLabel
              control={<Checkbox />}
              label={t("birthdateKnown")}
              color="secondary"
              onClick={handleCheckBox}
            />
            <TextField
              error={!s.isANumber}
              value={s.inputYear}
              label={t("year")}
              placeholder="ex: 1990"
              inputProps={ariaLabel}
              onChange={handleYearChoice}
              variant="outlined"
              helperText={!s.isANumber && t("noNumber")}
              size="small"
            />
          </Container>
          <BasicTable
            users={s.filteredUsers.slice(
              usersPerPage * (page - 1),
              usersPerPage * page
            )}
          />
        </Box>
        <Container style={{ alignContent: "center" }}>
          <Fab
            color="secondary"
            className="add"
            aria-label="add"
            style={{
              color: "white",
              position: "fixed",
              bottom: 16,
              right: 16,
            }}
            onClick={() => showCreateModal(true)}
          >
            <AddIcon />
          </Fab>
        </Container>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pagination count={6} page={page} onChange={handlePage} />
        </div>
      </Box>
      {openCreate && (
        <FormUser
          action={createUser}
          isError={!!errorMap.createUser}
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
          title={t("createTitle")}
          messageSuccess={t("createSuccess")}
          messageError={t("noCreate")}
        />
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openCreateSuccess}
        autoHideDuration={3000}
        onClose={() => setOpenCreateSuccess(false)}
      >
        <Alert
          onClose={() => setOpenCreateSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {t("createSuccess")}
        </Alert>
      </Snackbar>
    </>
  );
}
