import axios from "axios";
import {
  defaultDirection,
  defaultLocale,
  defaultColor,
  localeOptions,
  themeColorStorageKey,
  themeRadiusStorageKey,
  servicePath2,
  servicePathFiles,
} from "constants/defaultValues";

export const mapOrder = (array, order, key) => {
  // eslint-disable-next-line func-names
  array.sort(function (a, b) {
    const A = a[key];
    const B = b[key];
    if (order.indexOf(`${A}`) > order.indexOf(`${B}`)) {
      return 1;
    }
    return -1;
  });
  return array;
};

export const getIndex = (value, arr, prop) => {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][prop] === value) {
      return i;
    }
  }
  return -1;
};

export const getDateWithFormat = (date) => {
  let today = new Date();
  if (date) {
    today = new Date(date);
  }
  let dd = today.getDate();
  let mm = today.getMonth() + 1; // January is 0!

  const yyyy = today.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }
  if (mm < 10) {
    mm = `0${mm}`;
  }
  return `${dd}/${mm}/${yyyy}`;
};

export const getCurrentTime = (time) => {
  let now = new Date();
  if (time) {
    now = new Date(time);
  }
  return `${now.getHours()}:${now.getMinutes()}`;
};

export const getDirection = () => {
  let direction = defaultDirection;

  try {
    if (localStorage.getItem("direction")) {
      const localValue = localStorage.getItem("direction");
      if (localValue === "rtl" || localValue === "ltr") {
        direction = localValue;
      }
    }
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js : getDirection -> error", error);
    direction = defaultDirection;
  }
  return {
    direction,
    isRtl: direction === "rtl",
  };
};
export const setDirection = (localValue) => {
  let direction = "ltr";
  if (localValue === "rtl" || localValue === "ltr") {
    direction = localValue;
  }
  try {
    localStorage.setItem("direction", direction);
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js : setDirection -> error", error);
  }
};

export const getCurrentColor = () => {
  let currentColor = defaultColor;
  try {
    if (localStorage.getItem(themeColorStorageKey)) {
      currentColor = localStorage.getItem(themeColorStorageKey);
    }
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js : getCurrentColor -> error", error);
    currentColor = defaultColor;
  }
  return currentColor;
};

export const setCurrentColor = (color) => {
  try {
    localStorage.setItem(themeColorStorageKey, color);
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js : setCurrentColor -> error", error);
  }
};

export const getCurrentRadius = () => {
  let currentRadius = "rounded";
  try {
    if (localStorage.getItem(themeRadiusStorageKey)) {
      currentRadius = localStorage.getItem(themeRadiusStorageKey);
    }
  } catch (error) {
    console.log(
      ">>>>: src/helpers/Utils.js : getCurrentRadius -> error",
      error
    );
    currentRadius = "rounded";
  }
  return currentRadius;
};
export const setCurrentRadius = (radius) => {
  try {
    localStorage.setItem(themeRadiusStorageKey, radius);
  } catch (error) {
    console.log(
      ">>>>: src/helpers/Utils.js : setCurrentRadius -> error",
      error
    );
  }
};

export const getCurrentLanguage = () => {
  let language = defaultLocale;
  try {
    language =
      localStorage.getItem("currentLanguage") &&
        localeOptions.filter(
          (x) => x.id === localStorage.getItem("currentLanguage")
        ).length > 0
        ? localStorage.getItem("currentLanguage")
        : defaultLocale;
  } catch (error) {
    console.log(
      ">>>>: src/helpers/Utils.js : getCurrentLanguage -> error",
      error
    );
    language = defaultLocale;
  }
  return language;
};
export const setCurrentLanguage = (locale) => {
  try {
    localStorage.setItem("currentLanguage", locale);
  } catch (error) {
    console.log(
      ">>>>: src/helpers/Utils.js : setCurrentLanguage -> error",
      error
    );
  }
};

export const getCurrentUser = () => {
  let user = null;
  try {
    user =
      sessionStorage.getItem("current_user") != null
        ? JSON.parse(sessionStorage.getItem("current_user"))
        : null;
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js  : getCurrentUser -> error", error);
    user = null;
  }
  return user;
};

export const setCurrentUser = (user) => {
  try {
    if (user) {
      sessionStorage.setItem("current_user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("current_user");
    }
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js : setCurrentUser -> error", error);
  }
};

export const getPhTemp = () => {
  let phTemp = [];
  try {
    phTemp =
      localStorage.getItem("ph_temp") !== []
        ? JSON.parse(localStorage.getItem("ph_temp"))
        : [];
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js  : getPhTemp -> error", error);
    phTemp = [];
  }
  return phTemp;
};

export const setPhTemp = (phTemp) => {
  try {
    if (phTemp) {
      localStorage.setItem("ph_temp", JSON.stringify(phTemp));
    } else {
      localStorage.removeItem("ph_item");
    }
  } catch (error) {
    console.log(">>>>: src/helpers/Utils.js : setPhTemp -> error", error);
  }
};

export const checkDuplicate = async (no, menu_master_id, type) =>
  axios.get(`${servicePath2}/check-duplicate`, {
    params: { no, menu_master_id, type },
  })
    .then((res) => res.data);

export const slicePage = (items, currentPage, pageSize) => items.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);

export const countTax = (tax, sub_total) =>
  sub_total * (tax * 0.01);

export const getCsvTemplate = (type) => {
  const link = document.createElement("a");
  link.setAttribute("target", "_blank");
  link.href = `${servicePathFiles}/import/IMPORT_TEMPLATE_${type.toUpperCase()}.csv`;
  link.click();
};

export const toCamelCase = (text) => {
  const result = text.replace(text.split("")[0], text.split("")[0].toUpperCase());
  return result;
}