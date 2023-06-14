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
          <Grid container item direction="row">
            <Grid item xs={4}></Grid>
            <Grid item xs={2}>
              <dt>User Id:</dt>
            </Grid>
            <Grid item xs={4}>
              <dd>{userId}</dd>
            </Grid>
          </Grid>
          <Grid container item direction="row">
            <Grid item xs={4}></Grid>
            <Grid item xs={2}>
              <dt>Firstname:</dt>
            </Grid>
            <Grid item xs={2}>
              <dd>{user.firstName}</dd>
            </Grid>
          </Grid>
          <Grid container item direction="row">
            <Grid item xs={4}></Grid>
            <Grid item xs={2}>
              <dt>Lastname:</dt>
            </Grid>
            <Grid item xs={2}>
              <dd>{user.lastName}</dd>
            </Grid>
          </Grid>
          <Grid container item direction="row">
            <Grid item xs={4}></Grid>
            <Grid item xs={2}>
              <dt>Birthday:</dt>
            </Grid>
            <Grid item xs={2}>
              <dd>
                {user.birthdate !== null ? (
                  <div>{dayjs(user.birthdate).format("DD-MMMM-YYYY")}</div>
                ) : (
                  <div>No Birthdate registered</div>
                )}
              </dd>
            </Grid>
          </Grid>
          <Grid container item direction="row">
            <Grid item xs={4}></Grid>
            <Grid item xs={2}>
              <dt>Image:</dt>
            </Grid>
            <Grid item xs={2}>
              <dd>
                <img src={user.imageUrl}></img>
              </dd>
            </Grid>
          </Grid>
        </Grid>
        <Fab
          color="secondary"
          aria-label="delete"
          style={{ position: "fixed", bottom: 16, left: 16 }}
        >
          <Button onClick={() => setOpenDelete(true)} style={{ color: "#fff" }}>
            <DeleteIcon />
          </Button>
          <DialogDelete
            open={openDelete}
            setOpen={setOpenDelete}
            id={userId}
            action={deleteUser}
          />
        </Fab>
        <Fab
          color="secondary"
          aria-label="edit"
          style={{ position: "fixed", bottom: 16, right: 16 }}
        >
          <Button onClick={() => setOpenUpdate(true)} style={{ color: "#fff" }}>
            <EditIcon />
          </Button>
        </Fab>
        <FormUser
          action={updateUser}
          showModal={setOpenUpdate}
          open={openUpdate}
          isLoading={loadingMap.updateUser}
          isError={errorMap.updateUser}
          user={user}
          title="Edit User"
        />
      </dl>
    </>
  );
}
