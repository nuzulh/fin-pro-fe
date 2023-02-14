import {
  CSV_IMPORT,
  CSV_IMPORT_SUCCESS,
  CSV_IMPORT_ERROR,
  CSV_GENERATE,
  CSV_GENERATE_SUCCESS,
  CSV_GENERATE_ERROR,
} from "../actions";

export const importCsv = (type, file) => ({
  type: CSV_IMPORT,
  payload: { type, file },
});

export const importCsvSuccess = (items, csvKeys) => ({
  type: CSV_IMPORT_SUCCESS,
  payload: { items, csvKeys },
});

export const importCsvError = (error) => ({
  type: CSV_IMPORT_ERROR,
  payload: error,
});

export const generateCsv = (type, csvKeys, items) => ({
  type: CSV_GENERATE,
  payload: { type, csvKeys, items },
});

export const generateCsvSuccess = (file) => ({
  type: CSV_GENERATE_SUCCESS,
  payload: file,
});

export const generateCsvError = (error) => ({
  type: CSV_GENERATE_ERROR,
  payload: error,
});
