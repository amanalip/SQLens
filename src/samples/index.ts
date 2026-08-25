import { SampleQuery } from './types';
import { chinookSamples } from './chinook';
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
import { githubSamples } from './github';
import { flightsSamples } from './flights';
import { hospitalSamples } from './hospital';
import { realEstateSamples } from './realEstate';
import { stocksSamples } from './stocks';
import { foodDeliverySamples } from './foodDelivery';
import { librarySamples } from './library';
import { gamingSamples } from './gaming';
import { cryptoSamples } from './crypto';
import { hotelsSamples } from './hotels';

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
  githubSamples,
  flightsSamples,
  hospitalSamples,
  realEstateSamples,
  stocksSamples,
  foodDeliverySamples,
  librarySamples,
  gamingSamples,
  cryptoSamples,
  hotelsSamples,
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
  {
    id: 'github',
    name: 'GitHub Analytics',
    description: 'Repositories, contributors, commits, pull requests, stars',
    size: '~1 MB',
    bestFor: 'Developer metrics, PR reviews, commit stats',
    filename: './databases/github.sqlite',
    samples: githubSamples,
  },
  {
    id: 'flights',
    name: 'Airlines & Flights',
    description: 'Airports, carriers, routes, delays, flight schedules',
    size: '~1.5 MB',
    bestFor: 'Delay metrics, route pairs, time calculations',
    filename: './databases/flights.sqlite',
    samples: flightsSamples,
  },
  {
    id: 'hospital',
    name: 'Hospital Healthcare',
    description: 'Patients, admissions, doctors, departments, medications',
    size: '~1 MB',
    bestFor: 'Healthcare analytics, bed occupancy, pharmacy costs',
    filename: './databases/hospital.sqlite',
    samples: hospitalSamples,
  },
  {
    id: 'real_estate',
    name: 'Real Estate',
    description: 'Properties, neighborhoods, agents, sale listings, prices',
    size: '~1 MB',
    bestFor: 'Price per sqft, agent commissions, neighborhood stats',
    filename: './databases/real_estate.sqlite',
    samples: realEstateSamples,
  },
  {
    id: 'stocks',
    name: 'Stock Market',
    description: 'Tickers, daily OHLCV prices, portfolios, sector valuation',
    size: '~1 MB',
    bestFor: 'Financial math, unrealized gains, market caps',
    filename: './databases/stocks.sqlite',
    samples: stocksSamples,
  },
  {
    id: 'food_delivery',
    name: 'Food Delivery',
    description: 'Restaurants, cuisines, orders, couriers, tips, durations',
    size: '~1.5 MB',
    bestFor: 'Delivery metrics, courier earnings, cuisine sales',
    filename: './databases/food_delivery.sqlite',
    samples: foodDeliverySamples,
  },
  {
    id: 'library',
    name: 'Library System',
    description: 'Books, authors, members, active loans, overdue fines',
    size: '~500 KB',
    bestFor: 'Active checkouts, genre analytics, fine balances',
    filename: './databases/library.sqlite',
    samples: librarySamples,
  },
  {
    id: 'gaming',
    name: 'Gaming Leaderboard',
    description: 'Players, guilds, matches, weapons, kills, deaths, scores',
    size: '~1 MB',
    bestFor: 'K/D ratios, win rates, weapon stats, rankings',
    filename: './databases/gaming.sqlite',
    samples: gamingSamples,
  },
  {
    id: 'crypto',
    name: 'Crypto Ledgers',
    description: 'Tokens, wallets, balances, transactions, gas fees',
    size: '~1 MB',
    bestFor: 'Wallet valuations, transaction volume, gas summaries',
    filename: './databases/crypto.sqlite',
    samples: cryptoSamples,
  },
  {
    id: 'hotels',
    name: 'Hotel Bookings',
    description: 'Hotels, rooms, guest reservations, nightly rates, revenue',
    size: '~1 MB',
    bestFor: 'Occupancy rates, guest lifetime value, city revenue',
    filename: './databases/hotels.sqlite',
    samples: hotelsSamples,
  },
];
