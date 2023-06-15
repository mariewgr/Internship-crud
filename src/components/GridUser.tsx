import {
  Grid,
  Container,
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogActions,
  TextField,
  Box,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { Alert, Stack } from "@mui/material";
import dayjs from "dayjs";
import ImageIcon from "@mui/icons-material/Image";
import UsersContext, { User } from "../contexts/UsersContext";
import { ChangeEvent, useContext, useState } from "react";
import { UserInfosActions, UserInfosState } from "./UserInfos";

type GrideUserProps = { user: User } & Pick<UserInfosActions, "setNewImage"> &
  Pick<UserInfosActions, "setOpenImage"> &
  Pick<UserInfosState, "newImage"> &
  Pick<UserInfosState, "openImage">;

export default function GrideUser(p: GrideUserProps) {
  const { user, setOpenImage, openImage } = p;
  const { errorMap, loadingMap, updateUser } = useContext(UsersContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [imageInput, setImageInput] = useState(user.imageUrl);
  const [wrongInput, setWrongInput] = useState(false);

  const handleImageChange = () => {
    if (
      imageInput.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      ) !== null
    ) {
      updateUser(
        user.id,
        user.firstName,
        user.lastName,
        user.birthdate,
        imageInput
      );
      setWrongInput(false);
      setOpenImage(false);
    } else {
      setWrongInput(true);
    }
  };

  const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImageInput(event.target.value);
  };

  return (
    <>
      <dl>
        <Grid
          container
          direction="column"
          spacing={3}
          style={{ alignContent: "center" }}
        >
          <div style={{ background: "white" }}>
            <Grid
              container
              item
              direction="row"
              style={{
                justifyContent: "center",
              }}
            >
              <Grid item xs={12}>
                <dd>
                  <img
                    src={user.imageUrl}
                    style={{ borderRadius: 200, margin: 15 }}
                  ></img>
                  <Container
                    style={{
                      position: "absolute",
                      top: 390,
                      left: 750,
                      justifyContent: "flex-start",
                      justifyItems: "flex-start",
                    }}
                  >
                    <Button
                      onClick={() => setOpenImage(true)}
                      style={{
                        color: "#fff",
                        borderRadius: 150,
                      }}
                    >
                      <Fab
                        aria-label="image"
                        style={{
                          background: "orange",
                          color: "white",
                        }}
                      >
                        <ImageIcon />
                      </Fab>
                    </Button>
                  </Container>
                  <Dialog
                    fullScreen={fullScreen}
                    open={openImage}
                    onClose={() => setOpenImage(false)}
                    aria-labelledby="responsive-dialog-title"
                  >
                    {errorMap.updateUser && (
                      <Alert severity="error">
                        This is an error alert — check it out!
                      </Alert>
                    )}
                    <DialogTitle
                      id="responsive-dialog-title"
                      style={{
                        textAlign: "center",
                        verticalAlign: "text-bottom",
                        paddingTop: 0,
                      }}
                    >
                      <p style={{ fontSize: 30 }}>Update Image</p>
                    </DialogTitle>
                    <DialogActions
                      style={{ minWidth: 300, justifyContent: "center" }}
                    >
                      <Stack spacing={3}>
                        {wrongInput ? (
                          <TextField
                            error
                            label="Image URL*"
                            placeholder="Image URL*"
                            onChange={handleImageInputChange}
                            variant="outlined"
                            defaultValue={user.imageUrl}
                          />
                        ) : (
                          <TextField
                            label="Image URL*"
                            placeholder="Image URL*"
                            onChange={handleImageInputChange}
                            variant="outlined"
                            defaultValue={user.imageUrl}
                          />
                        )}
                        <Box
                          style={{
                            display: "flex",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            onClick={() => setOpenImage(false)}
                            disabled={loadingMap.updateUser}
                            variant="contained"
                            style={{ marginRight: 7 }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleImageChange}
                            disabled={loadingMap.updateUser}
                            variant="contained"
                            style={{ background: "orange", color: "white" }}
                          >
                            Submit
                          </Button>
                        </Box>
                      </Stack>
                    </DialogActions>
                  </Dialog>
                </dd>
              </Grid>
            </Grid>
            <Grid container item direction="row" style={{ paddingLeft: 60 }}>
              <Grid item xs={3}>
                <dt>User Id:</dt>
              </Grid>
              <Grid item xs={8}>
                <dd>{user.id}</dd>
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
    </>
  );
}
