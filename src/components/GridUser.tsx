import dayjs from "dayjs";
import { User } from "../contexts/UsersContext";
import { UserInfosActions, UserInfosState } from "./UserInfos";
import { useTranslation } from "react-i18next";
import "./GridUser.css";
import { Container } from "@material-ui/core";
import { toHaveDisplayValue } from "@testing-library/jest-dom/matchers";

type GrideUserProps = { user: User } & Pick<UserInfosActions, "setNewImage"> &
  Pick<UserInfosState, "newImage">;

export default function GrideUser(p: GrideUserProps) {
  const { user } = p;

  const { t } = useTranslation();

  return (
    <>
      <Container>
        <dl>
          <dd className="ddImg">
            <img
              src={user.imageUrl}
              style={{ borderRadius: 200, margin: 0 }}
              role="presentation"
            />
          </dd>
          <dt className="dtUser">{t("id") + ":"}</dt>
          <dd className="ddUser">{user.id}</dd>
          <dt className="dtFirstName">{t("firstname") + ":"}</dt>
          <dd className="ddFirstName">{user.firstName}</dd>

          <dt className="dtLastName">{t("lastname") + ":"}</dt>

          <dd className="ddLastName">{user.lastName}</dd>

          <dt className="dtBirthdate">{t("birthdate") + ":"}</dt>

          <dd className="ddBirthdate">
            {user.birthdate !== null ? (
              <div>{dayjs(user.birthdate).format("DD-MMMM-YYYY")}</div>
            ) : (
              <div>{t("noBirthdate")}</div>
            )}
          </dd>
        </dl>
      </Container>
    </>
  );
}
