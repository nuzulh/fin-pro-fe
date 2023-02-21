import {
  CSV_IMPORT,
  CSV_IMPORT_SUCCESS,
  CSV_IMPORT_ERROR,
  CSV_GENERATE,
  CSV_GENERATE_SUCCESS,
  CSV_GENERATE_ERROR,
  CSV_ENTRY_GET_TEMPLATE,
  CSV_ENTRY_IMPORT,
  CSV_ENTRY_IMPORT_SUCCESS,
  CSV_ENTRY_IMPORT_ERROR,
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

export const entryGetCsvTemplate = (entryHeaders) => ({
  type: CSV_ENTRY_GET_TEMPLATE,
  payload: entryHeaders,
});

export const entryImportCsv = (items) => ({
  type: CSV_ENTRY_IMPORT,
  payload: items,
});

export const entryImportCsvSuccess = (items) => ({
  type: CSV_ENTRY_IMPORT_SUCCESS,
  payload: items,
});

export const entryImportCsvError = (error) => ({
  type: CSV_ENTRY_IMPORT_ERROR,
  payload: error,
});
