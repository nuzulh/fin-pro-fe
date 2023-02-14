import { Colxx } from "components/common/CustomBootstrap";
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody } from "reactstrap";

const PendingCard = ({ type, total }) => {
  const colors = {
    RAB: "linear-gradient(209.74deg, #FFE600 -3.2%, #00B8B8 113.48%)",
    RPB: "linear-gradient(209.74deg, #FFE600 -3.2%, #E45200 113.48%)",
    PERSEKOT: "linear-gradient(209.74deg, #7000FF -3.2%, #E40000 113.48%)",
  }

  return (
    <Colxx lg="4" md="6" className="mb-4">
      <Link
        to={{
          pathname: `${type.toLowerCase()}-pending`,
          state: { type },
        }}
      >
        <Card
          style={{
            color: "white",
            background: colors[type],
          }}
        >
          <CardBody className="d-flex align-items center justify-content-between">
            <div>
              <h1 className="h-100 d-flex align-items-center text-large">
                <strong>{type}</strong>
              </h1>
            </div>
            <h1
              className="my-auto text-right"
              style={{
                fontSize: "3rem",
              }}
            >
              <strong>{total}</strong>
              <p className="h5">
                Menunggu
                <br />
                persetujuan
              </p>
            </h1>
          </CardBody>
        </Card>
      </Link>
    </Colxx>
  );
};

export default React.memo(PendingCard);