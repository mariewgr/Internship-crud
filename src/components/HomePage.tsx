import BasicTable from "./BasicTable";
import FormUser from "./FormUser";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Box,
  Button,
  Container,
  Fab,
  InputBase,
  Toolbar,
  alpha,
  styled,
} from "@material-ui/core";
import UsersContext from "../contexts/UsersContext";
import { ChangeEvent, useContext, useState } from "react";
import { Alert } from "@mui/material";

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

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const searchedUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.id.toLowerCase().includes(searchTerm)
  );

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
        <BasicTable users={searchedUsers} />
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
