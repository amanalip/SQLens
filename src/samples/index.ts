import { chinookSamples, SampleQuery } from './chinook';
import { northwindSamples } from './northwind';
import { sakilaSamples } from './sakila';
import { worldSamples } from './world';
import { employeesSamples } from './employees';

export { chinookSamples, northwindSamples, sakilaSamples, worldSamples, employeesSamples };
export type { SampleQuery };

export interface BundledDatabase {
  id: string;
  name: string;
  description: string;
  size: string;
  bestFor: string;
  filename: string;
  samples: SampleQuery[];
}

export const bundledDatabases: BundledDatabase[] = [
  {
    id: 'chinook',
    name: 'Chinook',
    description: 'Music store: artists, albums, tracks, invoices, customers',
    size: '~1 MB',
    bestFor: 'JOINs, GROUP BY, subqueries',
    filename: './databases/chinook.sqlite',
    samples: chinookSamples,
  },
  {
    id: 'northwind',
    name: 'Northwind',
    description: 'Orders, products, employees, suppliers, shippers',
    size: '~1.5 MB',
    bestFor: 'Multi-table JOINs, aggregations',
    filename: './databases/northwind.sqlite',
    samples: northwindSamples,
  },
  {
    id: 'sakila',
    name: 'Sakila',
    description: 'DVD rental: films, actors, rentals, payments, staff',
    size: '~2 MB',
    bestFor: 'Complex JOINs, date math',
    filename: './databases/sakila.sqlite',
    samples: sakilaSamples,
  },
  {
    id: 'world',
    name: 'World',
    description: 'Countries, cities, spoken languages',
    size: '~400 KB',
    bestFor: 'Simple queries, WHERE, sorting',
    filename: './databases/world.sqlite',
    samples: worldSamples,
  },
  {
    id: 'employees',
    name: 'Employees',
    description: 'HR: employees, departments, salaries, titles',
    size: '~500 KB',
    bestFor: 'Window functions, CTEs, self-joins',
    filename: './databases/employees.sqlite',
    samples: employeesSamples,
  },
];
