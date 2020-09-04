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

import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { useStore, itemsIndex, I18nObject, Group, itemGroups, groups } from '../store';
import { I18n } from './I18n';

import styles from './Search.module.css';

function getGroup(tid: string): Group {
  const id = itemsIndex[tid];
  return groups[itemGroups[id]];
}

export const Search: React.FC<{}> = ({  }) => {
  const history = useHistory();
  const [ search, setSearch ] = useState<string>('');
  const [ active, setActive ] = useState<number>(0);
  const [ includeTest, setIncludeTest ] = useState<boolean>(false);
  const i18n: I18nObject = useStore(useCallback(state => state.i18n[state.lang], []));
  const searchKeywords = search.toLowerCase().split(' ').filter(v => v.length > 2);
  const ids = search.length < 3 ? [] : Object.entries(i18n)
    .filter(([ k, v ]) => searchKeywords.every(keyword => v.toLowerCase().includes(keyword)) && itemsIndex.hasOwnProperty(k) && (!i18n[getGroup(k).name]?.includes('test') || includeTest))
    .sort((a, b) => +itemsIndex[a[0]] - +itemsIndex[b[0]]);

  function navigateToActive() {
    history.push(`/items/${itemsIndex[ids[active][0]]}`);
    setActive(0);
    setSearch('');
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      setActive(Math.min(active + 1, ids.length - 1));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setActive(Math.max(active - 1, 0));
      e.preventDefault();
    } else if (e.key === 'Enter') {
      navigateToActive();
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setSearch('');
    }
  }
  const onResultHover = (i: number) => () => setActive(i);

  return <main className={styles.search}>
    { search.length > 0 && <button onClick={() => setSearch('')}>✕</button> }
    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={onKeyDown}/>
    <input id="testitems" type="checkbox" checked={includeTest} onChange={(e) => setIncludeTest(e.target.checked)}/>
    <label htmlFor="testitems">
      Include "test" items
    </label>
    <aside className={styles.results}>
      { ids.map(([ k, v ], i) => <div key={k} className={active === i ? styles.active : undefined} onClick={navigateToActive} onMouseOver={onResultHover(i)}>
        [<I18n t={getGroup(k).name}/>] { v }
      </div>) }
    </aside>
  </main>;
};