import {
  PENDAPATAN_GET_LIST,
  PENDAPATAN_GET_LIST_SUCCESS,
  PENDAPATAN_GET_LIST_ERROR,
  PENDAPATAN_GET_LIST_WITH_FILTER,
  PENDAPATAN_GET_LIST_WITH_ORDER,
  PENDAPATAN_GET_LIST_SEARCH,
  PENDAPATAN_ADD_ITEM,
  PENDAPATAN_ADD_ITEM_SUCCESS,
  PENDAPATAN_ADD_ITEM_ERROR,
  PENDAPATAN_EDIT_ITEM,
  PENDAPATAN_EDIT_ITEM_SUCCESS,
  PENDAPATAN_EDIT_ITEM_ERROR,
} from "../actions";

const INIT_STATE = {
  allPendapatanItems: null,
  pendapatanItems: null,
  error: "",
  loading: true,
  filter: null,
  searchKeyword: "",
  pageSize: 5,
  totalPage: null,
  orderColumn: null,
  orderColumns: [
    { column: "income_no", label: "No. PENDAPATAN" },
    { column: "income_name", label: "Judul PENDAPATAN" },
  ],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case PENDAPATAN_GET_LIST:
      return {
        ...state,
        loading: false,
        error: "",
      };

    case PENDAPATAN_GET_LIST_SUCCESS:
      return {
        ...state,
        loading: true,
        allPendapatanItems: action.payload,
        pendapatanItems: action.payload,
        totalPage: Math.ceil(action.payload.length / state.pageSize),
      };

    case PENDAPATAN_GET_LIST_ERROR:
      return { ...state, loading: true, error: action.payload };

    case PENDAPATAN_GET_LIST_WITH_FILTER:
      if (action.payload.column === "" || action.payload.value === "") {
        return {
          ...state,
          loading: true,
          pendapatanItems: state.allPendapatanItems,
          filter: null,
        };
      }
      const filteredItems = state.allPendapatanItems.filter(
        (item) => item[action.payload.column] === action.payload.value
      );
      return {
        ...state,
        loading: true,
        pendapatanItems: filteredItems,
        totalPage: Math.ceil(filteredItems.length / state.pageSize),
        filter: {
          column: action.payload.column,
          value: action.payload.value,
        },
      };

    case PENDAPATAN_GET_LIST_WITH_ORDER:
      if (action.payload === "") {
        return {
          ...state,
          loading: true,
          pendapatanItems: state.pendapatanItems,
          orderColumn: null,
        };
      }
      const sortedItems = state.pendapatanItems.sort((a, b) => {
        if (a[action.payload] < b[action.payload]) return -1;
        if (a[action.payload] > b[action.payload]) return 1;
        return 0;
      });
      return {
        ...state,
        loading: true,
        pendapatanItems: sortedItems,
        orderColumn: state.orderColumns.find(
          (x) => x.column === action.payload
        ),
      };

    case PENDAPATAN_GET_LIST_SEARCH:
      if (action.payload === "") {
        return { ...state, pendapatanItems: state.allPendapatanItems, searchKeyword: "" };
      }
      const keyword = action.payload.toLowerCase();
      const searchItems = state.allPendapatanItems.filter(
        (item) =>
          item.income_no.toLowerCase().indexOf(keyword) > -1 ||
          item.income_name.toLowerCase().indexOf(keyword) > -1
      );

      return {
        ...state,
        loading: true,
        pendapatanItems: searchItems,
        totalPage: Math.ceil(searchItems.length / state.pageSize),
        searchKeyword: action.payload,
      };

    case PENDAPATAN_ADD_ITEM:
      return { ...state, loading: false };

    case PENDAPATAN_ADD_ITEM_SUCCESS:
      return { ...state, loading: true };

    case PENDAPATAN_ADD_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    case PENDAPATAN_EDIT_ITEM:
      return { ...state, loading: false };

    case PENDAPATAN_EDIT_ITEM_SUCCESS:
      return {
        ...state,
        loading: true,
        allPendapatanItems: action.payload,
        pendapatanItems: action.payload,
      };

    case PENDAPATAN_EDIT_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    default:
      return { ...state, error: "" };
  }
};
