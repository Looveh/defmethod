export interface MultiMethod<Arg, Ret, DispatchValue> {
  (x: Arg): Ret;
  multiMethods: Map<DispatchValue, (x: Arg) => Ret>;
}

export const defmulti = <Arg, Ret, DispatchVal>(
  dispatchFn: (x: Arg) => DispatchVal
): MultiMethod<Arg, Ret, DispatchVal> => {
  const multiMethods = new Map();

  function fn(x: Arg): Ret {
    const DispatchVal = dispatchFn(x);

    const f = multiMethods.get(DispatchVal);

    if (!f) {
      throw `No method found for dispatch value: ${DispatchVal}`;
    }

    return f(x);
  };

  fn.multiMethods = multiMethods;

  return fn;
};

export const defmethod = <Arg, Ret, DispatchVal>(
  multiMethod: MultiMethod<Arg, Ret, DispatchVal>,
  dispatchVal: DispatchVal,
  fn: (a: Arg) => Ret
) => {
  multiMethod.multiMethods.set(dispatchVal, fn);
};
