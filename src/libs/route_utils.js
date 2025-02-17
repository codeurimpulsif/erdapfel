/* eslint-disable no-irregular-whitespace */
import { normalizeToFeatureCollection } from './geojson';

export function formatDuration(sec) {
  sec = Math.max(60, sec); // For duration < 60s, return '1 min'
  let min = Math.round(sec / 60);

  if (min < 60) {
    return `${min} min`;
  }

  const hour = Math.floor(min / 60);
  min = min - 60 * hour;
  let ret = `${hour} h`;
  if (min > 0 && hour < 10) {
    ret += ` ${min < 10 ? '0' : ''}${min}`;
  }
  return ret;
}

export function formatDistance(m) {
  if (m > 99000) {
    return `${Math.round(m / 1000)} km`;
  }
  if (m > 1000) {
    return `${(m / 1000).toFixed(1).replace('.', ',')} km`;
  }
  return `${m.toFixed(0)} m`;
}

export function getTransportTypeIcon({ mode = '' }) {
  if (mode.startsWith('WALK')) {
    return 'walk';
  }
  if (mode.startsWith('BUS')) {
    return 'bus';
  }
  if (mode.startsWith('SUBWAY')) {
    return 'metro';
  }
  if (mode.startsWith('TRAM')) {
    return 'tram';
  }
  if (mode.indexOf('TRAIN') !== -1) {
    return 'train';
  }
  return null;
}

export function getStepIcon(step) {
  if (step.maneuver.type === 'depart' || step.maneuver.type === 'arrive') {
    return step.maneuver.type;
  }
  return (step.maneuver.modifier || step.maneuver.type).replace(/\s/g, '-');
}

export function getAllSteps(route) {
  // Note: this is a flatMap operation
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap#Alternative
  return route.legs.reduce((acc, leg) => acc.concat(leg.steps), []);
}

export function getAllStops(route) {
  return route.legs.reduce((acc, leg) => acc.concat(leg.stops), []);
}

const first = array => array && array[0];
const last = array => array && array[array.length - 1];

export const originDestinationCoords = route => {
  const fc = normalizeToFeatureCollection(route.geometry);
  return {
    origin: first(first(fc.features).geometry.coordinates),
    destination: last(last(fc.features).geometry.coordinates),
  };
};
