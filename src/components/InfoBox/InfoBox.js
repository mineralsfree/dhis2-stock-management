import React, { useState } from "react";
import { NoticeBox, Button } from "@dhis2/ui";
import PropTypes from "prop-types";
import styles from "./InfoBox.module.css";
export const InfoBox = (props) => {
  const { title, text, id } = props;
  const [shown, setShown] = useState(
    localStorage.getItem(`info_box_${id}`) !== "true"
  );
  const handleNeverShowClick = (id) => {
    setShown(false);
    localStorage.setItem(`info_box_${id}`, "true");
  };
  return (
    shown && (
      <div className={styles.container}>
        <NoticeBox title={title}>
          {text}
          <div style={{ marginTop: "10px", marginLeft: "1px" }}>
            <Button secondary onClick={() => handleNeverShowClick(id)}>
              Don&apos;t show again
            </Button>
          </div>
        </NoticeBox>
      </div>
    )
  );
};
InfoBox.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  id: PropTypes.string,
};
