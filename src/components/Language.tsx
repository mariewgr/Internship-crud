import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Language } from "../translate/Language";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import dayjs from "dayjs";
import UsersContext from "../contexts/UsersContext";

const Langue = () => {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useContext(UsersContext);

  let changeLanguage = (event: SelectChangeEvent<HTMLSelectElement>) => {
    let language = event.target.value;

    switch (language) {
      case Language.EN:
        setLanguage(Language.EN);
        i18n.changeLanguage(Language.EN);
        dayjs.locale("en");
        break;
      case Language.FR:
      default:
        setLanguage(Language.FR);
        i18n.changeLanguage(Language.FR);
        dayjs.locale("fr");
        break;
    }
  };

  return (
    <div>
      <Select
        name="language"
        onChange={changeLanguage}
        style={{ color: "white" }}
        value={language as undefined}
      >
        <MenuItem value={Language.FR}>FR</MenuItem>
        <MenuItem value={Language.EN}>EN</MenuItem>
      </Select>
    </div>
  );
};

export default Langue;
