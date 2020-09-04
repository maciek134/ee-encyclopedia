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

import create from 'zustand';

import _itemsIndex from '../data/items.index.json';
import _groups from '../data/groups.json';
import _itemGroups from '../data/items.groups.json';
import _attributes from '../data/attributes.json';
import _calCodeModifier from '../data/cal_code_modifier.json';
import _moduleCodeList from '../data/module_code_list.json';
import _equipAttr from '../data/equip_attr.json';
import { useCallback, useState, useEffect } from 'react';

export interface Item {
  ability_list?: number[];
  base_drop_rate?: number;
  base_price?: number;
  can_be_jettisoned?: boolean;
  capacity?: number;
  faction_id?: number;
  graphic_id?: number;
  icon_id?: number;
  is_omega?: number;
  is_rookie_insurance?: number;
  main_cal_code?: string;
  market_group_id?: number;
  mass?: number;
  normal_debris?: number[];
  prefab_id?: number;
  race_id?: number;
  radius?: number;
  ship_bonus_code_list?: string[];
  ship_bonus_skill_list?: any[];
  sof_faction_name?: string;
  sound_id?: number;
  volume?: number;
  wreck_id?: number;
  attrs: any;
  name?: string;
  description?: string;
  exp?: number;
  init_lv?: number;
  tech_lv?: number;
  pre_skill?: string[];
}

export interface Items {
  [k: string]: Item;
}

interface ItemsIndex {
  [k: string]: string;
}

export interface I18nObject {
  [k: string]: string;
}

export interface Group {
  name: string;
  anchorable: boolean;
  anchored: boolean;
  fittable_non_singleton: boolean;
  icon_path: string;
  use_base_price: boolean;
}

interface Groups {
  [k: string]: Group;
}

export interface Attribute {
  attribute_category: number;
  attribute_id: number;
  attribute_name: string;
  available: boolean;
  charge_recharge_time_id: number;
  default_value: number;
  high_is_good: boolean;
  max_attribute_id: number;
  operator: number[];
  stackable: boolean;
  to_attr_id: any[];
  unit_id: number;
}

interface Attributes {
  [k: string]: Attribute;
}

interface CalCodeMeta {
  change_types: string[];
  change_ranges: string[];
  attribute_ids: number[];
  attribute_only: boolean;
}

interface CalCodeCode {
  attributes: number[];
  type_name: string;
}

export interface CalCodeModifiers {
  skill_code_keys: string[];
  meta: {
    [k: string]: CalCodeMeta;
  };
  code: {
    [k: string]: CalCodeCode;
  }
}

interface EquipAttr {
  name: string;
  unit: string;
  formula?: string;
}

interface EquipAttrs {
  [k: string]: EquipAttr;
}

const spRate = localStorage.getItem('sprate')
export const useStore = create(set => ({
  lang: 'en',
  i18n: {},
  items: null,
  loading: 0,
  spRate: spRate ? parseInt(spRate) : 30,

  /* actions */
  setLang: async (lang: string) => {
    set(state => ({ loading: state.loading + 1 }));
    const res = await fetch(`${document.baseURI}/${lang}.json`);
    const data = await res.json();
    set(state => ({ lang, i18n: { [lang]: data }, loading: state.loading - 1 }));
  },
  fetchItems: async () => {
    set(state => ({ loading: state.loading + 1 }));
    const res = await fetch(`${document.baseURI}/items.json`);
    const items = await res.json() as Items;
    set(state => ({ items, loading: state.loading - 1 }));
  },
  setSPRate: (spRate: number) => {
    localStorage.setItem('sprate', spRate.toString());
    set(() => ({ spRate }));
  }
}));

export const useI18n = () => {
  const i18n = useStore(useCallback(state => state?.i18n[state.lang], []));

  return (key: string | number) => i18n[key];
};

interface WithDefault<T> {
  default: T;
}
type Imported<T> = Promise<WithDefault<T>>;

export const itemsIndex = _itemsIndex as ItemsIndex;
export const groups = _groups as Groups;
export const itemGroups = _itemGroups as ItemsIndex;
export const attributes = _attributes as Attributes;
export const calCodeModifier = _calCodeModifier as CalCodeModifiers;
export const moduleCodeList = _moduleCodeList as ItemsIndex;
export const equipAttr = _equipAttr as EquipAttrs;

export function useAsync<T>(data: Promise<Response>): T {
  const [ ret, setRet ] = useState<T>();
  
  async function getData() {
    const ret = await data;
    setRet(await ret.json());
  }

  useEffect(() => {
    getData();
  }, [ data ]);

  return ret;
}