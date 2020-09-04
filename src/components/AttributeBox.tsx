import React from 'react';

import styles from './AttributeBox.module.css';

interface Props {
  label: string | React.ReactElement;
}

export const AttributeBox: React.FC<Props> = ({ label, children }) => {
  return <div className={styles.attributeBox}>
    <span>{ label }</span>
    <strong>{ children }</strong>
  </div>
}