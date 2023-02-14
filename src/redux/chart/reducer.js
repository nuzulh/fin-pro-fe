import { chartKeysTranslate } from "constants/defaultValues";
import { toCamelCase } from "helpers/Utils";
import {
  CHART_BY_YEAR_GET,
  CHART_BY_YEAR_GET_SUCCESS,
  CHART_BY_YEAR_GET_ERROR,
  CHART_ON_YEAR_GET,
  CHART_ON_YEAR_GET_SUCCESS,
  CHART_ON_YEAR_GET_ERROR,
} from "../actions";

const INIT_STATE = {
  byYearLabels: null,
  byYearDatasets: null,
  byYearItems: null,
  onYearLabels: null,
  onYearDatasets: null,
  onYearItems: null,
  colors: ["#27AB9B", "#FF005C", "#47F1DD", "#FF8A00"],
  loading: true,
  error: "",
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case CHART_BY_YEAR_GET:
      return {
        ...state,
        loading: false,
      };

    case CHART_BY_YEAR_GET_SUCCESS:
      const labels = Object.keys(action.payload);
      const dataKeys = Object.keys(action.payload[labels[0]]);
      const datasets = dataKeys.map((key, i) => ({
        label: chartKeysTranslate[key],
        backgroundColor: state.colors[i],
        barThickness: 10,
        borderRadius: 20,
        data: labels.map((x) => action.payload[x][key]),
      }));

      return {
        ...state,
        loading: true,
        byYearItems: action.payload,
        byYearLabels: labels.map((x) => toCamelCase(x)),
        byYearDatasets: datasets,
      };

    case CHART_BY_YEAR_GET_ERROR:
      return { ...state, loading: true, error: action.payload };

    case CHART_ON_YEAR_GET:
      return {
        ...state,
        loading: false,
      };

    case CHART_ON_YEAR_GET_SUCCESS:
      const labels2 = Object.keys(action.payload).filter((x) => x !== "year");
      const dataKeys2 = Object.keys(action.payload[labels2[0]]);
      const datasets2 = dataKeys2.map((key, i) => ({
        label: chartKeysTranslate[key],
        data: labels2.map((x) => action.payload[x][key]),
        backgroundColor: state.colors[i],
        barThickness: 10,
        borderRadius: 20,
      }));

      return {
        ...state,
        loading: true,
        onYearItems: action.payload,
        onYearLabels: labels2.map((x) => toCamelCase(x)),
        onYearDatasets: datasets2,
      };

    case CHART_ON_YEAR_GET_ERROR:
      return { ...state, loading: true, error: action.payload };

    default:
      return { ...state, error: "" };
  }
};
