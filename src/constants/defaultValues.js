export const UserRole = {
  DIREKTUR: 0,
  STAFF: 1,
};

export const menuMasters = {
  "/work-plans": 1,
  "/imprests": 2,
  "/travel-orders": 3,
  "/fee-projects": 4,
  "/budget-plans": 5,
  "/procurements": 6,
};

export const statusTranslate = {
  Tertunda: "PENDING",
  Draft: "DRAFTED",
  Diajukan: "PROPOSED",
  Disetujui: "APPROVED",
  Ditolak: "REJECTED",
  Laporan: "REPORTED",
};

export const statusColor = {
  PENDING: "dark",
  DRAFTED: "info",
  PROPOSED: "warning",
  APPROVED: "success",
  REJECTED: "danger",
  REPORTED: "primary",
};

export const incomeColor = {
  NEW: "warning",
  CONTRACT: "info",
  BA: "success",
  INVOICE: "primary",
};

export const chartKeysTranslate = {
  total_rab: "RAB",
  total_persekot: "Persekot",
  total_pkm: "RPB",
  total_offer: "Penawaran",
  total_contract: "Kontrak",
  total_ba: "BA",
  target: "Target",
};

export const evidenceList = [
  {
    label: "PERSEKOT",
    value: "PERSEKOT",
    key: 0,
  },
  {
    label: "SPPD",
    value: "SPPD",
    key: 1,
  },
  {
    label: "Fee Project",
    value: "FEE_PROJECT",
    key: 2,
  },
  {
    label: "PKM",
    value: "PKM",
    key: 3,
  },
];

export const userIcon = {
  0: "iconsminds-administrator",
  1: "iconsminds-engineering",
  2: "iconsminds-business-man",
};

/*
Menu Types:
"menu-default", "menu-sub-hidden", "menu-hidden"
*/
export const defaultMenuType = "menu-default";

export const subHiddenBreakpoint = 768;
export const menuHiddenBreakpoint = 768;
export const defaultLocale = "id";
export const localeOptions = [
  { id: "id", name: "Indonesia", direction: "ltr" },
  { id: "en", name: "English", direction: "ltr" },
];

export const adminRoot = "/app";
export const searchPath = `${adminRoot}/#`;

// PRODUCTION
export const servicePath = "http://10.1.62.177:5000/api/v1";
export const servicePathFiles = "http://10.1.62.177:5000/public";
// // DEVELOPMENT
// export const servicePath = "http://localhost:5000/api/v1";
// export const servicePathFiles = "http://localhost:5000/public";
// export const servicePath = "http://192.168.137.1:5000/api/v1";
// export const servicePathFiles = "http://192.168.137.1:5000/public";
// export const servicePath = "https://cogindo.up.railway.app/api/v1";
// export const servicePathFiles = "https://cogindo.up.railway.app/public";
export const servicePath2 = "https://be-nodejs.up.railway.app";

export const currentUser = {};
export const themeColorStorageKey = "__theme_selected_color";
export const isMultiColorActive = false;
export const defaultColor = "light.orangecarrot";
export const isDarkSwitchActive = false;
export const defaultDirection = "ltr";
export const themeRadiusStorageKey = "__theme_radius";
export const defaultThemeRadius = "rounded";
export const isAuthGuardActive = true;
export const colors = [
  "bluenavy",
  "blueyale",
  "blueolympic",
  "greenmoss",
  "greenlime",
  "purplemonster",
  "orangecarrot",
  "redruby",
  "yellowgranola",
  "greysteel",
];
