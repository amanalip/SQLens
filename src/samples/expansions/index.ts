import { SampleQuery } from '../types';
import { chinookExpansion } from './chinook';
import { northwindExpansion } from './northwind';
import { sakilaExpansion } from './sakila';
import { worldExpansion } from './world';
import { employeesExpansion } from './employees';
import { formula1Expansion } from './formula1';
import { classicmodelsExpansion } from './classicmodels';
import { imdbExpansion } from './imdb';
import { spotifyExpansion } from './spotify';
import { pokemonExpansion } from './pokemon';
import { universityExpansion } from './university';
import { premier_leagueExpansion } from './premier_league';
import { ecommerceExpansion } from './ecommerce';
import { githubExpansion } from './github';
import { flightsExpansion } from './flights';
import { hospitalExpansion } from './hospital';
import { real_estateExpansion } from './real_estate';
import { stocksExpansion } from './stocks';
import { food_deliveryExpansion } from './food_delivery';
import { libraryExpansion } from './library';
import { gamingExpansion } from './gaming';
import { cryptoExpansion } from './crypto';
import { hotelsExpansion } from './hotels';

export const sampleExpansions: Record<string, SampleQuery[]> = {
  chinook: chinookExpansion,
  northwind: northwindExpansion,
  sakila: sakilaExpansion,
  world: worldExpansion,
  employees: employeesExpansion,
  formula1: formula1Expansion,
  classicmodels: classicmodelsExpansion,
  imdb: imdbExpansion,
  spotify: spotifyExpansion,
  pokemon: pokemonExpansion,
  university: universityExpansion,
  premier_league: premier_leagueExpansion,
  ecommerce: ecommerceExpansion,
  github: githubExpansion,
  flights: flightsExpansion,
  hospital: hospitalExpansion,
  real_estate: real_estateExpansion,
  stocks: stocksExpansion,
  food_delivery: food_deliveryExpansion,
  library: libraryExpansion,
  gaming: gamingExpansion,
  crypto: cryptoExpansion,
  hotels: hotelsExpansion,
};
