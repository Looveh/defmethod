# defmethod

A light weight library for [Multimethods / Multiple
Dispatch](https://en.wikipedia.org/wiki/Multiple_dispatch) in TypeScript.

## Installation

```sh
bun add defmethod
```

## Usage

```ts
import { defmulti, defmethod } from "defmethod";

enum Type {
  Foo,
  Bar,
  Baz,
}

interface Params {
  type: Type;
  message: string;
}

// create a multimethod
const myfn = defmulti<
  Params, // type of myfn's argument
  string, // type of myfn's handlers' return values
  Type, // type of the dispatch fn's return value
>(
  (x) => x.type // dispatch fn
);

// register handlers for the multimethod
defmethod(
  myfn, // multimethod
  Type.Foo, // dispatch val
  (x) => `foo ${x.message}` // dispatch handler
);
defmethod(myfn, Type.Bar, (x) => `bar ${x.message}`);
defmethod(myfn, Type.Baz, (x) => `baz ${x.message}`);

// call the multimethod
myfn({ type: Type.Foo, message: " hello" }) // => "foo hello"
myfn({ type: Type.Bar, message: " world" }) // => "bar world"
myfn({ type: Type.Baz, message: "!" }) // => "baz!"

// type variables are optional
const otherfn = defmulti((x) => x.type);

defmethod(otherfn, Type.Foo, (x) => `otherfoo ${x.message}`);
// etc.
```

## Examples

### Discriminating unions

A common pattern in large-ish TypeScript code bases is that of [discriminating
unions](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#discriminating-unions).
Whenever one wants to do something non-generic with objects of this type one
needs to check the type of the object and switch over its type. Multimethods
provides a flexible alternative to large `switch` blocks.

```ts
type NetworkLoadingState = {
  state: "loading";
};

type NetworkFailedState = {
  state: "failed";
  code: number;
};

type NetworkSuccessState = {
  state: "success";
  response: {
    title: string;
    duration: number;
    summary: string;
  };
};

type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState;

// switch case
const handle = (ns: NetworkState) => {
  switch(ns.state) {
    case "loading":
      return "LOADING"
    case "failed":
      return `FAILED: ${ns.code}`
    case "success":
      return `SUCCESS: ${ns.response.title}`
  }
}

// multimethods
const handle = defmulti((ns: NetworkState) => ns.state);

defmethod(handle, "loading", (_ns: NetworkLoadingState) => "LOADING");
defmethod(handle, "failed", (ns: NetworkFailedState) => `FAILED: ${ns.code}`);
defmethod(handle, "success", (ns: NetworkSuccessState) => `SUCCESS: ${ns.response.title}`);
```

### Collatz sequences

The multimethod and dispatch fn can take any argument and return any value, it
does not necessarily need to be an object. One can for example use multimethods
to generate [Collatz
sequences](https://en.wikipedia.org/wiki/Collatz_conjecture).

```ts
const collatzStep = defmulti((n: number) => n % 2 === 0 ? "even" : "odd");

defmethod(collatzStep, "even", (n: number) => n / 2);
defmethod(collatzStep, "odd", (n: number) => 3 * n + 1);

// This fn might not terminate - but it probably will
const collatzSeq = (n: number) => {
  if (n <= 0) {
    throw new Error("n must be positive");
  }

  const steps = [n];

  while (n !== 1) {
    n = collatzStep(n);
    steps.push(n);
  }

  return steps;
};

collatzSeq(27); // => [27, 82, 41, 124, 62, 31, ...]
```

### React

Works well with React too.

```tsx
import { defmulti, defmethod } from "multimethods"

import { BarChart } from "./PieChart"
import { LineChart } from "./PieChart"
import { PieChart } from "./PieChart"

enum ChartType {
  Bar,
  Line,
  Pie,
}

interface Props {
  type: ChartType,
  title: string;
  data: object,
}

export const Chart = defmulti<Props, JSX.Element, ChartType>(({ type }) => type);

defmethod(Chart, ChartType.Bar, (props) => {
  return <BarChart {...props} />;
});

defmethod(Chart, ChartType.Row, ({ data, title }) => {
  return <LineChart {...props} />;
});

defmethod(Chart, ChartType.Pie, ({ data, title }) => {
  return <PieChart {...props} />;
});
```

One could also register methods within each component's file.

```tsx
// Chart.tsx
import { defmulti } from "multimethods"

enum ChartType {
  Bar,
  Line,
  Pie,
}

interface Props {
  type: ChartType,
  title: string;
  data: object,
}

export const Chart = defmulti<Props, JSX.Element, ChartType>(({ type }) => type);

// BarChart.tsx
import { defmethod } from "multimethods"
import { Chart, Props, ChartType } from "./Chart"

const BarChart = (p: Props) => {
  return <>...</>
};

defmethod(Chart, ChartType.Bar, BarChart);

// LineChart.tsx
import { defmethod } from "multimethods"
import { Chart, Props, ChartType } from "./Chart"

const LineChart = (p: Props) => {
  return <>...</>
};

defmethod(Chart, ChartType.Line, LineChart);

// PieChart.tsx
import { defmethod } from "multimethods"
import { Chart, Props, ChartType } from "./Chart"

const PieChart = (p: Props) => {
  return <>...</>
};

defmethod(Chart, ChartType.Pie, PieChart);
```
