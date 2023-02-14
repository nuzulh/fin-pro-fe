import {
  PERSEKOT_GET_LIST,
  PERSEKOT_GET_LIST_SUCCESS,
  PERSEKOT_GET_LIST_ERROR,
  PERSEKOT_GET_LIST_WITH_FILTER,
  PERSEKOT_GET_LIST_WITH_ORDER,
  PERSEKOT_GET_LIST_SEARCH,
  PERSEKOT_ADD_ITEM,
  PERSEKOT_ADD_ITEM_SUCCESS,
  PERSEKOT_ADD_ITEM_ERROR,
  PERSEKOT_EDIT_ITEM,
  PERSEKOT_EDIT_ITEM_SUCCESS,
  PERSEKOT_EDIT_ITEM_ERROR,
  PERSEKOT_REPORT_ITEM,
  PERSEKOT_REPORT_ITEM_SUCCESS,
  PERSEKOT_REPORT_ITEM_ERROR,
} from "../actions";

const INIT_STATE = {
  allPersekotItems: null,
  persekotItems: null,
  error: "",
  loading: true,
  filter: null,
  searchKeyword: "",
  pageSize: 5,
  totalPage: null,
  orderColumn: null,
  orderColumns: [
    { column: "persekot_no", label: "No. PERSEKOT" },
    { column: "persekot_name", label: "Judul PERSEKOT" },
    { column: "status", label: "Status" },
    { column: "created_date", label: "Tanggal dibuat" },
  ],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case PERSEKOT_GET_LIST:
      return {
        ...state,
        loading: false,
        error: "",
      };

    case PERSEKOT_GET_LIST_SUCCESS:
      return {
        ...state,
        loading: true,
        allPersekotItems: action.payload,
        persekotItems: action.payload,
        totalPage: Math.ceil(action.payload.length / state.pageSize),
      };

    case PERSEKOT_GET_LIST_ERROR:
      return { ...state, loading: true, error: action.payload };

    case PERSEKOT_GET_LIST_WITH_FILTER:
      if (action.payload.column === "" || action.payload.value === "") {
        return {
          ...state,
          loading: true,
          persekotItems: state.allPersekotItems,
          filter: null,
        };
      }
      const filteredItems = state.allPersekotItems.filter(
        (item) => item[action.payload.column] === action.payload.value
      );
      return {
        ...state,
        loading: true,
        persekotItems: filteredItems,
        totalPage: Math.ceil(filteredItems.length / state.pageSize),
        filter: {
          column: action.payload.column,
          value: action.payload.value,
        },
      };

    case PERSEKOT_GET_LIST_WITH_ORDER:
      if (action.payload === "") {
        return {
          ...state,
          loading: true,
          persekotItems: state.persekotItems,
          orderColumn: null,
        };
      }
      const sortedItems = state.persekotItems.sort((a, b) => {
        if (a[action.payload] < b[action.payload]) return -1;
        if (a[action.payload] > b[action.payload]) return 1;
        return 0;
      });
      return {
        ...state,
        loading: true,
        persekotItems: sortedItems,
        orderColumn: state.orderColumns.find(
          (x) => x.column === action.payload
        ),
      };

    case PERSEKOT_GET_LIST_SEARCH:
      if (action.payload === "") {
        return { ...state, persekotItems: state.allPersekotItems, searchKeyword: "" };
      }
      const keyword = action.payload.toLowerCase();
      const searchItems = state.allPersekotItems.filter(
        (item) =>
          item.persekot_no && item.persekot_no.toLowerCase().indexOf(keyword) > -1 ||
          item.persekot_name.toLowerCase().indexOf(keyword) > -1 ||
          item.status.toLowerCase().indexOf(keyword) > -1 ||
          item.created_date && item.created_date.toLowerCase().indexOf(keyword) > -1
      );

      return {
        ...state,
        loading: true,
        persekotItems: searchItems,
        totalPage: Math.ceil(searchItems.length / state.pageSize),
        searchKeyword: action.payload,
      };

    case PERSEKOT_ADD_ITEM:
      return { ...state, loading: false };

    case PERSEKOT_ADD_ITEM_SUCCESS:
      return { ...state, loading: true };

    case PERSEKOT_ADD_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    case PERSEKOT_EDIT_ITEM:
      return { ...state, loading: false };

    case PERSEKOT_EDIT_ITEM_SUCCESS:
      return {
        ...state,
        loading: true,
        allPersekotItems: action.payload,
        persekotItems: action.payload,
      };

    case PERSEKOT_EDIT_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    case PERSEKOT_REPORT_ITEM:
      return { ...state, loading: false };

    case PERSEKOT_REPORT_ITEM_SUCCESS:
      return {
        ...state,
        loading: true,
        allPersekotItems: action.payload,
        persekotItems: action.payload,
      };

    case PERSEKOT_REPORT_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    default:
      return { ...state, error: "" };
  }
};
