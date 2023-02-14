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

const INIT_STATE = {
  paths: null,
  loading: true,
  error: "",
  success: false,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPLOAD_FILES:
      return {
        ...state,
        loading: false,
      };

    case UPLOAD_FILES_SUCCESS:
      const cleanPaths = action.payload.map((x) => `${x.split("/").pop()}**`);
      return { ...state, loading: true, paths: cleanPaths };

    case UPLOAD_FILES_ERROR:
      return { ...state, loading: true, error: action.payload };

    case GET_FILES:
      return {
        ...state,
        loading: false,
        success: false,
      };

    case GET_FILES_SUCCESS:
      return { ...state, loading: true, paths: action.payload };

    case GET_FILES_ERROR:
      return { ...state, loading: true, error: action.payload };

    case DELETE_FILE:
      return {
        ...state,
        loading: false,
      };

    case DELETE_FILE_SUCCESS:
      return { ...state, loading: true, success: action.payload };

    case DELETE_FILE_ERROR:
      return { ...state, loading: true, error: action.payload };

    default:
      return { ...state, error: "", paths: null };
  }
};
