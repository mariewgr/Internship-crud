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
import UsersContext from "../contexts/UsersContext";
import { ChangeEvent, useContext, useState } from "react";
import { Alert } from "@mui/material";
import dayjs from "dayjs";

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

export default function HomePage() {
  const {
    users,
    createUser,
    showCreateModal,
    openCreate,
    loadingMap,
    errorMap,
  } = useContext(UsersContext);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [year, setYear] = useState<number>(null);
  const [inputYear, setInputYear] = useState<string>("");
  const [checked, setChecked] = useState(false);
  const [isANumber, setIsANumber] = useState(true);
  const ariaLabel = { "aria-label": "description" };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
    filteredUsers();
  };

  const filteredUsers = () => {
    var searchedUsers = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.id.toLowerCase().includes(searchTerm)
    );
    if (checked) {
      searchedUsers = searchedUsers.filter((user) => user.birthdate !== null);
    }
    if (year > 1800) {
      searchedUsers = searchedUsers.filter(
        (user) =>
          user.birthdate !== null && dayjs(user.birthdate).year() === year
      );
    }

    return searchedUsers;
  };
  const handleYearChoice = (event: ChangeEvent<HTMLInputElement>) => {
    setInputYear(event.target.value);
    console.log(inputYear);
    if (parseInt(event.target.value)) {
      setYear(parseInt(event.target.value));
      setIsANumber(true);
    } else if (event.target.value === "") {
      setYear(0);
      setIsANumber(true);
    } else {
      setIsANumber(false);
    }
    filteredUsers();
  };

  const handleCheckBox = () => {
    setChecked(!checked);
    filteredUsers();
  };

  return (
    <>
      <AppBar component="nav">
        <Toolbar
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
      <Toolbar id="back-to-top-anchor" />
      {errorMap.deleteUser && (
        <Alert severity="error">This is an error alert — check it out!</Alert>
      )}
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 5,
          paddingBottom: 5,
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
            style={{ padding: 3 }}
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
        {isANumber ? (
          <TextField
            value={inputYear}
            placeholder="ex: 1990"
            inputProps={ariaLabel}
            onChange={handleYearChoice}
            variant="outlined"
            label="Year of Birth"
          />
        ) : (
          <TextField
            error
            value={inputYear}
            label="Year of Birth"
            placeholder="ex: 1990"
            inputProps={ariaLabel}
            onChange={handleYearChoice}
            variant="outlined"
            helperText="Must be a number"
          />
        )}
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
            birthdate: dayjs("1900-01-01"),
            imageUrl: "",
          }}
          title="Create User"
        ></FormUser>
        <BasicTable users={filteredUsers()} />
        <Fab
          color="secondary"
          aria-label="add"
          style={{ position: "fixed", bottom: 16, right: 16 }}
        >
          <Button
            onClick={() => showCreateModal(true)}
            style={{ color: "#fff" }}
          >
            <AddIcon />
          </Button>
        </Fab>
      </Container>
    </>
  );
}
