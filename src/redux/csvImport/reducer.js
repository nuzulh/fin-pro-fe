import {
  CSV_IMPORT,
  CSV_IMPORT_SUCCESS,
  CSV_IMPORT_ERROR,
  CSV_GENERATE,
  CSV_GENERATE_SUCCESS,
  CSV_GENERATE_ERROR,
} from "../actions";

const INIT_STATE = {
  allImportItems: null,
  importItems: null,
  csvKeys: null,
  csvFile: null,
  totalPage: null,
  pageSize: 5,
  uploaded: false,
  loading: true,
  error: "",
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case CSV_IMPORT:
      return {
        ...state,
        loading: false,
      };

    case CSV_IMPORT_SUCCESS:
      const headers = [...action.payload.csvKeys, "isValid", "message"];
      return {
        ...state,
        loading: true,
        allImportItems: action.payload.items,
        importItems: action.payload.items,
        totalPage: Math.ceil(action.payload.items.length / state.pageSize),
        csvKeys: headers,
        uploaded: true,
      };

    case CSV_IMPORT_ERROR:
      return { ...state, loading: true, error: action.payload };

    case CSV_GENERATE:
      return { ...state, loading: false };

    case CSV_GENERATE_SUCCESS:
      return { ...state, loading: true, csvFile: action.payload };

    case CSV_GENERATE_ERROR:
      return { ...state, loading: true, error: action.payload };

    default:
      return { ...state, error: "", uploaded: false, importItems: null };
  }
};
