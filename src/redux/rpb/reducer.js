import {
  RPB_GET_LIST,
  RPB_GET_LIST_SUCCESS,
  RPB_GET_LIST_ERROR,
  RPB_GET_LIST_WITH_FILTER,
  RPB_GET_LIST_WITH_ORDER,
  RPB_GET_LIST_SEARCH,
  RPB_ADD_ITEM,
  RPB_ADD_ITEM_SUCCESS,
  RPB_ADD_ITEM_ERROR,
  RPB_EDIT_ITEM,
  RPB_EDIT_ITEM_SUCCESS,
  RPB_EDIT_ITEM_ERROR,
} from "../actions";

const INIT_STATE = {
  allRpbItems: null,
  rpbItems: null,
  error: "",
  loading: true,
  filter: null,
  searchKeyword: "",
  pageSize: 5,
  totalPage: null,
  orderColumn: null,
  orderColumns: [
    { column: "pkm_no", label: "No. RPB" },
    { column: "pkm_name", label: "Judul RPB" },
    { column: "status", label: "Status" },
    { column: "created_date", label: "Tanggal dibuat" },
  ],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case RPB_GET_LIST:
      return {
        ...state,
        loading: false,
        error: "",
      };

    case RPB_GET_LIST_SUCCESS:
      return {
        ...state,
        loading: true,
        allRpbItems: action.payload,
        rpbItems: action.payload,
        totalPage: Math.ceil(action.payload.length / state.pageSize),
      };

    case RPB_GET_LIST_ERROR:
      return { ...state, loading: true, error: action.payload };

    case RPB_GET_LIST_WITH_FILTER:
      if (action.payload.column === "" || action.payload.value === "") {
        return {
          ...state,
          loading: true,
          rpbItems: state.allRpbItems,
          filter: null,
        };
      }
      const filteredItems = state.allRpbItems.filter(
        (item) => item[action.payload.column] === action.payload.value
      );
      return {
        ...state,
        loading: true,
        rpbItems: filteredItems,
        totalPage: Math.ceil(filteredItems.length / state.pageSize),
        filter: {
          column: action.payload.column,
          value: action.payload.value,
        },
      };

    case RPB_GET_LIST_WITH_ORDER:
      if (action.payload === "") {
        return {
          ...state,
          loading: true,
          rpbItems: state.rpbItems,
          orderColumn: null,
        };
      }
      const sortedItems = state.rpbItems.sort((a, b) => {
        if (a[action.payload] < b[action.payload]) return -1;
        if (a[action.payload] > b[action.payload]) return 1;
        return 0;
      });
      return {
        ...state,
        loading: true,
        rpbItems: sortedItems,
        orderColumn: state.orderColumns.find(
          (x) => x.column === action.payload
        ),
      };

    case RPB_GET_LIST_SEARCH:
      if (action.payload === "") {
        return { ...state, rpbItems: state.allRpbItems, searchKeyword: "" };
      }
      const keyword = action.payload.toLowerCase();
      const searchItems = state.allRpbItems.filter(
        (item) =>
          item.pkm_no && item.pkm_no.toLowerCase().indexOf(keyword) > -1 ||
          item.pkm_name.toLowerCase().indexOf(keyword) > -1 ||
          item.status.toLowerCase().indexOf(keyword) > -1 ||
          item.created_date && item.created_date.toLowerCase().indexOf(keyword) > -1
      );

      return {
        ...state,
        loading: true,
        rpbItems: searchItems,
        totalPage: Math.ceil(searchItems.length / state.pageSize),
        searchKeyword: action.payload,
      };

    case RPB_ADD_ITEM:
      return { ...state, loading: false };

    case RPB_ADD_ITEM_SUCCESS:
      return { ...state, loading: true };

    case RPB_ADD_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    case RPB_EDIT_ITEM:
      return { ...state, loading: false };

    case RPB_EDIT_ITEM_SUCCESS:
      return {
        ...state,
        loading: true,
        allRpbItems: action.payload,
        rpbItems: action.payload,
      };

    case RPB_EDIT_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    default:
      return { ...state, error: "" };
  }
};
