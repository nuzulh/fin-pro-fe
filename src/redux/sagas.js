import { all } from "redux-saga/effects";
import authSagas from "./auth/saga";
import rka from "./rka/saga";
import rab from "./rab/saga";
import rpb from "./rpb/saga";
import persekot from "./persekot/saga";
import sppd from "./sppd/saga";
import fee from "./fee/saga";
import pendapatan from "./pendapatan/saga";
import dashboard from "./dashboard/saga";
import category from "./category/saga";
import upload from "./upload/saga";
import csvImport from "./csvImport/saga";
import chart from "./chart/saga";

export default function* rootSaga() {
  yield all([
    authSagas(),
    rka(),
    rab(),
    rpb(),
    persekot(),
    sppd(),
    fee(),
    pendapatan(),
    dashboard(),
    category(),
    upload(),
    csvImport(),
    chart(),
  ]);
}
