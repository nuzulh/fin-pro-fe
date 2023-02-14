import { getCurrentTime, getDateWithFormat } from "helpers/Utils";
import React from "react";
import { Badge, Card, CardBody } from "reactstrap";
import { Colxx } from "../common/CustomBootstrap";

const RkapHistoryListItem = ({ item }) => {
  return (
    <>
      <Colxx xxs="12">
        <Card className="card d-flex mb-3">
          <div className="d-flex flex-grow-1 min-width-zero">
            <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
              <p className="mb-1 text-small w-30 w-xs-100">
                {`${getDateWithFormat(item.created_date)} ${getCurrentTime(
                  item.created_date
                )}`}
              </p>
              <p className="mb-1 text-small w-50 w-xs-100">
                {item.description}
              </p>
              <p className="mb-1 text-small w-20 w-xs-100">
                <Badge
                  pill
                  color={item.status === "NEW" ? "warning" : "success"}
                >
                  {item.status}
                </Badge>
              </p>
            </CardBody>
          </div>
        </Card>
      </Colxx>
    </>
  );
};

export default React.memo(RkapHistoryListItem);
