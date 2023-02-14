import {
  CHART_BY_YEAR_GET,
  CHART_BY_YEAR_GET_SUCCESS,
  CHART_BY_YEAR_GET_ERROR,
  CHART_ON_YEAR_GET,
  CHART_ON_YEAR_GET_SUCCESS,
  CHART_ON_YEAR_GET_ERROR,
} from "../actions";

export const getChartByYear = (type, from, to) => ({
  type: CHART_BY_YEAR_GET,
  payload: { type, from, to },
});

export const getChartByYearSuccess = (items) => ({
  type: CHART_BY_YEAR_GET_SUCCESS,
  payload: items,
});

export const getChartByYearError = (error) => ({
  type: CHART_BY_YEAR_GET_ERROR,
  payload: error,
});

export const getChartOnYear = (type, year) => ({
  type: CHART_ON_YEAR_GET,
  payload: { type, year },
});

export const getChartOnYearSuccess = (items) => ({
  type: CHART_ON_YEAR_GET_SUCCESS,
  payload: items,
});

export const getChartOnYearError = (error) => ({
  type: CHART_ON_YEAR_GET_ERROR,
  payload: error,
});