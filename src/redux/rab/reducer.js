import {
  RAB_GET_LIST,
  RAB_GET_LIST_SUCCESS,
  RAB_GET_LIST_ERROR,
  RAB_GET_LIST_WITH_FILTER,
  RAB_GET_LIST_WITH_ORDER,
  RAB_GET_LIST_SEARCH,
  RAB_ADD_ITEM,
  RAB_ADD_ITEM_SUCCESS,
  RAB_ADD_ITEM_ERROR,
  RAB_EDIT_ITEM,
  RAB_EDIT_ITEM_SUCCESS,
  RAB_EDIT_ITEM_ERROR,
  RAB_PROGRES_GET_LIST,
  RAB_PROGRES_GET_LIST_SUCCESS,
  RAB_PROGRES_GET_LIST_ERROR,
  RAB_SUMMARY_EXPORT,
  RAB_SUMMARY_EXPORT_SUCCESS,
  RAB_SUMMARY_EXPORT_ERROR,
} from "../actions";

const INIT_STATE = {
  allRabItems: null,
  rabItems: null,
  error: "",
  loading: true,
  filter: null,
  searchKeyword: "",
  pageSize: 5,
  totalPage: null,
  orderColumn: null,
  orderColumns: [
    { column: "rab_no", label: "No. RAB" },
    { column: "rab_name", label: "Judul RAB" },
    { column: "status", label: "Status" },
    { column: "created_date", label: "Tanggal dibuat" },
  ],
  summaryItems: null,
  summaryHeaders: [
    "No.",
    "No. RAB",
    "Judul RAB",
    "Nilai RAB",
    "Realisasi Persekot",
    "Realisasi LPJ Persekot",
    "Realisasi SPPD",
    "Realisasi Fee Project",
    "Realisasi RPB",
    "Total Realisasi",
    "Selisih",
  ],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case RAB_GET_LIST:
      return {
        ...state,
        loading: false,
        error: "",
      };

    case RAB_GET_LIST_SUCCESS:
      return {
        ...state,
        loading: true,
        allRabItems: action.payload,
        rabItems: action.payload,
        totalPage: Math.ceil(action.payload.length / state.pageSize),
      };

    case RAB_GET_LIST_ERROR:
      return { ...state, loading: true, error: action.payload };

    case RAB_GET_LIST_WITH_FILTER:
      if (action.payload.column === "" || action.payload.value === "") {
        return {
          ...state,
          loading: true,
          rabItems: state.allRabItems,
          filter: null,
        };
      }
      const filteredItems = state.allRabItems.filter(
        (item) => item[action.payload.column] === action.payload.value
      );
      return {
        ...state,
        loading: true,
        rabItems: filteredItems,
        totalPage: Math.ceil(filteredItems.length / state.pageSize),
        filter: {
          column: action.payload.column,
          value: action.payload.value,
        },
      };

    case RAB_GET_LIST_WITH_ORDER:
      if (action.payload === "") {
        return {
          ...state,
          loading: true,
          rabItems: state.rabItems,
          orderColumn: null,
        };
      }
      const sortedItems = state.rabItems.sort((a, b) => {
        if (a[action.payload] < b[action.payload]) return -1;
        if (a[action.payload] > b[action.payload]) return 1;
        return 0;
      });
      return {
        ...state,
        loading: true,
        rabItems: sortedItems,
        orderColumn: state.orderColumns.find(
          (x) => x.column === action.payload
        ),
      };

    case RAB_GET_LIST_SEARCH:
      if (action.payload === "") {
        return { ...state, rabItems: state.allRabItems, searchKeyword: "" };
      }
      const keyword = action.payload.toLowerCase();
      const searchItems = state.allRabItems.filter(
        (item) =>
          item.rab_no.toLowerCase().indexOf(keyword) > -1 ||
          item.rab_name.toLowerCase().indexOf(keyword) > -1 ||
          item.status.toLowerCase().indexOf(keyword) > -1 ||
          item.created_date.toLowerCase().indexOf(keyword) > -1
      );

      return {
        ...state,
        loading: true,
        rabItems: searchItems,
        totalPage: Math.ceil(searchItems.length / state.pageSize),
        searchKeyword: action.payload,
      };

    case RAB_ADD_ITEM:
      return { ...state, loading: false };

    case RAB_ADD_ITEM_SUCCESS:
      return { ...state, loading: true };

    case RAB_ADD_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    case RAB_EDIT_ITEM:
      return { ...state, loading: false };

    case RAB_EDIT_ITEM_SUCCESS:
      return {
        ...state,
        loading: true,
        allRabItems: action.payload,
        rabItems: action.payload,
      };

    case RAB_EDIT_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    case RAB_PROGRES_GET_LIST:
      return { ...state, loading: false };

    case RAB_PROGRES_GET_LIST_SUCCESS:
      return {
        ...state,
        loading: true,
        allRabItems: action.payload,
        rabItems: action.payload,
        totalPage: Math.ceil(action.payload.length / state.pageSize),
      };

    case RAB_PROGRES_GET_LIST_ERROR:
      return { ...state, loading: true, error: action.payload };

    case RAB_SUMMARY_EXPORT:
      return { ...state, loading: false };

    case RAB_SUMMARY_EXPORT_SUCCESS:
      return {
        ...state,
        summaryItems: action.payload,
        loading: true,
      };

    case RAB_SUMMARY_EXPORT_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: true,
      };

    default:
      return { ...state, error: "" };
  }
};
