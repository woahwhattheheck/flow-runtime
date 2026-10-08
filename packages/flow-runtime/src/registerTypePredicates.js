/* @flow */

import type TypeContext from './TypeContext';

export default function registerTypePredicates (context: TypeContext) {
  context.setPredicate('Array', (input: any) => Array.isArray(input));
  context.setPredicate('Map', (input: any) => {
    if (input === null || (typeof input !== 'object' && typeof input !== 'function')) {
      return false;
    }
    // An untrusted Proxy can throw even on instanceof (when revoked). A
    // predicate should reject it instead of allowing an accessor to abort
    // validation for the entire caller.
    try {
      if (input instanceof Map) {
        return true;
      }
    }
    catch (_) {
      return false;
    }
    // Native Map's internal-slot check works across realms and cannot be
    // forged with Symbol.toStringTag.
    try {
      Map.prototype.has.call(input, null);
      return true;
    }
    catch (_) {
      // Keep supporting Map polyfills, but accessors, revoked Proxies and
      // hostile Symbol.toStringTag getters must produce false, not throw.
      try {
        return Object.prototype.toString.call(input) === '[object Map]'
          && typeof input.get === 'function'
          && typeof input.has === 'function'
          && typeof input.entries === 'function'
          && typeof input[Symbol.iterator] === 'function';
      }
      catch (_) {
        return false;
      }
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
