# multimethod

TODO

## Examples

### Hello world

```ts
const greet = defmulti((greeting) => greeting.type);

defmethod(greet, "hi", (p) => `Hello ${p.name}!`);
defmethod(greet, "bye", (p) => `Good bye ${p.name}!`);

greet({ type: "hi", name: "John" })   // => Hello John!
greet({ type: "bye", name: "Sarah" }) // => Good bye Sarah!
```

### Collatz sequences

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

Works with React too.

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
