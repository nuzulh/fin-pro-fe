import {
  FEE_GET_LIST,
  FEE_GET_LIST_SUCCESS,
  FEE_GET_LIST_ERROR,
  FEE_GET_LIST_WITH_FILTER,
  FEE_GET_LIST_WITH_ORDER,
  FEE_GET_LIST_SEARCH,
  FEE_ADD_ITEM,
  FEE_ADD_ITEM_SUCCESS,
  FEE_ADD_ITEM_ERROR,
  FEE_EDIT_ITEM,
  FEE_EDIT_ITEM_SUCCESS,
  FEE_EDIT_ITEM_ERROR,
} from "../actions";

const INIT_STATE = {
  allFeeItems: null,
  feeItems: null,
  error: "",
  loading: true,
  filter: null,
  searchKeyword: "",
  pageSize: 5,
  totalPage: null,
  orderColumn: null,
  orderColumns: [
    { column: "fee_project_no", label: "No. Fee Project" },
    { column: "fee_project_name", label: "Judul Fee Project" },
    { column: "status", label: "Status" },
    { column: "created_date", label: "Tanggal dibuat" },
  ],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case FEE_GET_LIST:
      return {
        ...state,
        loading: false,
        error: "",
      };

    case FEE_GET_LIST_SUCCESS:
      return {
        ...state,
        loading: true,
        allFeeItems: action.payload,
        feeItems: action.payload,
        totalPage: Math.ceil(action.payload.length / state.pageSize),
      };

    case FEE_GET_LIST_ERROR:
      return { ...state, loading: true, error: action.payload };

    case FEE_GET_LIST_WITH_FILTER:
      if (action.payload.column === "" || action.payload.value === "") {
        return {
          ...state,
          loading: true,
          feeItems: state.allFeeItems,
          filter: null,
        };
      }
      const filteredItems = state.allFeeItems.filter(
        (item) => item[action.payload.column] === action.payload.value
      );
      return {
        ...state,
        loading: true,
        feeItems: filteredItems,
        totalPage: Math.ceil(filteredItems.length / state.pageSize),
        filter: {
          column: action.payload.column,
          value: action.payload.value,
        },
      };

    case FEE_GET_LIST_WITH_ORDER:
      if (action.payload === "") {
        return {
          ...state,
          loading: true,
          feeItems: state.feeItems,
          orderColumn: null,
        };
      }
      const sortedItems = state.feeItems.sort((a, b) => {
        if (a[action.payload] < b[action.payload]) return -1;
        if (a[action.payload] > b[action.payload]) return 1;
        return 0;
      });
      return {
        ...state,
        loading: true,
        feeItems: sortedItems,
        orderColumn: state.orderColumns.find(
          (x) => x.column === action.payload
        ),
      };

    case FEE_GET_LIST_SEARCH:
      if (action.payload === "") {
        return { ...state, feeItems: state.allFeeItems, searchKeyword: "" };
      }
      const keyword = action.payload.toLowerCase();
      const searchItems = state.allFeeItems.filter(
        (item) =>
          item.fee_project_no && item.fee_project_no.toLowerCase().indexOf(keyword) > -1 ||
          item.fee_project_name.toLowerCase().indexOf(keyword) > -1 ||
          item.status.toLowerCase().indexOf(keyword) > -1 ||
          item.created_date.toLowerCase().indexOf(keyword) > -1
      );

      return {
        ...state,
        loading: true,
        feeItems: searchItems,
        totalPage: Math.ceil(searchItems.length / state.pageSize),
        searchKeyword: action.payload,
      };

    case FEE_ADD_ITEM:
      return { ...state, loading: false };

    case FEE_ADD_ITEM_SUCCESS:
      return { ...state, loading: true };

    case FEE_ADD_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    case FEE_EDIT_ITEM:
      return { ...state, loading: false };

    case FEE_EDIT_ITEM_SUCCESS:
      return {
        ...state,
        loading: true,
        allFeeItems: action.payload,
        feeItems: action.payload,
      };

    case FEE_EDIT_ITEM_ERROR:
      return { ...state, loading: true, error: action.payload };

    default:
      return { ...state, error: "" };
  }
};
