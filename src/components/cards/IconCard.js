import React from 'react';
import { Card, CardBody } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';

const IconCard = ({ className = 'mb-4 mr-3', icon, title, value }) => {
  return (
    <div className={`icon-row-item ${className}`}>
      <Card
        style={{
          width: 'fit-content',
        }}
      >
        <CardBody
          className="text-center"
          style={{
            minWidth: '10rem',
          }}
        >
          <i className={icon} />
          <p className="card-text font-weight-semibold mb-0">{title}</p>
          <p className="lead text-center">{value}</p>
        </CardBody>
      </Card>
    </div>
  );
};

export default React.memo(IconCard);
