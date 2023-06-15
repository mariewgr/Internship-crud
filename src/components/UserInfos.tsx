import { useContext, useEffect, useState } from "react";
import UsersContext, { UsersContextProvider } from "../contexts/UsersContext";
import { Link, useParams } from "react-router-dom";
import "./UserInfo.css";
import { AppBar, Box, Button, Fab, Grid, Toolbar } from "@material-ui/core";
import DialogDelete from "./DialogDelete";
import FormUser from "./FormUser";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { Alert } from "@mui/material";

export default function UserInfo() {
  const { userId } = useParams();
  const { users, updateUser, loadingMap, errorMap, deleteUser } =
    useContext(UsersContext);

  const user = users.find((user) => user.id === userId);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  useEffect(() => {
    console.log(users);
  }, []);

  return (
    <>
      <AppBar component="nav">
        <Toolbar>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Link to={"/"} style={{ color: "#fff" }}>
              Home
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      {errorMap.deleteUser && (
        <Alert severity="error">This is an error alert — check it out!</Alert>
      )}
      <dl>
        <Grid
          container
          direction="column"
          spacing={3}
          style={{ alignContent: "center" }}
        >
          <div style={{ background: "white" }}>
            <Grid container item direction="row">
              <Grid
                item
                xs={12}
                style={{ alignContent: "center", alignItems: "center" }}
              >
                <dd>
                  <img
                    src={user.imageUrl}
                    style={{ borderRadius: 200, margin: 10, padding: 10 }}
                  ></img>
                </dd>
              </Grid>
            </Grid>
            <Grid container item direction="row" style={{ paddingLeft: 60 }}>
              <Grid item xs={3}>
                <dt>User Id:</dt>
              </Grid>
              <Grid item xs={8}>
                <dd>{userId}</dd>
              </Grid>
            </Grid>
            <Grid container item direction="row" style={{ paddingLeft: 60 }}>
              <Grid item xs={3}>
                <dt>Firstname:</dt>
              </Grid>
              <Grid item xs={8}>
                <dd>{user.firstName}</dd>
              </Grid>
            </Grid>
            <Grid container item direction="row" style={{ paddingLeft: 60 }}>
              <Grid item xs={3}>
                <dt>Lastname:</dt>
              </Grid>
              <Grid item xs={8}>
                <dd>{user.lastName}</dd>
              </Grid>
            </Grid>
            <Grid
              container
              item
              direction="row"
              style={{ paddingLeft: 60, marginBottom: 20 }}
            >
              <Grid item xs={3}>
                <dt>Birthday:</dt>
              </Grid>
              <Grid item xs={8}>
                <dd>
                  {user.birthdate !== null ? (
                    <div>{dayjs(user.birthdate).format("DD-MMMM-YYYY")}</div>
                  ) : (
                    <div>No Birthdate registered</div>
                  )}
                </dd>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </dl>
      <Button
        onClick={() => setOpenDelete(true)}
        style={{ position: "fixed", top: 75, right: 86, borderRadius: 150 }}
      >
        <Fab color="secondary" aria-label="delete">
          <DeleteIcon />
        </Fab>
      </Button>
      <DialogDelete
        open={openDelete}
        setOpen={setOpenDelete}
        id={userId}
        action={deleteUser}
      />
      <Button
        onClick={() => setOpenUpdate(true)}
        style={{
          position: "fixed",
          top: 75,
          right: 16,
          borderRadius: 150,
        }}
      >
        <Fab
          aria-label="edit"
          style={{
            background: "orange",
            color: "white",
          }}
        >
          <EditIcon />
        </Fab>
      </Button>
      <FormUser
        action={updateUser}
        showModal={setOpenUpdate}
        open={openUpdate}
        isLoading={loadingMap.updateUser}
        isError={errorMap.updateUser}
        user={user}
        title="Edit User"
      />
    </>
  );
}
