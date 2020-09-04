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

import { Item, attributes, Attribute } from './store';
import moment from 'moment';

export interface AttributeWithValue extends Attribute {
  value: any;
}

interface PrettyAttributes {
  [k: string]: AttributeWithValue;
}

export function getPrettyAttributes(item: Item): PrettyAttributes {
  const ret = {};
  for (let k in item.attrs) {
    const attr = attributes[k];
    ret[attr.attribute_name] = {
      ...attr,
      value: item.attrs[k],
    };
  }
  return ret;
}

interface WeaponAttributes extends PrettyAttributes {
  techLevel: AttributeWithValue;
  metaLevel: AttributeWithValue;
  moduleSize: AttributeWithValue;
  mass: AttributeWithValue;
  slots: AttributeWithValue;
  power: AttributeWithValue;
  capacitorNeed: AttributeWithValue;
  damageMultiplier: AttributeWithValue;
  thermalDamage?: AttributeWithValue;
  kineticDamage?: AttributeWithValue;
  explosiveDamage?: AttributeWithValue;
  emDamage?: AttributeWithValue;
  duration: AttributeWithValue;
  maxRange: AttributeWithValue;
  falloff: AttributeWithValue;
  trackingSpeed: AttributeWithValue;
  reloadTime: AttributeWithValue;
  chargeSize: AttributeWithValue;
  chargeGroup1: AttributeWithValue;
  capacity: AttributeWithValue;
  optimalSigRadius: AttributeWithValue;
  explosionRange?: AttributeWithValue;
  explosionSpeed?: AttributeWithValue;
  explosionDelay?: AttributeWithValue;
  explosionDamageFactor?: AttributeWithValue;
}

interface ShipAttributes extends PrettyAttributes {
  techLevel: AttributeWithValue;
  shipSize: AttributeWithValue;
  metaLevel: AttributeWithValue;
  mass: AttributeWithValue;
  radius: AttributeWithValue;
  volume: AttributeWithValue;
  agility: AttributeWithValue;
  maxVelocity: AttributeWithValue;
  warpSpeedMultiplier: AttributeWithValue;
  highSlot: AttributeWithValue;
  medSlot: AttributeWithValue;
  lowSlot: AttributeWithValue;
  mechanicalRigSlots: AttributeWithValue;
  energyRigSlots: AttributeWithValue;
  powerOutput: AttributeWithValue;
  shieldCapacity: AttributeWithValue;
  shieldCharge: AttributeWithValue;
  shieldEmDamageResonance: AttributeWithValue;
  shieldThermalDamageResonance: AttributeWithValue;
  shieldKineticDamageResonance: AttributeWithValue;
  shieldExplosiveDamageResonance: AttributeWithValue;
  shieldRechargeRate: AttributeWithValue;
  armorHP: AttributeWithValue;
  armorDamage: AttributeWithValue;
  armorEmDamageResonance: AttributeWithValue;
  armorThermalDamageResonance: AttributeWithValue;
  armorKineticDamageResonance: AttributeWithValue;
  armorExplosiveDamageResonance: AttributeWithValue;
  hp: AttributeWithValue;
  damage: AttributeWithValue;
  emDamageResonance: AttributeWithValue;
  thermalDamageResonance: AttributeWithValue;
  kineticDamageResonance: AttributeWithValue;
  explosiveDamageResonance: AttributeWithValue;
  capacitorCapacity: AttributeWithValue;
  charge: AttributeWithValue;
  rechargeRate: AttributeWithValue;
  warpCapacitorNeed: AttributeWithValue;
  scanRadarStrength: AttributeWithValue;
  maxTargetRange: AttributeWithValue;
  scanResolution: AttributeWithValue;
  maxLockedTargets: AttributeWithValue;
  signatureRadius: AttributeWithValue;
  droneBandwidth: AttributeWithValue;
  droneCapacity: AttributeWithValue;
  tempHPMaxEnergy: AttributeWithValue;
  tempHPCurEnergy: AttributeWithValue;
  tempHPMaxShield: AttributeWithValue;
  tempHPCurShield: AttributeWithValue;
  tempHPMaxArmor: AttributeWithValue;
  tempHPCurArmor: AttributeWithValue;
  capacity: AttributeWithValue;
  specialOreHoldCapacity: AttributeWithValue;
  specialMineralHoldCapacity: AttributeWithValue;
  specialFacilityHoldCapacity: AttributeWithValue;
  FuelRemain: AttributeWithValue;
  specialFuelBayCapacity: AttributeWithValue;
  shipMaintenanceBayCapacity: AttributeWithValue;
  fleetHangarCapacity: AttributeWithValue;
  specialGasHoldCapacity: AttributeWithValue;
  specialSalvageHoldCapacity: AttributeWithValue;
  specialShipHoldCapacity: AttributeWithValue;
  specialSmallShipHoldCapacity: AttributeWithValue;
  specialMediumShipHoldCapacity: AttributeWithValue;
  specialLargeShipHoldCapacity: AttributeWithValue;
  specialIndustrialShipHoldCapacity: AttributeWithValue;
  specialAmmoHoldCapacity: AttributeWithValue;
  specialBoosterHoldCapacity: AttributeWithValue;
  specialCorpseHoldCapacity: AttributeWithValue;
  specialQuafeHoldCapacity: AttributeWithValue;
  specialCommandCenterHoldCapacity: AttributeWithValue;
  specialSubsystemHoldCapacity: AttributeWithValue;
  specialPlanetaryCommoditiesHoldCapacity: AttributeWithValue;
  fighterCapacity: AttributeWithValue;
  logisticsCapacity: AttributeWithValue;
  droneSlotsLeft: AttributeWithValue;
}

interface ItemSkill extends Item {
  attrs: {};
  exp: number;
  tech_lv: number;
  pre_skill: string[];
}

export interface ItemBlueprint extends Item {
  product: number;
}

export function isSkill(item: Item): item is ItemSkill {
  return !item.attrs && !!item.exp && !!item.tech_lv;
}

export function isBlueprint(item: Item): item is ItemBlueprint {
  return !!item.product;
}

export function isWeapon(attrs: PrettyAttributes): attrs is WeaponAttributes {
  return !!attrs.moduleSize && !!attrs.slots && !!attrs.damageMultiplier;
}

export function isShip(attrs: PrettyAttributes): attrs is ShipAttributes {
  return attrs.shipSize?.value >= 0;
}

const padTime = (n: number): string => n.toString().padStart(2, '0');

export function formatDuration(duration: moment.Duration): string {
  const d = duration.get('d');
  const h = duration.get('h');
  const m = duration.get('m');
  const s = duration.get('s');

  return `${d}:${padTime(h)}:${padTime(m)}:${padTime(s)}`;
}