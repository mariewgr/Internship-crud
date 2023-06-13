import BasicTable from "./BasicTable";
import FormUser from "./FormUser";
import AddIcon from "@mui/icons-material/Add";
import {
  AppBar,
  Box,
  Button,
  Container,
  Fab,
  Toolbar,
} from "@material-ui/core";
import { User, UserState, UsersListActions } from "../App";
import { ErrorMap, LoadingMap } from "state-decorator";

type HomePageProps = {
  loadingMap: LoadingMap<UsersListActions>;
  errorMap: ErrorMap<UsersListActions>;
  users: User[];
} & Pick<UsersListActions, "createUser"> &
  Pick<UsersListActions, "showCreateModal"> &
  Pick<UserState, "openCreate"> &
  Pick<UsersListActions, "deleteUser"> &
  Pick<UsersListActions, "updateUser">;

export default function HomePage(p: HomePageProps) {
  const rows = ["Id User", "First name", "Last name", "Actions"];

  return (
    <>
      <AppBar component="nav">
        <Toolbar>
          <Box sx={{ display: { xs: "none", sm: "block" } }}></Box>
        </Toolbar>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <Container>
        <FormUser
          action={p.createUser}
          isError={p.errorMap.createUser}
          isLoading={p.loadingMap.createUser}
          id={""}
          showModal={p.showCreateModal}
          open={p.openCreate}
          user={{
            id: "",
            firstName: "",
            lastName: "",
            birthdate: null,
            imageUrl: "",
          }}
          title="Create User"
        ></FormUser>
        <BasicTable
          users={p.users}
          rows={rows}
          deleteUser={p.deleteUser}
          updateUser={p.updateUser}
          loadingMap={p.loadingMap}
          errorMap={p.errorMap}
        />
        <Fab
          color="primary"
          aria-label="add"
          style={{ position: "fixed", bottom: 16, right: 16 }}
        >
          <Button
            onClick={() => p.showCreateModal(true)}
            style={{ color: "#fff" }}
          >
            <AddIcon />
          </Button>
        </Fab>
      </Container>
    </>
  );
}
