import React, { useEffect, useState } from "react";
import {
  Input,
  Row,
} from "reactstrap";

const ItemNoForm = ({ type, onChange }) => {
  const [data, setData] = useState({
    no: "",
    code: "",
    month: "",
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    onChange(`${data.no}/${type}/CDB-${data.code}/${data.month}/${data.year}`);
  }, [data]);

  return (
    <Row className="mx-1 mb-3 d-flex">
      <h6 className="my-auto">No.</h6>
      <Input
        required
        className="p-1 mx-2"
        style={{
          width: "5rem",
          outline: "none",
          borderColor: "transparent",
          background: "transparent",
          borderBottomWidth: "1",
          borderBottomColor: "black",
        }}
        value={data.no}
        onChange={(e) => setData({ ...data, no: e.target.value })}
      />
      <h6 className="my-auto">/{type}/CDB-</h6>
      <Input
        required
        className="p-1 mx-2"
        style={{
          width: "9rem",
          outline: "none",
          borderColor: "transparent",
          background: "transparent",
          borderBottomWidth: "1",
          borderBottomColor: "black",
        }}
        placeholder="Kode divisi/proyek"
        value={data.code}
        onChange={(e) => setData({ ...data, code: e.target.value })}
      />
      <h6 className="my-auto">/</h6>
      <Input
        required
        className="p-1 mx-2"
        style={{
          width: "4rem",
          outline: "none",
          borderColor: "transparent",
          background: "transparent",
          borderBottomWidth: "1",
          borderBottomColor: "black",
        }}
        placeholder="Bulan"
        value={data.month}
        onChange={(e) => setData({ ...data, month: e.target.value })}
      />
      <h6 className="my-auto">/</h6>
      <Input
        required
        className="p-1 mx-2"
        style={{
          width: "6rem",
          outline: "none",
          borderColor: "transparent",
          background: "transparent",
          borderBottomWidth: "1",
          borderBottomColor: "black",
        }}
        type="number"
        placeholder="Tahun"
        value={data.year}
        onChange={(e) => setData({ ...data, year: e.target.value })}
      />
    </Row>
  );
}

export default React.memo(ItemNoForm);