import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";

const SwitchMenuButton = ({ label1, label2, open1, openedMenu, width, className = "" }) => {
  const [isOpen1, setIsOpen1] = useState(open1);
  const [isOpen2, setIsOpen2] = useState(!open1);

  useEffect(() => {
    openedMenu(isOpen1);
  }, [isOpen1]);

  return (
    <div className={`d-flex align-items-center ${className}`}>
      <Button
        outline={!isOpen1}
        color="primary"
        onClick={() => {
          setIsOpen1(true);
          setIsOpen2(false);
        }}
        style={{ width: `${width}rem` }}
        className="mr-3"
      >
        {label1}
      </Button>
      <Button
        outline={!isOpen2}
        color="primary"
        onClick={() => {
          setIsOpen2(true);
          setIsOpen1(false);
        }}
        style={{ width: `${width}rem` }}
      >
        {label2}
      </Button>
    </div>
  );
};

export default React.memo(SwitchMenuButton);
