import { getCurrentTime, getDateWithFormat } from "helpers/Utils";
import React, { useState } from "react";
import { Badge, Card, CardBody } from "reactstrap";
import { Colxx } from "components/common/CustomBootstrap";
import { incomeColor } from "constants/defaultValues";
import UploadModal from "widgets/common/UploadModal";

const PendapatanHistoryListItem = ({ item }) => {
  const [showUpload, setShowUpload] = useState({
    show: false,
    id: "",
  });

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
                <Badge pill color={incomeColor[item.status]}>
                  {item.status}
                </Badge>
              </p>
              <p className="mb-1 text-small w-10 w-xs-100">
                <i
                  hidden={item.status === "NEW"}
                  className="simple-icon-folder-alt text-primary c-pointer p-2"
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                  onClick={() => {
                    setShowUpload({
                      show: true,
                      id: item[`${item.status.toLowerCase()}_no`].split("/").join("-"),
                    })
                  }}
                />
              </p>
            </CardBody>
          </div>
        </Card>
      </Colxx>
      <UploadModal
        isOpen={showUpload.show}
        toggle={() => setShowUpload(!showUpload.show)}
        label={`Bukti transaksi ${item.status}`}
        subLabel={`Silahkan unggah transaksi ${item.status}`}
        fileTypes={["JPG", "PNG", "PDF"]}
        type="income"
        onClose={() => setShowUpload(false)}
        itemId={item.income_id}
        subItemId={showUpload.id}
      />
    </>
  );
};

export default React.memo(PendapatanHistoryListItem);
