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
import { evaluate } from 'mathjs';

import { useStore, calCodeModifier, moduleCodeList, equipAttr } from '../store';
import { I18n, ShipBonus, ItemLink, ItemCardIndustry, AttributeBox } from '.';
import { getPrettyAttributes, isWeapon, isShip, isSkill, isBlueprint, formatDuration } from '../utils';
import { ShowAttribute, Icon } from '.';

import styles from './ItemCard.module.css';
import moment from 'moment';

interface Props {
  id: string | number;
}

const SP_NEEDED = [250, 1415, 8000, 45255, 256000];

export const ItemCard: React.FC<Props> = ({ id, children }) => {
  const [ item, spRate, setSPRate, industry ] = useStore(useCallback(state => [
    state.items?.[id],
    state.spRate,
    state.setSPRate,
    state.industry?.item_manufacturing?.[id],
  ], [ id ]));

  if (!item) {
    return <div>NOT FOUND</div>
  }

  const attrs = getPrettyAttributes(item);

  let dps: number;
  if (isWeapon(attrs)) {
    const em = attrs.emDamage?.value ?? 0;
    const kinetic = attrs.kineticDamage?.value ?? 0;
    const explosive = attrs.explosiveDamage?.value ?? 0;
    const thermal = attrs.thermalDamage?.value ?? 0;
    const dmg = em + kinetic + explosive + thermal;
    dps = dmg * attrs.damageMultiplier.value / (attrs.duration.value / 1000);
  }
  
  return <article className={styles.card}>
    <h1>
      <I18n t={item.name}/>
    </h1>

    { isSkill(item) && <>
      <section className={styles.attributes}>
        <AttributeBox label="Tech Level">{ item.tech_lv }</AttributeBox>
        { item.init_lv > -1 && <AttributeBox label="Starting Level">{ item.init_lv }</AttributeBox> }
        { item.pre_skill && <AttributeBox label="Required Skills">{item.pre_skill.map((v, i) => {
          const [ id, level ] = v.split('|');
          return <React.Fragment key={id}>
            <ItemLink key={v} id={id}/> lvl. {level}
            { i < item.pre_skill.length - 1 && <br/> }
          </React.Fragment>;
        })}</AttributeBox> }
        <AttributeBox label="SP needed*">
          <table>
            <tbody>
              {SP_NEEDED.map((sp, i) => {
                if (i < item.init_lv) {
                  return null;
                }
                const value = Math.round(item.exp * sp / 1000);
                const valueRate = Math.round(value * 60 / spRate);
                return <tr key={sp}>
                  <td>lvl. {i + 1}</td>
                  <td>
                  { value }
                  </td>
                  <td>{ formatDuration(moment.duration(valueRate, 's')) }</td>
                </tr>
              })}
            </tbody>
          </table>
        </AttributeBox>
      </section>
      <section className={styles.attributes}>
        <h2>Effects:</h2>
        { SP_NEEDED.map((v, level) => {
          const modifier = calCodeModifier.code[item.main_cal_code.replace('%d', (level + 1).toString())];
          const meta = calCodeModifier.meta[modifier?.type_name];

          return <>
            <h3>Level {level + 1}:</h3>
            { modifier?.attributes.map((v, i) => {
              if (v === null) {
                return null;
              }
              const attrExtra = equipAttr[meta.attribute_ids[i]];
              const value = attrExtra.formula ? evaluate(attrExtra.formula, { A: v }).toFixed(2) : v;
              return <AttributeBox key={meta.attribute_ids[i]} label={<>
                { meta.change_types[i] !== 'character' && <I18n t={moduleCodeList[meta.change_ranges[i]]}/> }
                {' '} <I18n t={attrExtra.name}/>
              </>}>
                { value > 0 && '+' }{ value } { attrExtra.unit && attrExtra.unit !== 'NOT_FOUND' && <I18n t={attrExtra.unit}/> }
              </AttributeBox>
            }) }
          </>;
        }) }
      </section>
    </>}

    { isBlueprint(item) && <ItemCardIndustry id={id} item={item}/> }

    { isShip(attrs) && <>
      <section className={styles.slots}>
        <ShowAttribute name="droneSlotsLeft" label={<Icon name="fit_drones"/>}/>
        <ShowAttribute name="highSlot" label={<Icon name="fit_high"/>}/>
        <ShowAttribute name="medSlot" label={<Icon name="fit_medium"/>}/>
        <ShowAttribute name="lowSlot" label={<Icon name="fit_low"/>}/>
        <ShowAttribute name="energyRigSlots" label={<Icon name="fit_rig_power"/>}/>
        <ShowAttribute name="mechanicalRigSlots" label={<Icon name="fit_rig_mechanical"/>}/>
      </section>
      <section className={styles.attributes}>
        <h2>Bonuses:</h2>
        { item.ship_bonus_code_list?.map((bonusCode, i) => <ShipBonus bonusCode={bonusCode} bonusSkill={item.ship_bonus_skill_list[i]}/>) }
      </section>
    </>}

    <h2>Basic Info:</h2>
    <section className={styles.attributes}>
      { dps && <ShowAttribute name="dps" label="DPS" value={dps} fn={v => v.toFixed(2)}/> }
      <ShowAttribute name="metaLevel"/>
      <ShowAttribute name="techLevel"/>
      <ShowAttribute name="is_omega" label="Omega Required" value={item.is_omega ?? 0} fn={v => v ? 'yes' : 'no'}/>
      <ShowAttribute name="volume"/>
      <ShowAttribute name="maxVelocityMod"/>
      <ShowAttribute name="signatureRadiusMod"/>
      <ShowAttribute name="capacitorCapacityBonusMod"/>
      <ShowAttribute name="capacitorNeed"/>
      <ShowAttribute name="power"/>
      <ShowAttribute name="duration"/>
      <ShowAttribute name="damageRateDMod"/>
      <ShowAttribute name="damageRateDModBonus"/>
      <ShowAttribute name="moduleReactivationDelay"/>
      <ShowAttribute name="durationDMod"/>
      <ShowAttribute name="durationDModMod"/>
      <ShowAttribute name="maxGroupFitted" label="Per Ship Limit"/>
      <ShowAttribute name="disallowInEmpireSpace" label="Null-sec Only" fn={v => v ? 'yes' : 'no'}/>
      { industry && <AttributeBox label="Blueprint"><ItemLink id={industry.blueprint}/></AttributeBox> }
    </section>

    { isWeapon(attrs) && <>
      <section className={[styles.attributes, styles.group].join(' ')}>
        <h2>Damage:</h2>
        <ShowAttribute name="emDamage" label="EM" type="bar" barColor="#549bab" fn={v => (v * attrs.damageMultiplier.value).toFixed(2)} force/>
        <ShowAttribute name="thermalDamage" label="TH" type="bar" barColor="#ef4b2b" fn={v => (v * attrs.damageMultiplier.value).toFixed(2)} force/>
        <ShowAttribute name="kineticDamage" label="KI" type="bar" barColor="#626d69" fn={v => (v * attrs.damageMultiplier.value).toFixed(2)} force/>
        <ShowAttribute name="explosiveDamage" label="EX" type="bar" barColor="#d67a48" fn={v => (v * attrs.damageMultiplier.value).toFixed(2)} force/>
      </section>
      <span style={{fontStyle: 'italic', fontSize: '0.9em', padding: '0 1rem'}}>Pay no attention to the bars for now, I have no idea how they work in-game</span>
      <section className={styles.attributes}>
        <h2>Weapon Stats:</h2>
        <ShowAttribute name="power"/>
        <ShowAttribute name="maxRange" fn={v => (v / 1000).toFixed(1)}/>
        <ShowAttribute name="falloff" fn={v => (v / 1000).toFixed(1)}/>
        <ShowAttribute name="trackingSpeed"/>
        <ShowAttribute name="maxVelocity"/>
        <ShowAttribute name="explosionSpeed"/>
        <ShowAttribute name="explosionRange"/>
        <ShowAttribute name="explosionDelay" fn={v => (v / 1000).toFixed(1)}/>
        <ShowAttribute name="missileRange" label="Missile Range" value={attrs.maxVelocity?.value ? (attrs.maxVelocity.value * attrs.explosionDelay?.value / 1000000).toFixed(2) : undefined} unit="km"/>
      </section>
    </> }

    { isShip(attrs) && <>
      <section className={styles.attributes}>
        <h2>Ship Stats:</h2>
        <ShowAttribute name="is_rookie_insurance" label="Insurance cost" value={item.is_rookie_insurance}/>
        
        <ShowAttribute name="maxVelocity"/>
        <ShowAttribute name="warpSpeedMultiplier"/>
        <ShowAttribute name="capacity"/>
        <ShowAttribute name="droneCapacity" label="Drone Hangar Capacity" unit="m³"/>
        <ShowAttribute name="capacitorCapacity"/>
        <ShowAttribute name="powerOutput"/>
        <ShowAttribute name="shieldCapacity"/>
        <ShowAttribute name="armorHP"/>
        <ShowAttribute name="hp"/>
        <ShowAttribute name="hp" label="EHP" value={attrs.shieldCapacity.value + attrs.armorHP.value + attrs.hp.value}/>
      </section>
      <section className={[styles.attributes, styles.group].join(' ')}>
        <h2>Shield:</h2>
        <ShowAttribute name="shieldEmDamageResonance" label="EM" type="bar" barColor="#549bab" fn={v => ((1 - v) * 100).toFixed(1)}/>
        <ShowAttribute name="shieldThermalDamageResonance" label="TH" type="bar" barColor="#ef4b2b" fn={v => ((1 - v) * 100).toFixed(1)}/>
        <ShowAttribute name="shieldKineticDamageResonance" label="KI" type="bar" barColor="#626d69" fn={v => ((1 - v) * 100).toFixed(1)}/>
        <ShowAttribute name="shieldExplosiveDamageResonance" label="EX" type="bar" barColor="#d67a48" fn={v => ((1 - v) * 100).toFixed(1)}/>
      </section>
      <section className={[styles.attributes, styles.group].join(' ')}>
        <h2>Armor:</h2>
        <ShowAttribute name="armorEmDamageResonance" label="EM" type="bar" barColor="#549bab" fn={v => ((1 - v) * 100).toFixed(1)}/>
        <ShowAttribute name="armorThermalDamageResonance" label="TH" type="bar" barColor="#ef4b2b" fn={v => ((1 - v) * 100).toFixed(1)}/>
        <ShowAttribute name="armorKineticDamageResonance" label="KI" type="bar" barColor="#626d69" fn={v => ((1 - v) * 100).toFixed(1)}/>
        <ShowAttribute name="armorExplosiveDamageResonance" label="EX" type="bar" barColor="#d67a48" fn={v => ((1 - v) * 100).toFixed(1)}/>
      </section>
      <section className={[styles.attributes, styles.group].join(' ')}>
        <h2>Structure:</h2>
        <ShowAttribute name="emDamageResonance" label="EM" type="bar" barColor="#549bab" fn={v => ((1 - v) * 100).toFixed(1)}/>
        <ShowAttribute name="thermalDamageResonance" label="TH" type="bar" barColor="#ef4b2b" fn={v => ((1 - v) * 100).toFixed(1)}/>
        <ShowAttribute name="kineticDamageResonance" label="KI" type="bar" barColor="#626d69" fn={v => ((1 - v) * 100).toFixed(1)}/>
        <ShowAttribute name="explosiveDamageResonance" label="EX" type="bar" barColor="#d67a48" fn={v => ((1 - v) * 100).toFixed(1)}/>
      </section>
    </> }

    <h2>Description</h2>
    <p><I18n t={item.description}/></p>

    { isSkill(item) && <div style={{ padding: '0 1rem' }}>
      * skill times calculated at { spRate }/min
      <nav className={styles.sprate}>
        <button className={spRate === 30 ? styles.active : undefined} onClick={() => setSPRate(30)}>30</button>{' | '}
        <button className={spRate === 60 ? styles.active : undefined} onClick={() => setSPRate(60)}>60</button>{' | '}
        <button className={spRate === 65 ? styles.active : undefined} onClick={() => setSPRate(65)}>65</button>{' | '}
        <button className={spRate === 70 ? styles.active : undefined} onClick={() => setSPRate(70)}>70</button>{' | '}
        <button className={spRate === 75 ? styles.active : undefined} onClick={() => setSPRate(75)}>75</button>
      </nav>
    </div> }

    {/* <hr/>
    <details>
      <p>This is raw data I have about this entry. If you see something here that should be up there let me know (not doing graphics at the moment)!</p>
      <summary>Secret stuff!</summary>
      { Object.entries(item).map(([k, v]) => <div>{k}: <strong>{JSON.stringify(v)}</strong></div>) }
      <br/>
      { Object.entries(attrs).map(([k, v]) => <div>{k}: <strong>{v.value}</strong></div>) }

      <pre>
interface X {'{\n'}
{ Object.entries(attrs).map(([ k, v ]) => `  ${k}: AttributeWithValue;\n`) }
}
      </pre>
    </details> */}
    
    {/* { JSON.stringify(Object.entries(attrs).map(([k, v]) => [ k, v.value ]).reduce((prev, curr) => ({ ...prev, [curr[0]]: curr[1] }), {})) }</div> */}
  </article>;
}