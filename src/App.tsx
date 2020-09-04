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

import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  NavLink,
} from 'react-router-dom';
import { ItemsScreen } from './screens';

import styles from './App.module.css';
import { useStore } from './store';

export default function App() {
  const { setLang, loading } = useStore();
  useEffect(() => {
    setLang('en');
  }, []);

  return <Router basename="ee-encyclopedia">
    { loading > 0 && <div className={styles.loading}><div>Loading...</div></div> }
    <nav className={styles.nav}>
      <NavLink to="/items" activeClassName="active">Encyclopedia</NavLink>
      <NavLink to="/fit" activeClassName="active">Fitting (coming soon!)</NavLink>
      <NavLink to="/skills" activeClassName="active">Skill planning (coming soon!)</NavLink>
      <NavLink to="/map" activeClassName="active">Map (coming soon!)</NavLink>
    </nav>
    <Switch>
      <Route path="/items" component={ItemsScreen}/>
      {/* <Route exact path="/fit"/> */}
      <Redirect from="/" to="/items"/>
    </Switch>
  </Router>;
}