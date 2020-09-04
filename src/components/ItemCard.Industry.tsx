

import React, { useCallback } from 'react';
import moment from 'moment';

import { Item, useStore, ManufatureData } from '../store';
import { AttributeBox, ItemLink } from '.';

import styles from './ItemCard.Industry.module.css';
import { formatDuration } from '../utils';

interface Props {
  id: number | string;
  item: Item;
}

export const ItemCardIndustry: React.FC<Props> = ({ id, item }) => {
  const { addBlueprintExport } = useStore();
  const industry: ManufatureData = useStore(useCallback(state => state?.industry.manufacture[id] ?? state?.industry.item_manufacturing[item.product], [ id ]));
  
  if (!industry) {
    return <section>
      <h2 style={{ borderColor: 'red' }}>Data error!</h2>
      <p>This item's data is incomplete. Maybe it's not ready to be in the game yet.</p>
    </section>
  }

  function addToExport() {
    addBlueprintExport(id);
  }

  return <section className={styles.industry}>
    <h2>Output:</h2>
    <AttributeBox label={<ItemLink id={industry.product_type_id}/>}>{ industry.output_num }</AttributeBox>
<AttributeBox label="Time">{ formatDuration(moment.duration(industry.time, 's')) }</AttributeBox>
    <h2>
      Production cost:
      <button onClick={addToExport}>[ export ]</button>
    </h2>
    <AttributeBox label="ISK">{ industry.money.toLocaleString() }</AttributeBox>
    { Object.entries(industry.material).map(([id, value]) => <AttributeBox key={id} label={<ItemLink id={id}/>}>{value.toLocaleString()}</AttributeBox>) }
  
    {/* { Object.entries(industry).map(([k, v]) => <div>{k}: <strong>{JSON.stringify(v)}</strong></div>) } */}
  </section>;
};