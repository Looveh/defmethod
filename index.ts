// ----------------------------------------------------------------------------
// Implementation

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

// Implementation
// ----------------------------------------------------------------------------
// Examples

// interface Person {
//   type: string;
//   name: string;
// }

// const greet = defmulti((a: Person) => a.type);

// defmethod(greet, "foo", (a) => `Hello ${a.name}`);
// defmethod(greet, "bar", (a) => `Goodbye ${a.name}`);

// console.log(greet({ type: "foo", name: "Alice" }));
// console.log(greet({ type: "bar", name: "Bob" }));

// const collatzStep = defmulti<number, number, boolean>((n: number) => n % 2 === 0);

// defmethod(collatzStep, true, (n) => n / 2);
// defmethod(collatzStep, false, (n) => 3 * n + 1);

// // This fn might not terminate - but it probably will
// const collatz = (n: number) => {
//   if (n <= 0) {
//     throw new Error("n must be positive");
//   }

//   const steps = [n];

//   while (n !== 1) {
//     n = collatzStep(n);
//     steps.push(n);
//   }

//   return steps;
// };

// console.log(collatz(27));
