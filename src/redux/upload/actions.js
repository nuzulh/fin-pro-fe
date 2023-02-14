import {
  UPLOAD_FILES,
  UPLOAD_FILES_SUCCESS,
  UPLOAD_FILES_ERROR,
  GET_FILES,
  GET_FILES_SUCCESS,
  GET_FILES_ERROR,
  DELETE_FILE,
  DELETE_FILE_SUCCESS,
  DELETE_FILE_ERROR,
} from "../actions";

export const uploadFiles = (files, type, id, sub_id) => ({
  type: UPLOAD_FILES,
  payload: { files, type, id, sub_id },
});

export const uploadFilesSuccess = (paths) => ({
  type: UPLOAD_FILES_SUCCESS,
  payload: paths,
});

export const uploadFilesError = (error) => ({
  type: UPLOAD_FILES_ERROR,
  payload: error,
});

export const getFiles = (type, id, sub_id) => ({
  type: GET_FILES,
  payload: { type, id, sub_id },
});

export const getFilesSuccess = (paths) => ({
  type: GET_FILES_SUCCESS,
  payload: paths,
});

export const getFilesError = (error) => ({
  type: GET_FILES_ERROR,
  payload: error,
});

export const deleteFile = (type, id, sub_id, fileName) => ({
  type: DELETE_FILE,
  payload: { type, id, sub_id, fileName },
});

export const deleteFileSuccess = (success) => ({
  type: DELETE_FILE_SUCCESS,
  payload: success,
});

export const deleteFileError = (error) => ({
  type: DELETE_FILE_ERROR,
  payload: error,
});
