import React, { useEffect, useState } from "react";
import {
  Button,
  Collapse,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Colxx, Separator } from "components/common/CustomBootstrap";

const SearchOptions = ({ placeholder, columns, onSearch, className = "" }) => {
  const [displayOptionsIsOpen, setDisplayOptionsIsOpen] = useState(false);
  const [filter, setFilter] = useState("Semua");

  useEffect(() => {
    if (filter === "Semua") {
      onSearch("");
    } else {
      onSearch(filter);
    }
  }, [filter]);

  return (
    <div className={`mb-3 ${className}`}>
      <Button
        color="empty"
        className="pt-0 pl-0 d-inline-block d-md-none"
        onClick={() => setDisplayOptionsIsOpen(!displayOptionsIsOpen)}
      >
        Tampilkan opsi <i className="simple-icon-arrow-down align-middle" />
      </Button>
      <Collapse
        id="displayOptions"
        className="d-md-block"
        isOpen={displayOptionsIsOpen}
      >
        <div className="d-block mb-2 d-md-flex">
          {columns && (
            <UncontrolledDropdown className="mr-1 float-md-left btn-group mb-1">
              <DropdownToggle caret color="outline-dark" size="xs">
                Tampilkan: {filter}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    setFilter("Semua");
                  }}
                >
                  Semua
                </DropdownItem>
                <Separator className="my-2" />
                {columns.map((col, index) => (
                  <DropdownItem
                    key={index}
                    onClick={() => {
                      setFilter(col);
                    }}
                  >
                    {col}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
          <Colxx lg="3" md="6" xxs="10" className="p-0">
            <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top w-100">
              <input
                type="text"
                name="keyword"
                id="search"
                className="w-100"
                placeholder={placeholder}
                onChange={(e) => {
                  setFilter("Semua");
                  onSearch(e.target.value);
                }}
              />
            </div>
          </Colxx>
        </div>
      </Collapse>
    </div>
  );
};

export default React.memo(SearchOptions);
