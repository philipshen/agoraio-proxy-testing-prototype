/* eslint-disable react/prop-types */
// @ts-check
import React from "react";

/**
 * Durable state variables work like regular React ones except their values are
 * also persisted in the browser so they can be retrieved after reloads or
 * restarts.
 *
 * - state values can be anything that's serializable with JSON
 * - 'local.*' names persist to disk and are available across tabs
 * - 'session.*' names persist across reloads of the same tab
 *
 * @example const [foo, putFoo, delFoo] = DurableState.use('session.foo', 'bar')
 *
 * @param {string} name - must include the storage scope, e.g 'session.foo' or
 * 'local.foo'
 * @param {*} defaultVal - default value for the persisted variable if nothing
 * was loaded from the store
 *
 * @typedef {(name: string, val: Object) => void} PutVal - set/update the
 * state's value
 * @typedef {(name: string) => void} DelVal - delete the state from the store
 * @returns {[Object, PutVal, DelVal]}
 */
export function use(name, defaultVal) {
  const ctx = React.useContext(Context);
  if (!ctx)
    throw new Error(
      `hook must be used in the context of a DurableState.Provider`
    );
  let currentVal = ctx.get(name);
  if (!currentVal && defaultVal !== undefined) {
    currentVal = defaultVal;
    ctx.set(name, currentVal);
  }
  return [currentVal, (val) => ctx.put(name, val), () => ctx.del(name)];
}

/**
 * If passed an array of names these are treated like an allow list and an error
 * is raised if a consumer tries to use a name not declared in this list.
 *
 * - use of context here ensures that two components using an entry with the
 *   same
 * - but a consequence of using context is that any update to a durable state var
 *   will rerender all the consumers that use durable state vars
 *
 * @param {{names: string[], children: React.ReactElement}} props
 * @returns React.ReactElement
 */
export function Provider({ names = [], children }) {
  // * ensure names are prefixed with either 'session' or 'local'
  names.forEach((name) => assertNameFormat(name));

  // * state used to trigger rerenders
  const [__, setVersion] = React.useState(0);

  const assertName = (name) => {
    assertNameFormat(name);
    // * empty array of allowed names allows any name to be used
    if (!names.length) return name;

    // * otherwise we assert the name is a member of the given 'names' set
    if (!names.includes(name))
      throw new Error(
        `DurableState name '${name}' not found in: ${names.join(
          ","
        )}. If this is a new entry, add it to the list of names passed to DurableState.Provider`
      );
    return name;
  };

  // * fqn = fully qualified name
  const fqn = (name) => "com.experiencewelcome.DurableState:" + name;
  const storeFromName = (name) => {
    assertName(name);
    const storeType = name.split(".")[0];
    const storeProp = storeType + "Storage";
    return window[storeProp];
  };

  // * operations
  const get = (name) => {
    const strVal = storeFromName(name).getItem(fqn(name));
    if (strVal) return JSON.parse(strVal);
  };
  const set = (name, val) => {
    storeFromName(name).setItem(fqn(name), JSON.stringify(val));
  };
  const put = (name, val) => {
    set(name, val);
    setVersion((v) => ++v);
  };
  const del = (name) => {
    storeFromName(name).removeItem(fqn(name));
    setVersion((v) => ++v);
  };
  return (
    <Context.Provider value={{ get, set, put, del }}>
      {children}
    </Context.Provider>
  );
}

// * everything below is the private implementation

const Context = React.createContext(null);

function assertNameFormat(name) {
  const [type] = name.split(".");
  if (!["session", "local"].includes(type))
    throw new Error(
      `'${name}' is missing storage type, use 'session.${name}' or 'local.${name}'`
    );
}
