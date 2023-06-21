import BasicTable from "./BasicTable";
import FormUser from "./FormUser";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Box,
  Checkbox,
  Container,
  Fab,
  FormControlLabel,
  InputBase,
  Snackbar,
  TextField,
  Toolbar,
  alpha,
  styled,
} from "@material-ui/core";
import UsersContext, { User } from "../contexts/UsersContext";
import { ChangeEvent, useContext, useEffect, useRef } from "react";
import { Alert, Pagination } from "@mui/material";
import dayjs from "dayjs";
import useLocalStore, { StoreConfig } from "state-decorator";
import { useTranslation } from "react-i18next";
import Langue from "./Language";
import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { setArgIn } from "state-decorator/helpers";

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
  searchYear: number,
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
  if (searchYear > 1000) {
    searchedUsers = searchedUsers.filter(
      (user) =>
        user.birthdate !== null && dayjs(user.birthdate).year() === searchYear
    );
  }

  return searchedUsers;
};

type Actions = {
  setSearchTerm: (searchTerm: string) => void;
  setSearchYear: (year: number) => void;
  setInputYear: (inputYear: string) => void;
  setChecked: (checked: boolean) => void;
  setIsANumber: (IsANumber: boolean) => void;
  setUsers: (users: User[]) => void;
};

export type State = {
  searchTerm: string;
  searchYear: number;
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
    searchYear: 0,
    inputYear: "",
    checked: false,
    isANumber: true,
    users: [],
    page: 1,
  }),

  actions: {
    setSearchTerm: setArgIn("searchTerm"),
    setSearchYear: setArgIn("searchYear"),
    setInputYear: setArgIn("inputYear"),
    setChecked: setArgIn("checked"),
    setIsANumber: setArgIn("isANumber"),
    setUsers: setArgIn("users"),
  },
  derivedState: {
    filteredUsers: {
      getDeps: ({ s }) => [s.searchTerm, s.checked, s.searchYear, s.users],
      get: ({ s }) =>
        filteredUsers(s.users, s.checked, s.searchYear, s.searchTerm),
    },
  },
  logEnabled: true,
};

export default function HomePage() {
  const {
    users,
    createUser,
    setOpenCreateModal,
    openCreateModal,
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

  var refCreate = useRef(null);

  useEffect(() => {
    a.setUsers(users);
  }, [users]);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    a.setSearchTerm(
      event.target.value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    );
    setPage(1);
  };
  const handleYearChoice = (event: ChangeEvent<HTMLInputElement>) => {
    a.setInputYear(event.target.value);
    if (parseInt(event.target.value)) {
      a.setSearchYear(parseInt(event.target.value));
      a.setIsANumber(true);
    } else if (event.target.value === "") {
      a.setSearchYear(0);
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
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Search
              style={{
                padding: 7,
                margin: 0,
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SearchIcon style={{ color: "darkorange" }} />
              <StyledInputBase
                placeholder={t("search")}
                inputProps={{ "aria-label": "search" }}
                onChange={handleSearch}
              />
            </Search>
            <Container
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FilterAltIcon
                style={{ paddingRight: 10, color: "darkorange" }}
              />
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
          </Container>
          <BasicTable
            users={s.filteredUsers.slice(
              usersPerPage * (page - 1),
              usersPerPage * page
            )}
          />
        </Box>
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
      {openCreateModal && (
        <FormUser
          submitAction={createUser}
          isError={!!errorMap.createUser}
          isLoading={loadingMap.createUser}
          setOpenModal={setOpenCreateModal}
          openModal={openCreateModal}
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
          activeObject={refCreate.current}
        />
      )}
      <Container style={{ alignContent: "center" }}>
        <Fab
          color="secondary"
          aria-label="add"
          style={{
            color: "white",
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
          onClick={() => {
            setOpenCreateModal(true);
            refCreate.current = document.activeElement;
          }}
        >
          <AddIcon />
        </Fab>
      </Container>
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
