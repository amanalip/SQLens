import { chinookSamples, SampleQuery } from './chinook';
import { northwindSamples } from './northwind';
import { sakilaSamples } from './sakila';
import { worldSamples } from './world';
import { employeesSamples } from './employees';
import { formula1Samples } from './formula1';
import { classicmodelsSamples } from './classicmodels';
import { imdbSamples } from './imdb';
import { spotifySamples } from './spotify';
import { pokemonSamples } from './pokemon';
import { universitySamples } from './university';
import { premierLeagueSamples } from './premierLeague';
import { ecommerceSamples } from './ecommerce';

export {
  chinookSamples,
  northwindSamples,
  sakilaSamples,
  worldSamples,
  employeesSamples,
  formula1Samples,
  classicmodelsSamples,
  imdbSamples,
  spotifySamples,
  pokemonSamples,
  universitySamples,
  premierLeagueSamples,
  ecommerceSamples,
};

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
  {
    id: 'formula1',
    name: 'Formula 1',
    description: 'Races, circuits, drivers, constructors, podiums, lap times',
    size: '~1.5 MB',
    bestFor: 'Ranking, multi-table joins, analytics',
    filename: './databases/formula1.sqlite',
    samples: formula1Samples,
  },
  {
    id: 'classicmodels',
    name: 'Classicmodels',
    description: 'Scale models retailer: offices, employees, orders, payments',
    size: '~1 MB',
    bestFor: 'B2B sales reporting, balances, hierarchies',
    filename: './databases/classicmodels.sqlite',
    samples: classicmodelsSamples,
  },
  {
    id: 'imdb',
    name: 'IMDb Movies',
    description: 'Top movies, directors, actors, genres, user ratings',
    size: '~1 MB',
    bestFor: 'Text search, ratings, filmography stats',
    filename: './databases/imdb.sqlite',
    samples: imdbSamples,
  },
  {
    id: 'spotify',
    name: 'Spotify Music',
    description: 'Tracks, artists, albums, danceability, energy, tempo',
    size: '~1 MB',
    bestFor: 'Audio metrics, CASE classification, averages',
    filename: './databases/spotify.sqlite',
    samples: spotifySamples,
  },
  {
    id: 'pokemon',
    name: 'Pokemon',
    description: 'Species, elemental types, combat stats, speeds',
    size: '~500 KB',
    bestFor: 'Filtering, stat sums, type distributions',
    filename: './databases/pokemon.sqlite',
    samples: pokemonSamples,
  },
  {
    id: 'university',
    name: 'University',
    description: 'Students, departments, instructors, courses, enrollments',
    size: '~500 KB',
    bestFor: 'Transcripts, prerequisites, class sizes',
    filename: './databases/university.sqlite',
    samples: universitySamples,
  },
  {
    id: 'premier_league',
    name: 'Premier League',
    description: 'Matches, teams, players, goals, assists, stadiums',
    size: '~1 MB',
    bestFor: 'Standings calculation, CTEs, home/away points',
    filename: './databases/premier_league.sqlite',
    samples: premierLeagueSamples,
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    description: 'Orders, order items, products, reviews, sellers, shipping',
    size: '~1.5 MB',
    bestFor: 'Commercial metrics, reviews, seller ratings',
    filename: './databases/ecommerce.sqlite',
    samples: ecommerceSamples,
  },
];
