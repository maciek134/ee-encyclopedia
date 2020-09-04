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

import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { evaluate } from 'mathjs';

import { getPrettyAttributes } from '../utils';
import { equipAttr, useI18n, useStore } from '../store';

import styles from './ShowAttribute.module.css';

interface Props {
  name: string;
  label?: string | React.ReactElement;
  fn?: (value: number) => any;
  value?: any;
  force?: boolean;
  unit?: string;
  type?: 'text' | 'bar';
  barColor?: string;
}

export const ShowAttribute: React.FC<Props> = ({ name, label, value, force, fn, unit, barColor, type = 'text' }) => {
  const { id } = useParams();
  const i18n = useI18n();
  if (!id) {
    return null;
  }
  
  const item = useStore(useCallback(state => state.items?.[id], [ id ]));
  if (!item) {
    return null;
  }

  const attrs = getPrettyAttributes(item);

  if (!attrs.hasOwnProperty(name) && typeof value === 'undefined' && !force) {
    return null;
  }

  const attrExtra = equipAttr[attrs[name]?.attribute_id];

  if (!label) {
    label = i18n(attrExtra?.name);
  }
  if (!unit) {
    const unitID = attrExtra?.unit;
    unit = i18n(unitID) || unitID !== 'NOT_FOUND' && unitID;
  }

  const attr = attrs[name];
  if (typeof value === 'undefined') {
    value = attr?.value ?? '--';
  }
  if (attrExtra?.formula) {
    value = evaluate(attrExtra.formula, { A: value });
  } else if (fn && typeof value === 'number') {
    value = fn(value);
  }

  if (type === 'text') {
    return <div className={styles.attribute} style={{ gridArea: name }}><span>{ label }</span> <strong>{ value } { unit }</strong></div>;
  } else if (type === 'bar') {
    return <div className={styles.bar} style={{ gridArea: name, '--color': barColor } as React.CSSProperties}>
      <span>{ label }</span> <strong>{ value }{ unit }</strong>
      <meter min={0} value={value} max={100}></meter>
    </div>;
  }
}