import { combineReducers } from "redux";
import settings from "./settings/reducer";
import menu from "./menu/reducer";
import authUser from "./auth/reducer";
import rka from "./rka/reducer";
import rab from "./rab/reducer";
import rpb from "./rpb/reducer";
import persekot from "./persekot/reducer";
import sppd from "./sppd/reducer";
import fee from "./fee/reducer";
import pendapatan from "./pendapatan/reducer";
import dashboard from "./dashboard/reducer";
import category from "./category/reducer";
import upload from "./upload/reducer";
import csvImport from "./csvImport/reducer";
import chart from "./chart/reducer";

const reducers = combineReducers({
  settings,
  menu,
  authUser,
  rka,
  rab,
  rpb,
  persekot,
  sppd,
  fee,
  pendapatan,
  dashboard,
  category,
  upload,
  csvImport,
  chart,
});

export default reducers;
