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
  entryTemplate: null,
  entryHeaders: null,
  entryItems: null,
  entrySuccess: false,
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

    case CSV_ENTRY_GET_TEMPLATE:
      const rowCount = 3;
      const template = [];
      for (let i = 1; i <= rowCount; i++) {
        let temp = {};
        action.payload.map((key) => {
          if (key === "Nilai") temp[`${key}`] = 10000 * i;
          else if (key === "Kuantitas") temp[`${key}`] = 2;
          else if (key === "Jumlah Nilai") temp[`${key}`] = 20000 * i;
          else if (key === "PPN (Rp)") temp[`${key}`] = 1100 * i;
          else if (key === "PPh (Rp)") temp[`${key}`] = 250 * i;
          else if (key === "Kategori") temp[`${key}`] = "Konsumsi";
          else if (key === "Satuan") temp[`${key}`] = "Lot";
          else if (key.includes("Tgl.")) temp[`${key}`] = "2022-12-29";
          else temp[`${key}`] = `ABC ${i}`;
        });
        template.push(temp);
      }
      return {
        ...state,
        entryHeaders: action.payload,
        entryTemplate: template,
      };

    case CSV_ENTRY_IMPORT:
      return { ...state, loading: false };

    case CSV_ENTRY_IMPORT_SUCCESS:
      return {
        ...state,
        loading: true,
        entryItems: action.payload,
      };

    case CSV_ENTRY_IMPORT_ERROR:
      return { ...state, loading: true, error: action.payload };

    default:
      return { ...state, error: "", uploaded: false, importItems: null };
  }
};
