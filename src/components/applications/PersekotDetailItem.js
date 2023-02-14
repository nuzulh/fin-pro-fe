import React, { useState } from "react";
import {
  Card,
  CardBody,
  Label,
  Form,
  FormGroup,
  Button,
  Table,
  Row,
  Badge,
} from "reactstrap";
import { Colxx } from "components/common/CustomBootstrap";
import { useHistory } from "react-router-dom";
import CurrencyFormat from "react-currency-format";
import { getCurrentUser, getDateWithFormat } from "helpers/Utils";

const PersekotDetailItem = ({ item, onApprove, onReject }) => {
  const history = useHistory();
  const user = getCurrentUser();
  const [showDetail, setShowDetail] = useState(true);

  return (
    <>
      <Row className="mx-1 mb-3 justify-content-between">
        <h6>No. {item.imprest_no}</h6>
        <div className="d-flex align-items-center">
          <h6 className="mr-3">
            Tanggal diajukan: {getDateWithFormat(item.creation_time)}
          </h6>
          <h6>
            Status:{" "}
            <Badge pill color="warning">
              DIPROSES
            </Badge>
          </h6>
        </div>
      </Row>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Card className="mb-4">
          <CardBody>
            <div
              className="w-100 d-flex align-items-center justify-content-between"
              style={{ cursor: "pointer" }}
              onClick={() => setShowDetail(!showDetail)}
            >
              <h5 className="font-weight-bold">Detail</h5>
              <i className="simple-icon-arrow-down font-weight-bold" />
            </div>
            {showDetail && (
              <>
                <FormGroup className="mt-3">
                  <Label>Judul Persekot</Label>
                  <p className="pl-3">{item.imprest_name}</p>
                </FormGroup>
                <FormGroup>
                  <Label>No. RAB</Label>
                  <p className="pl-3">{item.budget_plan.budget_plan_no}</p>
                </FormGroup>
                <FormGroup>
                  <Label>Judul RAB</Label>
                  <p className="pl-3">{item.budget_plan.budget_plan_name}</p>
                </FormGroup>
                <FormGroup>
                  <Label>Nilai RAB</Label>
                  <Row className="pl-3">
                    <p className="px-3">IDR</p>
                    <CurrencyFormat
                      className="font-weight-bold"
                      prefix="Rp"
                      thousandSeparator={true}
                      displayType={"text"}
                      value={item.budget_plan.total}
                    />
                  </Row>
                </FormGroup>
              </>
            )}
          </CardBody>
        </Card>
        <Card className="mb-4">
          <CardBody>
            <h5 className="font-weight-bold text-center mb-4">
              Rincian Persekot yang diajukan
            </h5>
            <Table className="w-100">
              <thead>
                <tr>
                  <th width="5%">#</th>
                  <th width="35%">Uraian</th>
                  <th width="25%">Kategori</th>
                  <th width="30%">Nilai yang diajukan</th>
                </tr>
              </thead>
              <tbody>
                {item.details &&
                  item.details.map((detail, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: (index + 1) % 2 === 0 ? "#FFF3E7" : "",
                      }}
                    >
                      <td>{index + 1}</td>
                      <td>{detail.description}</td>
                      <td>{detail.category.category_name}</td>
                      <td>
                        <CurrencyFormat
                          prefix="Rp"
                          thousandSeparator={true}
                          displayType={"text"}
                          value={detail.imprest_detail_worth}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            <FormGroup className="mt-4">
              <Label>Total biaya yang diajukan</Label>
              <Row className="pl-3">
                <p className="px-3">IDR</p>
                <CurrencyFormat
                  className="font-weight-bold"
                  prefix="Rp"
                  thousandSeparator={true}
                  displayType={"text"}
                  value={item.imprest_total}
                />
              </Row>
            </FormGroup>
            <Row>
              <Colxx xxs="6">
                <FormGroup>
                  <Label>Dibuat oleh</Label>
                  <p className="pl-3">{item.maker}</p>
                </FormGroup>
              </Colxx>
              <Colxx xxs="6">
                <FormGroup>
                  <Label>Departemen</Label>
                  <p className="pl-3">{item.department_name}</p>
                </FormGroup>
              </Colxx>
            </Row>
            <FormGroup>
              <Label>Diajukan oleh</Label>
              <p className="pl-3">{item.proposed_by}</p>
            </FormGroup>
          </CardBody>
        </Card>
        {user.role === 0 ? (
          <div className="w-100 d-flex justify-content-end">
            <Button
              onClick={() =>
                onReject({
                  maintenance_id: item.maintenance_id,
                  reference_number: item.reference_number,
                  primary_code: item.primary_code,
                  menu_path: item.menu_path,
                })
              }
              outline
              size="lg"
              color="primary btn-shadow mr-3"
            >
              Tolak
            </Button>
            <Button
              onClick={() =>
                onApprove({
                  maintenance_id: item.maintenance_id,
                  reference_number: item.reference_number,
                  primary_code: item.primary_code,
                  menu_path: item.menu_path,
                })
              }
              size="lg"
              color="primary btn-shadow"
            >
              Setujui
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => history.goBack()}
            size="lg"
            color="primary w-100 btn-shadow"
          >
            Kembali ke halaman sebelumnya
          </Button>
        )}
      </Form>
    </>
  );
};

export default PersekotDetailItem;
