/* @flow */

import type TypeContext from './TypeContext';

export default function registerTypePredicates (context: TypeContext) {
  context.setPredicate('Array', (input: any) => Array.isArray(input));
  context.setPredicate('Map', (input: any) => {
    if (input instanceof Map) {
      return true;
    }
    if (input === null || (typeof input !== 'object' && typeof input !== 'function')) {
      return false;
    }
    // Native Map's internal-slot check works across realms and cannot be
    // forged by an object's Symbol.toStringTag property.
    try {
      Map.prototype.has.call(input, null);
      return true;
    }
    catch (_) {
      // Keep supporting Map polyfills without native internal slots, but do
      // not accept a plain object merely because it spoofs [object Map].
      return Object.prototype.toString.call(input) === '[object Map]'
        && typeof input.get === 'function'
        && typeof input.has === 'function'
        && typeof input.entries === 'function'
        && typeof input[Symbol.iterator] === 'function';
    }
  });
  context.setPredicate('Set', (input: any) => input instanceof Set);
  context.setPredicate('Promise', (input: any) => {
    if (input instanceof Promise) {
      return true;
    } else {
      return input !== null
        && (typeof input === 'object' || typeof input === 'function')
        && typeof input.then === 'function'
        ;
    }
  });
}
