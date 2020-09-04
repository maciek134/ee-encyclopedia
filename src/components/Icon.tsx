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

import styles from './Icon.module.css';

const icons = {
  fit_high: require('url:../../assets/Icon_fit_high.png'),
  fit_medium: require('url:../../assets/Icon_fit_medium.png'),
  fit_low: require('url:../../assets/Icon_fit_low.png'),
  fit_drones: require('url:../../assets/Icon_fit_drone.png'),
  fit_rig_mechanical: require('url:../../assets/Icon_fit_rig_mechanical.png'),
  fit_rig_power: require('url:../../assets/Icon_fit_rig_power.png'),
  resist_em: require('url:../../assets/Icon_resist_em.png'),
  resist_exp: require('url:../../assets/Icon_resist_exp.png'),
  resist_kin: require('url:../../assets/Icon_resist_kin.png'),
  resist_therm: require('url:../../assets/Icon_resist_therm.png'),
}

interface Props {
  name: string;
}

export const Icon: React.FC<Props> = ({ name }) => {
  return <img className={styles.img} src={icons[name]}/>
};