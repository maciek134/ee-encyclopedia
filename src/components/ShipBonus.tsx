/*
  EE Encyclopedia
  Copyright (C) 2020 Maciej Sopyło

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import React from 'react';
import { calCodeModifier, moduleCodeList, equipAttr } from '../store';
import { I18n } from './I18n';
import { ItemLink } from '.';

import styles from './ShipBonus.module.css';

interface Props {
  bonusCode: string;
  bonusSkill: number;
}

export const ShipBonus: React.FC<Props> = ({ bonusCode, bonusSkill }) => {
  const modifier = calCodeModifier.code[bonusCode];
  const meta = calCodeModifier.meta[modifier.type_name];

  return <div className={styles.bonus}>
    <h3>{ bonusSkill !== 0 ? <><ItemLink id={bonusSkill}/> (per level):</> : 'Role bonus:' }</h3>
    { modifier.attributes.map((v, i) => <div key={meta.attribute_ids[i]} className={styles.attribute}>
      { meta.change_types[i] !== 'ship' && <I18n t={moduleCodeList[meta.change_ranges[i]]}/> }
      {' '} <I18n t={equipAttr[meta.attribute_ids[i]].name}/>
      <strong>{ v > 0 && '+' }{ (v * 100).toFixed(2) }%</strong>
    </div>) }
  </div>;
};