import { Grid } from "@material-ui/core";
import dayjs from "dayjs";
import { User } from "../contexts/UsersContext";
import { UserInfosActions, UserInfosState } from "./UserInfos";
import { useTranslation } from "react-i18next";

type GrideUserProps = { user: User } & Pick<UserInfosActions, "setNewImage"> &
  Pick<UserInfosState, "newImage">;

export default function GrideUser(p: GrideUserProps) {
  const { user } = p;

  const { t } = useTranslation();

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
                <dd
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginLeft: 0,
                  }}
                >
                  <img
                    src={user.imageUrl}
                    style={{ borderRadius: 200, padding: 10 }}
                  ></img>
                </dd>
              </Grid>
            </Grid>
            <Grid container item direction="row" style={{ paddingLeft: 60 }}>
              <Grid item xs={3}>
                <dt>{t("id") + ":"}</dt>
              </Grid>
              <Grid item xs={8}>
                <dd>{user.id}</dd>
              </Grid>
            </Grid>
            <Grid container item direction="row" style={{ paddingLeft: 60 }}>
              <Grid item xs={3}>
                <dt>{t("firstname") + ":"}</dt>
              </Grid>
              <Grid item xs={8}>
                <dd>{user.firstName}</dd>
              </Grid>
            </Grid>
            <Grid container item direction="row" style={{ paddingLeft: 60 }}>
              <Grid item xs={3}>
                <dt>{t("lastname") + ":"}</dt>
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
                <dt>{t("birthdate") + ":"}</dt>
              </Grid>
              <Grid item xs={8}>
                <dd>
                  {user.birthdate !== null ? (
                    <div>{dayjs(user.birthdate).format("DD-MMMM-YYYY")}</div>
                  ) : (
                    <div>{t("noBirthdate")}</div>
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
