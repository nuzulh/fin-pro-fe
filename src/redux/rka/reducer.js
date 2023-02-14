import {
  RKA_GET_LIST,
  RKA_GET_LIST_SUCCESS,
  RKA_GET_LIST_ERROR,
  RKA_GET_LIST_WITH_FILTER,
  RKA_GET_LIST_WITH_ORDER,
  RKA_GET_LIST_SEARCH,
  RKA_ADD_ITEM,
  RKA_ADD_ITEM_SUCCESS,
  RKA_ADD_ITEM_ERROR,
  RKA_EDIT_ITEM,
  RKA_EDIT_ITEM_SUCCESS,
  RKA_EDIT_ITEM_ERROR,
} from "../actions";

const INIT_STATE = {
  allRkaItems: null,
  rkaItems: null,
  error: "",
  loading: true,
  filter: null,
  searchKeyword: "",
  pageSize: 5,
  totalPage: null,
  orderColumn: null,
  orderColumns: [
    { column: "activity_code", label: "Kode Aktivitas" },
    { column: "unit", label: "Unit Kerja" },
    { column: "created_date", label: "Tanggal dibuat" },
  ],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case RKA_GET_LIST:
      return {
        ...state,
        loading: false,
        error: "",
      };

    case RKA_GET_LIST_SUCCESS:
      return {
        ...state,
        loading: true,
        allRkaItems: action.payload,
        rkaItems: action.payload,
        totalPage: Math.ceil(action.payload.length / state.pageSize),
      };

    case RKA_GET_LIST_ERROR:
      return { ...state, loading: true, error: action.payload };

    case RKA_GET_LIST_WITH_FILTER:
      if (action.payload.column === "" || action.payload.value === "") {
        return {
          ...state,
          loading: true,
          rkaItems: state.allRkaItems,
          filter: null,
        };
      }
      const filteredItems = state.allRkaItems.filter(
        (item) => item[action.payload.column] === action.payload.value
      );
      return {
        ...state,
        loading: true,
        rkaItems: filteredItems,
        totalPage: Math.ceil(filteredItems.length / state.pageSize),
        filter: {
          column: action.payload.column,
          value: action.payload.value,
        },
      };

    case RKA_GET_LIST_WITH_ORDER:
      if (action.payload === "") {
        return {
          ...state,
          loading: true,
          rkaItems: state.rkaItems,
          orderColumn: null,
        };
      }
      const sortedItems = state.rkaItems.sort((a, b) => {
        if (a[action.payload] < b[action.payload]) return -1;
        if (a[action.payload] > b[action.payload]) return 1;
        return 0;
      });
      return {
        ...state,
        loading: true,
        rkaItems: sortedItems,
        orderColumn: state.orderColumns.find(
          (x) => x.column === action.payload
        ),
      };

    case RKA_GET_LIST_SEARCH:
      if (action.payload === "") {
        return { ...state, rkaItems: state.allRkaItems, searchKeyword: "" };
      }
      const keyword = action.payload.toLowerCase();
      const searchItems = state.allRkaItems.filter(
        (item) =>
          item.activity_code.toLowerCase().indexOf(keyword) > -1 ||
          item.unit.toLowerCase().indexOf(keyword) > -1 ||
          item.created_date.toLowerCase().indexOf(keyword) > -1
      );

      return {
        ...state,
        loading: true,
        rkaItems: searchItems,
        totalPage: Math.ceil(searchItems.length / state.pageSize),
        searchKeyword: action.payload,
      };

    case RKA_ADD_ITEM:
      return { ...state, loading: false };

    case RKA_ADD_ITEM_SUCCESS:
      return { ...state, loading: true };

    case RKA_ADD_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    case RKA_EDIT_ITEM:
      return { ...state, loading: false };

    case RKA_EDIT_ITEM_SUCCESS:
      return {
        ...state,
        loading: true,
        allRkaItems: action.payload,
        rkaItems: action.payload,
      };

    case RKA_EDIT_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    default:
      return { ...state, error: "" };
  }
};
