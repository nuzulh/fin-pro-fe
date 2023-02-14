import {
  SPPD_GET_LIST,
  SPPD_GET_LIST_SUCCESS,
  SPPD_GET_LIST_ERROR,
  SPPD_GET_LIST_WITH_FILTER,
  SPPD_GET_LIST_WITH_ORDER,
  SPPD_GET_LIST_SEARCH,
  SPPD_ADD_ITEM,
  SPPD_ADD_ITEM_SUCCESS,
  SPPD_ADD_ITEM_ERROR,
  SPPD_EDIT_ITEM,
  SPPD_EDIT_ITEM_SUCCESS,
  SPPD_EDIT_ITEM_ERROR,
} from "../actions";

const INIT_STATE = {
  allSppdItems: null,
  sppdItems: null,
  error: "",
  loading: true,
  filter: null,
  searchKeyword: "",
  pageSize: 5,
  totalPage: null,
  orderColumn: null,
  orderColumns: [
    { column: "sppd_no", label: "No. SPPD" },
    { column: "sppd_name", label: "Judul SPPD" },
    { column: "status", label: "Status" },
    { column: "created_date", label: "Tanggal dibuat" },
  ],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SPPD_GET_LIST:
      return {
        ...state,
        loading: false,
        error: "",
      };

    case SPPD_GET_LIST_SUCCESS:
      return {
        ...state,
        loading: true,
        allSppdItems: action.payload,
        sppdItems: action.payload,
        totalPage: Math.ceil(action.payload.length / state.pageSize),
      };

    case SPPD_GET_LIST_ERROR:
      return { ...state, loading: true, error: action.payload };

    case SPPD_GET_LIST_WITH_FILTER:
      if (action.payload.column === "" || action.payload.value === "") {
        return {
          ...state,
          loading: true,
          sppdItems: state.allSppdItems,
          filter: null,
        };
      }
      const filteredItems = state.allSppdItems.filter(
        (item) => item[action.payload.column] === action.payload.value
      );
      return {
        ...state,
        loading: true,
        sppdItems: filteredItems,
        totalPage: Math.ceil(filteredItems.length / state.pageSize),
        filter: {
          column: action.payload.column,
          value: action.payload.value,
        },
      };

    case SPPD_GET_LIST_WITH_ORDER:
      if (action.payload === "") {
        return {
          ...state,
          loading: true,
          sppdItems: state.sppdItems,
          orderColumn: null,
        };
      }
      const sortedItems = state.sppdItems.sort((a, b) => {
        if (a[action.payload] < b[action.payload]) return -1;
        if (a[action.payload] > b[action.payload]) return 1;
        return 0;
      });
      return {
        ...state,
        loading: true,
        sppdItems: sortedItems,
        orderColumn: state.orderColumns.find(
          (x) => x.column === action.payload
        ),
      };

    case SPPD_GET_LIST_SEARCH:
      if (action.payload === "") {
        return { ...state, sppdItems: state.allSppdItems, searchKeyword: "" };
      }
      const keyword = action.payload.toLowerCase();
      const searchItems = state.allSppdItems.filter(
        (item) =>
          item.sppd_no && item.sppd_no.toLowerCase().indexOf(keyword) > -1 ||
          item.sppd_name.toLowerCase().indexOf(keyword) > -1 ||
          item.status.toLowerCase().indexOf(keyword) > -1 ||
          item.created_date.toLowerCase().indexOf(keyword) > -1
      );

      return {
        ...state,
        loading: true,
        sppdItems: searchItems,
        totalPage: Math.ceil(searchItems.length / state.pageSize),
        searchKeyword: action.payload,
      };

    case SPPD_ADD_ITEM:
      return { ...state, loading: false };

    case SPPD_ADD_ITEM_SUCCESS:
      return { ...state, loading: true };

    case SPPD_ADD_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    case SPPD_EDIT_ITEM:
      return { ...state, loading: false };

    case SPPD_EDIT_ITEM_SUCCESS:
      return {
        ...state,
        loading: true,
        allSppdItems: action.payload,
        sppdItems: action.payload,
      };

    case SPPD_EDIT_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    default:
      return { ...state, error: "" };
  }
};
