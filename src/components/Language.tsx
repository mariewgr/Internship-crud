import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Language } from "../translate/Language";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import dayjs from "dayjs";
// require("dayjs/locale/fr");
// require("dayjs/locale/en");

const Langue = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState<Language>(Language.FR);

  let changeLanguage = (event: SelectChangeEvent<HTMLSelectElement>) => {
    let language = event.target.value;

    switch (language) {
      case Language.EN:
        setLang(Language.EN);
        i18n.changeLanguage(Language.EN);
        dayjs.locale("en");
        break;
      case Language.FR:
      default:
        setLang(Language.FR);
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
        value={lang as undefined}
      >
        <MenuItem value={Language.FR}>FR</MenuItem>
        <MenuItem value={Language.EN}>EN</MenuItem>
      </Select>
    </div>
  );
};

export default Langue;
