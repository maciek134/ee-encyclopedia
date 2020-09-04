import React from 'react';
import * as XLSX from 'xlsx';

import { useStore, useI18n } from '../store';
import { ItemLink } from '.';

import styles from './ExportCard.module.css';
import moment from 'moment';

const selector = state => [
  state.items,
  state.industry,
  state.exportBlueprints,
  state.removeBlueprintExport,
  state.clearBlueprintExport
];

export const ExportCard: React.FC<{}> = () => {
  const [ items, industry, exportBlueprints, removeBlueprintExport, clearBlueprintExport ] = useStore(selector);
  const i18n = useI18n();

  if (exportBlueprints.length < 1) {
    return null;
  }

  function generateSheet() {
    const materials = new Set([]);
    const blueprintData = [];
    // generate header
    exportBlueprints.forEach((id: number, i: number) => {
      blueprintData[i] = {};
      blueprintData[i].Blueprint = i18n(items[id].name);
      const industryData = industry.manufacture[id] ?? industry.item_manufacturing[items[id].product];
      blueprintData[i].ISK = industryData.money;
      Object.entries(industryData.material).forEach(([ id, count ]) => {
        const name = i18n(items[id].name);
        materials.add(name);
        blueprintData[i][name] = count;
      });
    });
    const header = [ 'Blueprint', 'ISK', ...Array.from(materials).sort() ];
    const data = blueprintData.map((v: any) => [ ...header ].map(name => v[name] ?? 0));
    const sheet = XLSX.utils.aoa_to_sheet([ header, ...data ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, 'Blueprint Costs');
    return wb;
  }

  async function save(format: string) {
    XLSX.writeFile(generateSheet(), `blueprints-${moment().format('YYYYMMDD-HHmm')}.${format}`);
  }

  return <article className={styles.card}>
    <h2>Export</h2>
    <h3>Blueprint costs: <button onClick={() => clearBlueprintExport()}>[ clear ]</button></h3>
    { exportBlueprints.map((id, i) => <div className={styles.item} key={id}>
      <ItemLink id={id}/>
      <button onClick={() => removeBlueprintExport(i)}>[ remove ]</button>
    </div>) }

    <section>
      <button onClick={() => save('csv')}>CSV</button>
      <button onClick={() => save('ods')}>ODS</button>
      <button onClick={() => save('xlsx')}>XLSX</button>
    </section>
  </article>;
};