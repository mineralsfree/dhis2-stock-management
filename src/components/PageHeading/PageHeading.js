import PropTypes from "prop-types";
import { IconInfo24, Tooltip } from "@dhis2/ui";
import styles from "./PageHeading.module.css";
import React from "react";

export const PageHeading = (props) => {
  const { content, title, variant } = props;
  return (
    <div className={styles.stripe}>
      {variant === "h3" && <h3>{title}</h3>}
      {variant === "h1" && <h1>{title}</h1>}
      <Tooltip className={styles.info} content={content} placement="right">
        <IconInfo24 />
      </Tooltip>
    </div>
  );
};
PageHeading.propTypes = {
  content: PropTypes.string,
  title: PropTypes.string,
  variant: PropTypes.string,
};
