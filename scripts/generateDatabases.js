import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, '../public/databases');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function createDatabases() {
  const SQL = await initSqlJs();

  // 1. Chinook
  console.log('Generating Chinook database...');
  const chinook = new SQL.Database();
  chinook.run(`
    CREATE TABLE artists (artist_id INTEGER PRIMARY KEY, name TEXT NOT NULL);
    CREATE TABLE albums (album_id INTEGER PRIMARY KEY, title TEXT NOT NULL, artist_id INTEGER NOT NULL, FOREIGN KEY (artist_id) REFERENCES artists(artist_id));
    CREATE TABLE media_types (media_type_id INTEGER PRIMARY KEY, name TEXT NOT NULL);
    CREATE TABLE genres (genre_id INTEGER PRIMARY KEY, name TEXT NOT NULL);
    CREATE TABLE tracks (track_id INTEGER PRIMARY KEY, name TEXT NOT NULL, album_id INTEGER, media_type_id INTEGER NOT NULL, genre_id INTEGER, composer TEXT, milliseconds INTEGER NOT NULL, bytes INTEGER, unit_price REAL NOT NULL, FOREIGN KEY (album_id) REFERENCES albums(album_id), FOREIGN KEY (media_type_id) REFERENCES media_types(media_type_id), FOREIGN KEY (genre_id) REFERENCES genres(genre_id));
    CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, company TEXT, city TEXT, state TEXT, country TEXT NOT NULL, email TEXT NOT NULL, support_rep_id INTEGER);
    CREATE TABLE invoices (invoice_id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL, invoice_date TEXT NOT NULL, billing_address TEXT, billing_city TEXT, billing_country TEXT NOT NULL, total REAL NOT NULL, FOREIGN KEY (customer_id) REFERENCES customers(customer_id));
    CREATE TABLE invoice_items (invoice_line_id INTEGER PRIMARY KEY, invoice_id INTEGER NOT NULL, track_id INTEGER NOT NULL, unit_price REAL NOT NULL, quantity INTEGER NOT NULL, FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id), FOREIGN KEY (track_id) REFERENCES tracks(track_id));

    INSERT INTO artists VALUES (1, 'AC/DC'), (2, 'Accept'), (3, 'Aerosmith'), (4, 'Alanis Morissette'), (5, 'Alice In Chains'), (6, 'Miles Davis'), (7, 'Bill Evans'), (8, 'John Coltrane'), (9, 'Led Zeppelin'), (10, 'Queen');
    INSERT INTO albums VALUES (1, 'For Those About To Rock', 1), (2, 'Balls to the Wall', 2), (3, 'Restless and Wild', 2), (4, 'Let There Be Rock', 1), (5, 'Big Ones', 3), (6, 'Jagged Little Pill', 4), (7, 'Facelift', 5), (8, 'Kind of Blue', 6), (9, 'A Love Supreme', 8), (10, 'A Night at the Opera', 10);
    INSERT INTO genres VALUES (1, 'Rock'), (2, 'Jazz'), (3, 'Metal'), (4, 'Alternative & Punk'), (5, 'Blues');
    INSERT INTO media_types VALUES (1, 'MPEG audio file'), (2, 'Protected AAC audio file'), (3, 'Protected MPEG-4 video file');
    INSERT INTO tracks VALUES
      (1, 'For Those About To Rock', 1, 1, 1, 'Angus Young', 343719, 11170334, 0.99),
      (2, 'Balls to the Wall', 2, 2, 3, 'U. Dirkschneider', 342562, 5510424, 0.99),
      (3, 'Fast As a Shark', 3, 2, 3, 'F. Baltes', 230619, 3990994, 0.99),
      (4, 'Restless and Wild', 3, 2, 3, 'F. Baltes', 252051, 4331779, 0.99),
      (5, 'Go Down', 4, 1, 1, 'AC/DC', 331180, 10847611, 0.99),
      (6, 'So What', 8, 1, 2, 'Miles Davis', 562000, 18500000, 1.29),
      (7, 'Freddie Freeloader', 8, 1, 2, 'Miles Davis', 589000, 19200000, 1.29),
      (8, 'Blue in Green', 8, 1, 2, 'Miles Davis', 337000, 11000000, 1.29),
      (9, 'Bohemian Rhapsody', 10, 1, 1, 'Freddie Mercury', 354320, 11400000, 1.29),
      (10, 'You''re My Best Friend', 10, 1, 1, 'John Deacon', 172000, 5800000, 0.99);
    INSERT INTO customers VALUES
      (1, 'Luís', 'Gonçalves', 'Embraer', 'São José dos Campos', 'SP', 'Brazil', 'luisg@embraer.com.br', 3),
      (2, 'Leonie', 'Köhler', NULL, 'Stuttgart', NULL, 'Germany', 'leonie.koehler@surfeu.de', 5),
      (3, 'François', 'Tremblay', NULL, 'Montréal', 'QC', 'Canada', 'ftremblay@gmail.com', 3),
      (4, 'Bjørn', 'Hansen', NULL, 'Oslo', NULL, 'Norway', 'bjorn.hansen@yahoo.no', 4),
      (5, 'Helena', 'Holý', NULL, 'Prague', NULL, 'Czech Republic', 'hholy@gmail.com', 5);
    INSERT INTO invoices VALUES
      (1, 1, '2024-01-01', 'Av. Brigadeiro Faria Lima, 2170', 'São José dos Campos', 'Brazil', 1.98),
      (2, 2, '2024-01-02', 'Theodor-Heuss-Straße 34', 'Stuttgart', 'Germany', 3.96),
      (3, 3, '2024-01-03', '1498 rue Bélanger', 'Montréal', 'Canada', 5.94),
      (4, 1, '2024-02-05', 'Av. Brigadeiro Faria Lima, 2170', 'São José dos Campos', 'Brazil', 8.91),
      (5, 5, '2024-02-12', 'Klanova 9/506', 'Prague', 'Czech Republic', 13.86);
    INSERT INTO invoice_items VALUES
      (1, 1, 1, 0.99, 1), (2, 1, 2, 0.99, 1), (3, 2, 3, 0.99, 1), (4, 2, 4, 0.99, 2),
      (5, 3, 6, 1.29, 2), (6, 4, 9, 1.29, 3), (7, 5, 10, 0.99, 4);
  `);
  fs.writeFileSync(path.join(outDir, 'chinook.sqlite'), Buffer.from(chinook.export()));

  // 2. Northwind
  console.log('Generating Northwind database...');
  const northwind = new SQL.Database();
  northwind.run(`
    CREATE TABLE suppliers (supplier_id INTEGER PRIMARY KEY, company_name TEXT NOT NULL, contact_name TEXT, country TEXT);
    CREATE TABLE categories (category_id INTEGER PRIMARY KEY, category_name TEXT NOT NULL, description TEXT);
    CREATE TABLE products (product_id INTEGER PRIMARY KEY, product_name TEXT NOT NULL, supplier_id INTEGER, category_id INTEGER, unit_price REAL NOT NULL, units_in_stock INTEGER NOT NULL, discontinued INTEGER NOT NULL DEFAULT 0, FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id), FOREIGN KEY (category_id) REFERENCES categories(category_id));
    CREATE TABLE customers (customer_id TEXT PRIMARY KEY, company_name TEXT NOT NULL, city TEXT, country TEXT);
    CREATE TABLE employees (employee_id INTEGER PRIMARY KEY, last_name TEXT NOT NULL, first_name TEXT NOT NULL, title TEXT, reports_to INTEGER, FOREIGN KEY (reports_to) REFERENCES employees(employee_id));
    CREATE TABLE orders (order_id INTEGER PRIMARY KEY, customer_id TEXT, employee_id INTEGER, order_date TEXT, freight REAL, ship_country TEXT, FOREIGN KEY (customer_id) REFERENCES customers(customer_id), FOREIGN KEY (employee_id) REFERENCES employees(employee_id));
    CREATE TABLE order_details (order_id INTEGER NOT NULL, product_id INTEGER NOT NULL, unit_price REAL NOT NULL, quantity INTEGER NOT NULL, discount REAL NOT NULL DEFAULT 0, PRIMARY KEY (order_id, product_id), FOREIGN KEY (order_id) REFERENCES orders(order_id), FOREIGN KEY (product_id) REFERENCES products(product_id));

    INSERT INTO suppliers VALUES (1, 'Exotic Liquids', 'Charlotte Cooper', 'UK'), (2, 'New Orleans Cajun Delights', 'Shelley Burke', 'USA'), (3, 'Grandma Kelly''s Homestead', 'Regina Murphy', 'USA'), (4, 'Tokyo Traders', 'Yoshi Nagase', 'Japan');
    INSERT INTO categories VALUES (1, 'Beverages', 'Soft drinks, beers'), (2, 'Condiments', 'Sauces and spreads'), (3, 'Confections', 'Desserts and candies'), (4, 'Dairy Products', 'Cheeses');
    INSERT INTO products VALUES
      (1, 'Chai', 1, 1, 18.00, 39, 0), (2, 'Chang', 1, 1, 19.00, 17, 0), (3, 'Aniseed Syrup', 1, 2, 10.00, 13, 0),
      (4, 'Chef Anton''s Cajun Seasoning', 2, 2, 22.00, 53, 0), (5, 'Chef Anton''s Gumbo Mix', 2, 2, 21.35, 0, 1),
      (6, 'Grandma''s Boysenberry Spread', 3, 2, 25.00, 120, 0), (7, 'Pavlova', 3, 3, 17.45, 29, 0), (8, 'Queso Cabrales', 4, 4, 21.00, 22, 0);
    INSERT INTO customers VALUES ('ALFKI', 'Alfreds Futterkiste', 'Berlin', 'Germany'), ('ANATR', 'Ana Trujillo', 'México D.F.', 'Mexico'), ('ANTON', 'Antonio Moreno Taquería', 'México D.F.', 'Mexico'), ('AROUT', 'Around the Horn', 'London', 'UK'), ('BERGS', 'Berglunds snabbköp', 'Luleå', 'Sweden');
    INSERT INTO employees VALUES (1, 'Davolio', 'Nancy', 'Sales Representative', 2), (2, 'Fuller', 'Andrew', 'Vice President, Sales', NULL), (3, 'Leverling', 'Janet', 'Sales Representative', 2), (4, 'Peacock', 'Margaret', 'Sales Representative', 2), (5, 'Buchanan', 'Steven', 'Sales Manager', 2);
    INSERT INTO orders VALUES (10248, 'ALFKI', 1, '2024-01-10', 32.38, 'Germany'), (10249, 'ANATR', 3, '2024-01-11', 11.61, 'Mexico'), (10250, 'BERGS', 4, '2024-01-15', 65.83, 'Sweden'), (10251, 'ALFKI', 1, '2024-02-01', 41.34, 'Germany'), (10252, 'AROUT', 5, '2024-02-03', 51.30, 'UK');
    INSERT INTO order_details VALUES (10248, 1, 18.00, 12, 0), (10248, 2, 19.00, 10, 0), (10249, 3, 10.00, 5, 0), (10250, 4, 22.00, 35, 0.15), (10250, 6, 25.00, 15, 0.05), (10251, 1, 18.00, 20, 0.1), (10252, 7, 17.45, 40, 0.05);
  `);
  fs.writeFileSync(path.join(outDir, 'northwind.sqlite'), Buffer.from(northwind.export()));

  // 3. Sakila
  console.log('Generating Sakila database...');
  const sakila = new SQL.Database();
  sakila.run(`
    CREATE TABLE actors (actor_id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL);
    CREATE TABLE categories (category_id INTEGER PRIMARY KEY, name TEXT NOT NULL);
    CREATE TABLE films (film_id INTEGER PRIMARY KEY, title TEXT NOT NULL, description TEXT, release_year INTEGER, rental_duration INTEGER NOT NULL, rental_rate REAL NOT NULL, length INTEGER, rating TEXT);
    CREATE TABLE film_actor (actor_id INTEGER NOT NULL, film_id INTEGER NOT NULL, PRIMARY KEY (actor_id, film_id), FOREIGN KEY (actor_id) REFERENCES actors(actor_id), FOREIGN KEY (film_id) REFERENCES films(film_id));
    CREATE TABLE film_category (film_id INTEGER NOT NULL, category_id INTEGER NOT NULL, PRIMARY KEY (film_id, category_id), FOREIGN KEY (film_id) REFERENCES films(film_id), FOREIGN KEY (category_id) REFERENCES categories(category_id));
    CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, email TEXT, active INTEGER NOT NULL DEFAULT 1);
    CREATE TABLE rentals (rental_id INTEGER PRIMARY KEY, rental_date TEXT NOT NULL, film_id INTEGER NOT NULL, customer_id INTEGER NOT NULL, return_date TEXT, FOREIGN KEY (film_id) REFERENCES films(film_id), FOREIGN KEY (customer_id) REFERENCES customers(customer_id));
    CREATE TABLE payments (payment_id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL, rental_id INTEGER NOT NULL, amount REAL NOT NULL, payment_date TEXT NOT NULL, FOREIGN KEY (customer_id) REFERENCES customers(customer_id), FOREIGN KEY (rental_id) REFERENCES rentals(rental_id));

    INSERT INTO actors VALUES (1, 'PENELOPE', 'GUINESS'), (2, 'NICK', 'WAHLBERG'), (3, 'ED', 'CHASE'), (4, 'JENNIFER', 'DAVIS'), (5, 'JOHNNY', 'LOLLOBRIGIDA');
    INSERT INTO categories VALUES (1, 'Action'), (2, 'Animation'), (3, 'Children'), (4, 'Classics'), (5, 'Comedy'), (6, 'Drama');
    INSERT INTO films VALUES
      (1, 'ACADEMY DINOSAUR', 'An Epic Drama', 2006, 6, 0.99, 86, 'PG'),
      (2, 'ACE GOLDFINGER', 'A Astounding Epistle', 2006, 3, 4.99, 48, 'G'),
      (3, 'ADAPTATION HOLES', 'A Astounding Reflection', 2006, 7, 2.99, 50, 'NC-17'),
      (4, 'AFFAIR PREJUDICE', 'A Fanciful Documentary', 2006, 5, 2.99, 117, 'G'),
      (5, 'AFRICAN EGG', 'A Fast-Paced Documentary', 2006, 6, 2.99, 130, 'G');
    INSERT INTO film_actor VALUES (1, 1), (1, 2), (2, 3), (3, 1), (4, 4), (5, 5), (2, 5);
    INSERT INTO film_category VALUES (1, 6), (2, 1), (3, 2), (4, 4), (5, 5);
    INSERT INTO customers VALUES (1, 'MARY', 'SMITH', 'mary.smith@sakila.org', 1), (2, 'PATRICIA', 'JOHNSON', 'patricia.johnson@sakila.org', 1), (3, 'LINDA', 'WILLIAMS', 'linda.williams@sakila.org', 1), (4, 'BARBARA', 'JONES', 'barbara.jones@sakila.org', 1);
    INSERT INTO rentals VALUES (1, '2024-02-14', 1, 1, '2024-02-18'), (2, '2024-02-15', 2, 2, '2024-02-17'), (3, '2024-02-16', 3, 3, '2024-02-22'), (4, '2024-02-17', 5, 1, NULL);
    INSERT INTO payments VALUES (1, 1, 1, 2.99, '2024-02-14'), (2, 2, 2, 4.99, '2024-02-15'), (3, 3, 3, 2.99, '2024-02-16'), (4, 1, 4, 2.99, '2024-02-17');
  `);
  fs.writeFileSync(path.join(outDir, 'sakila.sqlite'), Buffer.from(sakila.export()));

  // 4. World
  console.log('Generating World database...');
  const world = new SQL.Database();
  world.run(`
    CREATE TABLE countries (code TEXT PRIMARY KEY, name TEXT NOT NULL, continent TEXT NOT NULL, region TEXT NOT NULL, surface_area REAL NOT NULL, population INTEGER NOT NULL, life_expectancy REAL, gnp REAL, capital INTEGER);
    CREATE TABLE cities (id INTEGER PRIMARY KEY, name TEXT NOT NULL, country_code TEXT NOT NULL, district TEXT NOT NULL, population INTEGER NOT NULL, FOREIGN KEY (country_code) REFERENCES countries(code));
    CREATE TABLE country_languages (country_code TEXT NOT NULL, language TEXT NOT NULL, is_official TEXT NOT NULL DEFAULT 'F', percentage REAL NOT NULL, PRIMARY KEY (country_code, language), FOREIGN KEY (country_code) REFERENCES countries(code));

    INSERT INTO countries VALUES
      ('USA', 'United States', 'North America', 'North America', 9363520.00, 278357000, 77.1, 8510700.00, 1),
      ('CAN', 'Canada', 'North America', 'North America', 9970610.00, 31147000, 79.4, 598862.00, 2),
      ('JPN', 'Japan', 'Asia', 'Eastern Asia', 377829.00, 126714000, 80.7, 3787042.00, 3),
      ('DEU', 'Germany', 'Europe', 'Western Europe', 357022.00, 82164700, 77.4, 2133367.00, 4),
      ('FRA', 'France', 'Europe', 'Western Europe', 551500.00, 59225700, 78.8, 1424285.00, 5),
      ('BRA', 'Brazil', 'South America', 'South America', 8547403.00, 170115000, 62.9, 776739.00, 6),
      ('GBR', 'United Kingdom', 'Europe', 'British Islands', 242900.00, 59623400, 77.7, 1378330.00, 7);
    INSERT INTO cities VALUES
      (1, 'Washington', 'USA', 'District of Columbia', 572059), (2, 'Ottawa', 'CAN', 'Ontario', 337000), (3, 'Tokyo', 'JPN', 'Tokyo-to', 7980230),
      (4, 'Berlin', 'DEU', 'Berliini', 3386667), (5, 'Paris', 'FRA', 'Île-de-France', 2125246), (6, 'Brasília', 'BRA', 'Distrito Federal', 1968394),
      (7, 'London', 'GBR', 'England', 7285000), (8, 'New York', 'USA', 'New York', 8008278), (9, 'Los Angeles', 'USA', 'California', 3694820),
      (10, 'Toronto', 'CAN', 'Ontario', 2481494), (11, 'Osaka', 'JPN', 'Osaka', 2595674), (12, 'Munich', 'DEU', 'Bayern', 1194560);
    INSERT INTO country_languages VALUES
      ('USA', 'English', 'T', 86.2), ('USA', 'Spanish', 'F', 7.5), ('CAN', 'English', 'T', 60.4), ('CAN', 'French', 'T', 23.2),
      ('JPN', 'Japanese', 'T', 99.1), ('DEU', 'German', 'T', 91.3), ('FRA', 'French', 'T', 95.0), ('BRA', 'Portuguese', 'T', 97.5), ('GBR', 'English', 'T', 97.3);
  `);
  fs.writeFileSync(path.join(outDir, 'world.sqlite'), Buffer.from(world.export()));

  // 5. Employees
  console.log('Generating Employees database...');
  const employees = new SQL.Database();
  employees.run(`
    CREATE TABLE departments (dept_no TEXT PRIMARY KEY, dept_name TEXT NOT NULL);
    CREATE TABLE employees (emp_no INTEGER PRIMARY KEY, birth_date TEXT NOT NULL, first_name TEXT NOT NULL, last_name TEXT NOT NULL, gender TEXT NOT NULL, hire_date TEXT NOT NULL);
    CREATE TABLE dept_emp (emp_no INTEGER NOT NULL, dept_no TEXT NOT NULL, from_date TEXT NOT NULL, to_date TEXT NOT NULL, PRIMARY KEY (emp_no, dept_no), FOREIGN KEY (emp_no) REFERENCES employees(emp_no), FOREIGN KEY (dept_no) REFERENCES departments(dept_no));
    CREATE TABLE dept_manager (dept_no TEXT NOT NULL, emp_no INTEGER NOT NULL, from_date TEXT NOT NULL, to_date TEXT NOT NULL, PRIMARY KEY (dept_no, emp_no), FOREIGN KEY (dept_no) REFERENCES departments(dept_no), FOREIGN KEY (emp_no) REFERENCES employees(emp_no));
    CREATE TABLE titles (emp_no INTEGER NOT NULL, title TEXT NOT NULL, from_date TEXT NOT NULL, to_date TEXT, PRIMARY KEY (emp_no, title, from_date), FOREIGN KEY (emp_no) REFERENCES employees(emp_no));
    CREATE TABLE salaries (emp_no INTEGER NOT NULL, salary INTEGER NOT NULL, from_date TEXT NOT NULL, to_date TEXT NOT NULL, PRIMARY KEY (emp_no, from_date), FOREIGN KEY (emp_no) REFERENCES employees(emp_no));

    INSERT INTO departments VALUES ('d001', 'Marketing'), ('d002', 'Finance'), ('d003', 'Human Resources'), ('d004', 'Production'), ('d005', 'Development');
    INSERT INTO employees VALUES
      (10001, '1973-09-02', 'Georgi', 'Facello', 'M', '2016-06-26'), (10002, '1974-06-02', 'Bezalel', 'Simmel', 'F', '2015-11-21'),
      (10003, '1979-12-03', 'Parto', 'Bamford', 'M', '2016-08-28'), (10004, '1974-05-01', 'Chirstian', 'Koblick', 'M', '2016-12-01'),
      (10005, '1975-01-21', 'Kyoichi', 'Maliniak', 'M', '2017-09-12');
    INSERT INTO dept_emp VALUES (10001, 'd005', '2016-06-26', '9999-01-01'), (10002, 'd002', '2015-11-21', '9999-01-01'), (10003, 'd004', '2016-08-28', '9999-01-01'), (10004, 'd004', '2016-12-01', '9999-01-01'), (10005, 'd003', '2017-09-12', '9999-01-01');
    INSERT INTO dept_manager VALUES ('d001', 10001, '2016-06-26', '9999-01-01'), ('d004', 10003, '2016-08-28', '9999-01-01');
    INSERT INTO titles VALUES (10001, 'Senior Engineer', '2016-06-26', '9999-01-01'), (10002, 'Staff', '2015-11-21', '9999-01-01'), (10003, 'Senior Engineer', '2016-08-28', '9999-01-01');
    INSERT INTO salaries VALUES (10001, 88958, '2016-06-26', '9999-01-01'), (10002, 72527, '2015-11-21', '9999-01-01'), (10003, 43612, '2016-08-28', '9999-01-01'), (10004, 74057, '2016-12-01', '9999-01-01'), (10005, 94692, '2017-09-12', '9999-01-01');
  `);
  fs.writeFileSync(path.join(outDir, 'employees.sqlite'), Buffer.from(employees.export()));

  // 6. Formula 1
  console.log('Generating Formula 1 database...');
  const formula1 = new SQL.Database();
  formula1.run(`
    CREATE TABLE circuits (circuit_id INTEGER PRIMARY KEY, circuit_ref TEXT NOT NULL, name TEXT NOT NULL, location TEXT, country TEXT, lat REAL, lng REAL);
    CREATE TABLE drivers (driver_id INTEGER PRIMARY KEY, driver_ref TEXT NOT NULL, number INTEGER, code TEXT, forename TEXT NOT NULL, surname TEXT NOT NULL, dob TEXT, nationality TEXT);
    CREATE TABLE constructors (constructor_id INTEGER PRIMARY KEY, constructor_ref TEXT NOT NULL, name TEXT NOT NULL, nationality TEXT);
    CREATE TABLE races (race_id INTEGER PRIMARY KEY, year INTEGER NOT NULL, round INTEGER NOT NULL, circuit_id INTEGER NOT NULL, name TEXT NOT NULL, date TEXT, FOREIGN KEY (circuit_id) REFERENCES circuits(circuit_id));
    CREATE TABLE results (result_id INTEGER PRIMARY KEY, race_id INTEGER NOT NULL, driver_id INTEGER NOT NULL, constructor_id INTEGER NOT NULL, number INTEGER, grid INTEGER, position INTEGER, points REAL NOT NULL, laps INTEGER NOT NULL, time TEXT, fastest_lap_time TEXT, FOREIGN KEY (race_id) REFERENCES races(race_id), FOREIGN KEY (driver_id) REFERENCES drivers(driver_id), FOREIGN KEY (constructor_id) REFERENCES constructors(constructor_id));

    INSERT INTO circuits VALUES
      (1, 'monza', 'Autodromo Nazionale di Monza', 'Monza', 'Italy', 45.6156, 9.28111),
      (2, 'silverstone', 'Silverstone Circuit', 'Silverstone', 'UK', 52.0786, -1.01694),
      (3, 'spa', 'Circuit de Spa-Francorchamps', 'Spa', 'Belgium', 50.4372, 5.97139),
      (4, 'monaco', 'Circuit de Monaco', 'Monte-Carlo', 'Monaco', 43.7347, 7.42056),
      (5, 'suzuka', 'Suzuka Circuit', 'Suzuka', 'Japan', 34.8431, 136.541);
    INSERT INTO drivers VALUES
      (1, 'hamilton', 44, 'HAM', 'Lewis', 'Hamilton', '1985-01-07', 'British'),
      (2, 'verstappen', 1, 'VER', 'Max', 'Verstappen', '1997-09-30', 'Dutch'),
      (3, 'leclerc', 16, 'LEC', 'Charles', 'Leclerc', '1997-10-16', 'Monegasque'),
      (4, 'norris', 4, 'NOR', 'Lando', 'Norris', '1999-11-13', 'British'),
      (5, 'alonso', 14, 'ALO', 'Fernando', 'Alonso', '1981-07-29', 'Spanish'),
      (6, 'russell', 63, 'RUS', 'George', 'Russell', '1998-02-15', 'British');
    INSERT INTO constructors VALUES
      (1, 'red_bull', 'Red Bull Racing', 'Austrian'),
      (2, 'mercedes', 'Mercedes-AMG', 'German'),
      (3, 'ferrari', 'Ferrari', 'Italian'),
      (4, 'mclaren', 'McLaren', 'British'),
      (5, 'aston_martin', 'Aston Martin', 'British');
    INSERT INTO races VALUES
      (1, 2024, 1, 4, 'Monaco Grand Prix', '2024-05-26'),
      (2, 2024, 2, 2, 'British Grand Prix', '2024-07-07'),
      (3, 2024, 3, 3, 'Belgian Grand Prix', '2024-07-28'),
      (4, 2024, 4, 1, 'Italian Grand Prix', '2024-09-01'),
      (5, 2024, 5, 5, 'Japanese Grand Prix', '2024-04-07');
    INSERT INTO results VALUES
      (1, 1, 3, 3, 16, 1, 1, 25.0, 78, '1:43:24.450', '1:14.165'),
      (2, 1, 4, 4, 4, 4, 4, 12.0, 78, '+1.340', '1:14.450'),
      (3, 1, 2, 1, 1, 6, 6, 8.0, 78, '+1.560', '1:14.500'),
      (4, 2, 1, 2, 44, 2, 1, 25.0, 52, '1:22:27.059', '1:28.293'),
      (5, 2, 2, 1, 1, 4, 2, 18.0, 52, '+1.465', '1:28.500'),
      (6, 2, 4, 4, 4, 3, 3, 15.0, 52, '+7.547', '1:28.620'),
      (7, 3, 1, 2, 44, 3, 1, 25.0, 44, '1:19:57.566', '1:44.700'),
      (8, 3, 4, 4, 4, 4, 5, 10.0, 44, '+8.900', '1:45.000'),
      (9, 4, 3, 3, 16, 4, 1, 25.0, 53, '1:14:40.727', '1:21.432'),
      (10, 4, 4, 4, 4, 1, 3, 15.0, 53, '+4.105', '1:21.500');
  `);
  fs.writeFileSync(path.join(outDir, 'formula1.sqlite'), Buffer.from(formula1.export()));

  // 7. Classicmodels
  console.log('Generating Classicmodels database...');
  const classicmodels = new SQL.Database();
  classicmodels.run(`
    CREATE TABLE offices (office_code TEXT PRIMARY KEY, city TEXT NOT NULL, phone TEXT NOT NULL, country TEXT NOT NULL, territory TEXT NOT NULL);
    CREATE TABLE employees (employee_number INTEGER PRIMARY KEY, last_name TEXT NOT NULL, first_name TEXT NOT NULL, extension TEXT, email TEXT NOT NULL, office_code TEXT NOT NULL, reports_to INTEGER, job_title TEXT NOT NULL, FOREIGN KEY (office_code) REFERENCES offices(office_code), FOREIGN KEY (reports_to) REFERENCES employees(employee_number));
    CREATE TABLE customers (customer_number INTEGER PRIMARY KEY, customer_name TEXT NOT NULL, contact_last_name TEXT, contact_first_name TEXT, phone TEXT, city TEXT NOT NULL, country TEXT NOT NULL, sales_rep_employee_number INTEGER, credit_limit REAL, FOREIGN KEY (sales_rep_employee_number) REFERENCES employees(employee_number));
    CREATE TABLE product_lines (product_line TEXT PRIMARY KEY, text_description TEXT NOT NULL);
    CREATE TABLE products (product_code TEXT PRIMARY KEY, product_name TEXT NOT NULL, product_line TEXT NOT NULL, product_scale TEXT NOT NULL, product_vendor TEXT NOT NULL, quantity_in_stock INTEGER NOT NULL, buy_price REAL NOT NULL, msrp REAL NOT NULL, FOREIGN KEY (product_line) REFERENCES product_lines(product_line));
    CREATE TABLE orders (order_number INTEGER PRIMARY KEY, order_date TEXT NOT NULL, required_date TEXT NOT NULL, shipped_date TEXT, status TEXT NOT NULL, customer_number INTEGER NOT NULL, FOREIGN KEY (customer_number) REFERENCES customers(customer_number));
    CREATE TABLE order_details (order_number INTEGER NOT NULL, product_code TEXT NOT NULL, quantity_ordered INTEGER NOT NULL, price_each REAL NOT NULL, order_line_number INTEGER NOT NULL, PRIMARY KEY (order_number, product_code), FOREIGN KEY (order_number) REFERENCES orders(order_number), FOREIGN KEY (product_code) REFERENCES products(product_code));
    CREATE TABLE payments (customer_number INTEGER NOT NULL, check_number TEXT NOT NULL, payment_date TEXT NOT NULL, amount REAL NOT NULL, PRIMARY KEY (customer_number, check_number), FOREIGN KEY (customer_number) REFERENCES customers(customer_number));

    INSERT INTO offices VALUES
      ('1', 'San Francisco', '+1 650 219 4782', 'USA', 'NA'),
      ('2', 'Paris', '+33 14 723 4404', 'France', 'EMEA'),
      ('3', 'Tokyo', '+81 33 224 5000', 'Japan', 'APAC'),
      ('4', 'London', '+44 20 7877 2041', 'UK', 'EMEA');
    INSERT INTO employees VALUES
      (1002, 'Murphy', 'Diane', 'x5800', 'dmurphy@classicmodelcars.com', '1', NULL, 'President'),
      (1056, 'Patterson', 'Mary', 'x4611', 'mpatterson@classicmodelcars.com', '1', 1002, 'VP Sales'),
      (1165, 'Jennings', 'Leslie', 'x3291', 'ljennings@classicmodelcars.com', '1', 1056, 'Sales Rep'),
      (1370, 'Hernandez', 'Gerard', 'x2028', 'ghernandez@classicmodelcars.com', '2', 1056, 'Sales Rep'),
      (1621, 'Nishi', 'Mami', 'x101', 'mnishi@classicmodelcars.com', '3', 1056, 'Sales Rep');
    INSERT INTO customers VALUES
      (103, 'Atelier graphique', 'Schmitt', 'Carine', '40.32.2555', 'Nantes', 'France', 1370, 21000.00),
      (112, 'Signal Gift Stores', 'King', 'Sue', '7025551838', 'Las Vegas', 'USA', 1165, 71800.00),
      (114, 'Australian Collectors, Co.', 'Ferguson', 'Peter', '03 9520 4555', 'Melbourne', 'Australia', 1621, 117300.00),
      (119, 'La Rochelle Gifts', 'Labrune', 'Janine', '40.67.8555', 'Nantes', 'France', 1370, 118200.00);
    INSERT INTO product_lines VALUES
      ('Classic Cars', 'Attention to detail is evident in these die-cast classic motorcars.'),
      ('Vintage Cars', '1/18 and 1/24 scale replica models of early twentieth century motor cars.'),
      ('Motorcycles', 'Scale replicas of racing and cruising motorbikes.'),
      ('Planes', 'Authentic replicas of military and civilian aircraft.');
    INSERT INTO products VALUES
      ('S10_1678', '1969 Harley Davidson Ultimate Chopper', 'Motorcycles', '1:10', 'Min Lin Diecast', 7933, 48.81, 95.70),
      ('S10_1949', '1952 Alpine Renault 1300', 'Classic Cars', '1:10', 'Classic Metal Creations', 7305, 98.58, 214.30),
      ('S10_4698', '1968 Ford Mustang', 'Classic Cars', '1:10', 'Autoart Studio Design', 68, 95.34, 194.57),
      ('S12_1108', '2001 Ferrari Enzo', 'Classic Cars', '1:12', 'Second Gear Diecast', 2856, 95.59, 207.80),
      ('S18_1749', '1917 Grand Touring Sedan', 'Vintage Cars', '1:18', 'Welly Diecast', 2724, 86.70, 170.00);
    INSERT INTO orders VALUES
      (10100, '2024-01-06', '2024-01-13', '2024-01-10', 'Shipped', 112),
      (10101, '2024-01-09', '2024-01-18', '2024-01-11', 'Shipped', 103),
      (10102, '2024-01-10', '2024-01-18', '2024-01-14', 'Shipped', 114),
      (10103, '2024-01-29', '2024-02-07', '2024-02-02', 'Shipped', 119);
    INSERT INTO order_details VALUES
      (10100, 'S10_1678', 30, 95.70, 1),
      (10100, 'S10_1949', 50, 214.30, 2),
      (10101, 'S10_4698', 25, 194.57, 1),
      (10102, 'S12_1108', 41, 207.80, 1),
      (10103, 'S18_1749', 16, 170.00, 1);
    INSERT INTO payments VALUES
      (103, 'HQ336336', '2024-01-15', 4864.25),
      (112, 'ND458920', '2024-01-12', 13586.00),
      (114, 'DB933704', '2024-01-16', 8519.80),
      (119, 'IN884729', '2024-02-05', 2720.00);
  `);
  fs.writeFileSync(path.join(outDir, 'classicmodels.sqlite'), Buffer.from(classicmodels.export()));

  // 8. IMDb Movies
  console.log('Generating IMDb database...');
  const imdb = new SQL.Database();
  imdb.run(`
    CREATE TABLE directors (director_id INTEGER PRIMARY KEY, name TEXT NOT NULL, birth_year INTEGER);
    CREATE TABLE genres (genre_id INTEGER PRIMARY KEY, name TEXT NOT NULL);
    CREATE TABLE movies (movie_id INTEGER PRIMARY KEY, title TEXT NOT NULL, release_year INTEGER NOT NULL, runtime_minutes INTEGER, imdb_rating REAL NOT NULL, meta_score INTEGER, director_id INTEGER NOT NULL, FOREIGN KEY (director_id) REFERENCES directors(director_id));
    CREATE TABLE movie_genres (movie_id INTEGER NOT NULL, genre_id INTEGER NOT NULL, PRIMARY KEY (movie_id, genre_id), FOREIGN KEY (movie_id) REFERENCES movies(movie_id), FOREIGN KEY (genre_id) REFERENCES genres(genre_id));
    CREATE TABLE actors (actor_id INTEGER PRIMARY KEY, name TEXT NOT NULL, birth_year INTEGER);
    CREATE TABLE cast_members (movie_id INTEGER NOT NULL, actor_id INTEGER NOT NULL, role_name TEXT, billing_order INTEGER, PRIMARY KEY (movie_id, actor_id), FOREIGN KEY (movie_id) REFERENCES movies(movie_id), FOREIGN KEY (actor_id) REFERENCES actors(actor_id));

    INSERT INTO directors VALUES
      (1, 'Christopher Nolan', 1970),
      (2, 'Quentin Tarantino', 1963),
      (3, 'Steven Spielberg', 1946),
      (4, 'Martin Scorsese', 1942),
      (5, 'Denis Villeneuve', 1967);
    INSERT INTO genres VALUES
      (1, 'Action'), (2, 'Crime'), (3, 'Drama'), (4, 'Sci-Fi'), (5, 'Thriller');
    INSERT INTO movies VALUES
      (1, 'The Dark Knight', 2008, 152, 9.0, 84, 1),
      (2, 'Inception', 2010, 148, 8.8, 74, 1),
      (3, 'Pulp Fiction', 1994, 154, 8.9, 94, 2),
      (4, 'Goodfellas', 1990, 145, 8.7, 90, 4),
      (5, 'Dune: Part Two', 2024, 166, 8.6, 79, 5),
      (6, 'Schindler''s List', 1993, 195, 9.0, 95, 3),
      (7, 'Oppenheimer', 2023, 180, 8.9, 88, 1);
    INSERT INTO movie_genres VALUES
      (1, 1), (1, 2), (1, 3), (2, 1), (2, 4), (3, 2), (3, 3), (4, 2), (4, 3), (5, 1), (5, 4), (6, 3), (7, 3);
    INSERT INTO actors VALUES
      (1, 'Christian Bale', 1974),
      (2, 'Heath Ledger', 1979),
      (3, 'Leonardo DiCaprio', 1974),
      (4, 'John Travolta', 1954),
      (5, 'Robert De Niro', 1943),
      (6, 'Timothée Chalamet', 1995),
      (7, 'Cillian Murphy', 1976);
    INSERT INTO cast_members VALUES
      (1, 1, 'Bruce Wayne / Batman', 1),
      (1, 2, 'Joker', 2),
      (2, 3, 'Cobb', 1),
      (3, 4, 'Vincent Vega', 1),
      (4, 5, 'James Conway', 1),
      (5, 6, 'Paul Atreides', 1),
      (7, 7, 'J. Robert Oppenheimer', 1);
  `);
  fs.writeFileSync(path.join(outDir, 'imdb.sqlite'), Buffer.from(imdb.export()));

  // 9. Spotify
  console.log('Generating Spotify database...');
  const spotify = new SQL.Database();
  spotify.run(`
    CREATE TABLE artists (artist_id INTEGER PRIMARY KEY, artist_name TEXT NOT NULL, genre TEXT, monthly_listeners INTEGER);
    CREATE TABLE albums (album_id INTEGER PRIMARY KEY, album_name TEXT NOT NULL, artist_id INTEGER NOT NULL, release_year INTEGER, total_tracks INTEGER, FOREIGN KEY (artist_id) REFERENCES artists(artist_id));
    CREATE TABLE tracks (track_id INTEGER PRIMARY KEY, track_name TEXT NOT NULL, artist_id INTEGER NOT NULL, album_id INTEGER NOT NULL, duration_ms INTEGER NOT NULL, danceability REAL NOT NULL, energy REAL NOT NULL, valence REAL NOT NULL, tempo REAL NOT NULL, acousticness REAL NOT NULL, popularity INTEGER NOT NULL, FOREIGN KEY (artist_id) REFERENCES artists(artist_id), FOREIGN KEY (album_id) REFERENCES albums(album_id));

    INSERT INTO artists VALUES
      (1, 'Dua Lipa', 'Pop', 68000000),
      (2, 'The Weeknd', 'R&B / Pop', 105000000),
      (3, 'Billie Eilish', 'Alternative Pop', 74000000),
      (4, 'Daft Punk', 'Electronic', 22000000),
      (5, 'Ed Sheeran', 'Pop / Acoustic', 83000000);
    INSERT INTO albums VALUES
      (1, 'Future Nostalgia', 1, 2020, 11),
      (2, 'After Hours', 2, 2020, 14),
      (3, 'HIT ME HARD AND SOFT', 3, 2024, 10),
      (4, 'Random Access Memories', 4, 2013, 13),
      (5, 'Divide', 5, 2017, 16);
    INSERT INTO tracks VALUES
      (1, 'Levitating', 1, 1, 203000, 0.79, 0.82, 0.91, 103.0, 0.01, 88),
      (2, 'Don''t Start Now', 1, 1, 183000, 0.79, 0.79, 0.68, 124.0, 0.01, 86),
      (3, 'Blinding Lights', 2, 2, 200000, 0.51, 0.73, 0.33, 171.0, 0.00, 92),
      (4, 'Save Your Tears', 2, 2, 215000, 0.68, 0.82, 0.64, 118.0, 0.02, 90),
      (5, 'LUNCH', 3, 3, 180000, 0.72, 0.69, 0.84, 125.0, 0.08, 87),
      (6, 'BIRDS OF A FEATHER', 3, 3, 196000, 0.74, 0.51, 0.44, 105.0, 0.20, 94),
      (7, 'Get Lucky', 4, 4, 369000, 0.80, 0.86, 0.86, 116.0, 0.04, 85),
      (8, 'Shape of You', 5, 5, 233000, 0.82, 0.65, 0.93, 96.0, 0.58, 89),
      (9, 'Perfect', 5, 5, 263000, 0.60, 0.45, 0.17, 95.0, 0.78, 88);
  `);
  fs.writeFileSync(path.join(outDir, 'spotify.sqlite'), Buffer.from(spotify.export()));

  // 10. Pokemon
  console.log('Generating Pokemon database...');
  const pokemon = new SQL.Database();
  pokemon.run(`
    CREATE TABLE generations (generation_id INTEGER PRIMARY KEY, region TEXT NOT NULL);
    CREATE TABLE pokemon (pokedex_number INTEGER PRIMARY KEY, name TEXT NOT NULL, primary_type TEXT NOT NULL, secondary_type TEXT, generation_id INTEGER NOT NULL, hp INTEGER NOT NULL, attack INTEGER NOT NULL, defense INTEGER NOT NULL, special_attack INTEGER NOT NULL, special_defense INTEGER NOT NULL, speed INTEGER NOT NULL, is_legendary INTEGER NOT NULL DEFAULT 0, FOREIGN KEY (generation_id) REFERENCES generations(generation_id));
    CREATE TABLE abilities (ability_id INTEGER PRIMARY KEY, name TEXT NOT NULL, effect TEXT);
    CREATE TABLE pokemon_abilities (pokedex_number INTEGER NOT NULL, ability_id INTEGER NOT NULL, is_hidden INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (pokedex_number, ability_id), FOREIGN KEY (pokedex_number) REFERENCES pokemon(pokedex_number), FOREIGN KEY (ability_id) REFERENCES abilities(ability_id));

    INSERT INTO generations VALUES
      (1, 'Kanto'), (2, 'Johto'), (3, 'Hoenn'), (4, 'Sinnoh');
    INSERT INTO pokemon VALUES
      (1, 'Bulbasaur', 'Grass', 'Poison', 1, 45, 49, 49, 65, 65, 45, 0),
      (4, 'Charmander', 'Fire', NULL, 1, 39, 52, 43, 60, 50, 65, 0),
      (6, 'Charizard', 'Fire', 'Flying', 1, 78, 84, 78, 109, 85, 100, 0),
      (7, 'Squirtle', 'Water', NULL, 1, 44, 48, 65, 50, 64, 43, 0),
      (9, 'Blastoise', 'Water', NULL, 1, 79, 83, 100, 85, 105, 78, 0),
      (25, 'Pikachu', 'Electric', NULL, 1, 35, 55, 40, 50, 50, 90, 0),
      (130, 'Gyarados', 'Water', 'Flying', 1, 95, 125, 79, 60, 100, 81, 0),
      (149, 'Dragonite', 'Dragon', 'Flying', 1, 91, 134, 95, 100, 100, 80, 0),
      (150, 'Mewtwo', 'Psychic', NULL, 1, 106, 110, 90, 154, 90, 130, 1),
      (248, 'Tyranitar', 'Rock', 'Dark', 2, 100, 134, 110, 95, 100, 61, 0);
    INSERT INTO abilities VALUES
      (1, 'Overgrow', 'Powers up Grass-type moves when HP is low.'),
      (2, 'Blaze', 'Powers up Fire-type moves when HP is low.'),
      (3, 'Torrent', 'Powers up Water-type moves when HP is low.'),
      (4, 'Static', 'Contact with the Pokemon may cause paralysis.'),
      (5, 'Pressure', 'Raises opposing Pokemon PP usage.');
    INSERT INTO pokemon_abilities VALUES
      (1, 1, 0), (4, 2, 0), (6, 2, 0), (7, 3, 0), (9, 3, 0), (25, 4, 0), (150, 5, 0);
  `);
  fs.writeFileSync(path.join(outDir, 'pokemon.sqlite'), Buffer.from(pokemon.export()));

  // 11. University
  console.log('Generating University database...');
  const university = new SQL.Database();
  university.run(`
    CREATE TABLE departments (dept_id TEXT PRIMARY KEY, dept_name TEXT NOT NULL, building TEXT, budget REAL);
    CREATE TABLE instructors (instructor_id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, dept_id TEXT NOT NULL, salary REAL, FOREIGN KEY (dept_id) REFERENCES departments(dept_id));
    CREATE TABLE courses (course_id INTEGER PRIMARY KEY, course_code TEXT NOT NULL, title TEXT NOT NULL, dept_id TEXT NOT NULL, instructor_id INTEGER, credits INTEGER NOT NULL, FOREIGN KEY (dept_id) REFERENCES departments(dept_id), FOREIGN KEY (instructor_id) REFERENCES instructors(instructor_id));
    CREATE TABLE students (student_id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, major TEXT NOT NULL, total_credits INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE enrollments (enrollment_id INTEGER PRIMARY KEY, student_id INTEGER NOT NULL, course_id INTEGER NOT NULL, semester TEXT NOT NULL, grade TEXT NOT NULL, FOREIGN KEY (student_id) REFERENCES students(student_id), FOREIGN KEY (course_id) REFERENCES courses(course_id));

    INSERT INTO departments VALUES
      ('CS', 'Computer Science', 'Turing Hall', 1200000.00),
      ('MATH', 'Mathematics', 'Euler Hall', 850000.00),
      ('PHYS', 'Physics', 'Newton Hall', 900000.00),
      ('BIO', 'Biology', 'Darwin Hall', 780000.00);
    INSERT INTO instructors VALUES
      (101, 'Alan', 'Turing', 'CS', 115000.00),
      (102, 'Grace', 'Hopper', 'CS', 125000.00),
      (103, 'Carl', 'Gauss', 'MATH', 105000.00),
      (104, 'Richard', 'Feynman', 'PHYS', 110000.00);
    INSERT INTO courses VALUES
      (1, 'CS-101', 'Introduction to Computer Science', 'CS', 101, 4),
      (2, 'CS-201', 'Data Structures and Algorithms', 'CS', 102, 4),
      (3, 'CS-301', 'Database System Principles', 'CS', 102, 4),
      (4, 'MATH-101', 'Calculus I', 'MATH', 103, 4),
      (5, 'PHYS-101', 'Classical Mechanics', 'PHYS', 104, 4);
    INSERT INTO students VALUES
      (1001, 'Ada', 'Lovelace', 'Computer Science', 12),
      (1002, 'Katherine', 'Johnson', 'Mathematics', 12),
      (1003, 'Claude', 'Shannon', 'Computer Science', 8),
      (1004, 'Marie', 'Curie', 'Physics', 8);
    INSERT INTO enrollments VALUES
      (1, 1001, 1, 'Fall 2024', 'A'),
      (2, 1001, 2, 'Fall 2024', 'A'),
      (3, 1001, 3, 'Spring 2025', 'A'),
      (4, 1002, 4, 'Fall 2024', 'A'),
      (5, 1002, 1, 'Fall 2024', 'B'),
      (6, 1003, 1, 'Fall 2024', 'A'),
      (7, 1003, 3, 'Spring 2025', 'B'),
      (8, 1004, 5, 'Fall 2024', 'A');
  `);
  fs.writeFileSync(path.join(outDir, 'university.sqlite'), Buffer.from(university.export()));

  // 12. Premier League
  console.log('Generating Premier League database...');
  const premierLeague = new SQL.Database();
  premierLeague.run(`
    CREATE TABLE teams (team_id INTEGER PRIMARY KEY, name TEXT NOT NULL, short_name TEXT NOT NULL, stadium TEXT NOT NULL, capacity INTEGER);
    CREATE TABLE players (player_id INTEGER PRIMARY KEY, name TEXT NOT NULL, team_id INTEGER NOT NULL, position TEXT NOT NULL, nationality TEXT, appearances INTEGER NOT NULL, goals INTEGER NOT NULL, assists INTEGER NOT NULL, FOREIGN KEY (team_id) REFERENCES teams(team_id));
    CREATE TABLE matches (match_id INTEGER PRIMARY KEY, match_date TEXT NOT NULL, home_team_id INTEGER NOT NULL, away_team_id INTEGER NOT NULL, home_score INTEGER NOT NULL, away_score INTEGER NOT NULL, referee TEXT, FOREIGN KEY (home_team_id) REFERENCES teams(team_id), FOREIGN KEY (away_team_id) REFERENCES teams(team_id));

    INSERT INTO teams VALUES
      (1, 'Manchester City', 'MCI', 'Etihad Stadium', 53400),
      (2, 'Arsenal', 'ARS', 'Emirates Stadium', 60704),
      (3, 'Liverpool', 'LIV', 'Anfield', 61276),
      (4, 'Aston Villa', 'AVL', 'Villa Park', 42657),
      (5, 'Tottenham Hotspur', 'TOT', 'Tottenham Hotspur Stadium', 62850),
      (6, 'Chelsea', 'CHE', 'Stamford Bridge', 40343);
    INSERT INTO players VALUES
      (1, 'Erling Haaland', 1, 'Forward', 'Norway', 31, 27, 5),
      (2, 'Kevin De Bruyne', 1, 'Midfielder', 'Belgium', 18, 4, 10),
      (3, 'Bukayo Saka', 2, 'Forward', 'England', 35, 16, 9),
      (4, 'Martin Ødegaard', 2, 'Midfielder', 'Norway', 35, 8, 10),
      (5, 'Mohamed Salah', 3, 'Forward', 'Egypt', 32, 18, 10),
      (6, 'Ollie Watkins', 4, 'Forward', 'England', 37, 19, 13),
      (7, 'Cole Palmer', 6, 'Midfielder', 'England', 33, 22, 11),
      (8, 'Son Heung-min', 5, 'Forward', 'South Korea', 35, 17, 10);
    INSERT INTO matches VALUES
      (1, '2024-03-31', 1, 2, 0, 0, 'Anthony Taylor'),
      (2, '2024-04-03', 1, 4, 4, 1, 'Darren England'),
      (3, '2024-04-14', 3, 6, 2, 1, 'Michael Oliver'),
      (4, '2024-04-28', 5, 2, 2, 3, 'Michael Oliver'),
      (5, '2024-05-05', 3, 5, 4, 2, 'Paul Tierney'),
      (6, '2024-05-19', 1, 6, 3, 1, 'John Brooks');
  `);
  fs.writeFileSync(path.join(outDir, 'premier_league.sqlite'), Buffer.from(premierLeague.export()));

  // 13. Brazilian E-Commerce
  console.log('Generating E-Commerce database...');
  const ecommerce = new SQL.Database();
  ecommerce.run(`
    CREATE TABLE customers (customer_id TEXT PRIMARY KEY, customer_city TEXT NOT NULL, customer_state TEXT NOT NULL);
    CREATE TABLE sellers (seller_id TEXT PRIMARY KEY, seller_name TEXT NOT NULL, seller_city TEXT NOT NULL, seller_state TEXT NOT NULL);
    CREATE TABLE products (product_id TEXT PRIMARY KEY, category_name TEXT NOT NULL, name_length INTEGER, description_length INTEGER, photos_qty INTEGER, weight_g INTEGER);
    CREATE TABLE orders (order_id TEXT PRIMARY KEY, customer_id TEXT NOT NULL, order_status TEXT NOT NULL, purchase_timestamp TEXT NOT NULL, delivered_timestamp TEXT, FOREIGN KEY (customer_id) REFERENCES customers(customer_id));
    CREATE TABLE order_items (order_item_id INTEGER PRIMARY KEY, order_id TEXT NOT NULL, product_id TEXT NOT NULL, seller_id TEXT NOT NULL, price REAL NOT NULL, freight_value REAL NOT NULL, FOREIGN KEY (order_id) REFERENCES orders(order_id), FOREIGN KEY (product_id) REFERENCES products(product_id), FOREIGN KEY (seller_id) REFERENCES sellers(seller_id));
    CREATE TABLE order_reviews (review_id TEXT PRIMARY KEY, order_id TEXT NOT NULL, review_score INTEGER NOT NULL, review_comment TEXT, review_date TEXT, FOREIGN KEY (order_id) REFERENCES orders(order_id));

    INSERT INTO customers VALUES
      ('c001', 'Sao Paulo', 'SP'),
      ('c002', 'Rio de Janeiro', 'RJ'),
      ('c003', 'Belo Horizonte', 'MG'),
      ('c004', 'Curitiba', 'PR'),
      ('c005', 'Salvador', 'BA');
    INSERT INTO sellers VALUES
      ('s001', 'MegaTech Store', 'Sao Paulo', 'SP'),
      ('s002', 'Luz & Decor', 'Curitiba', 'PR'),
      ('s003', 'Moda Fashion', 'Belo Horizonte', 'MG');
    INSERT INTO products VALUES
      ('p001', 'Electronics', 45, 320, 3, 850),
      ('p002', 'Home & Decor', 52, 450, 4, 1200),
      ('p003', 'Fashion & Apparel', 38, 210, 2, 350),
      ('p004', 'Computers & Tablets', 48, 600, 5, 2100);
    INSERT INTO orders VALUES
      ('ord_01', 'c001', 'delivered', '2024-01-15 10:20:00', '2024-01-18 14:00:00'),
      ('ord_02', 'c002', 'delivered', '2024-01-20 16:45:00', '2024-01-25 11:30:00'),
      ('ord_03', 'c003', 'delivered', '2024-02-01 09:15:00', '2024-02-04 18:20:00'),
      ('ord_04', 'c004', 'delivered', '2024-02-10 14:00:00', '2024-02-12 16:00:00'),
      ('ord_05', 'c005', 'shipped', '2024-02-14 11:00:00', NULL);
    INSERT INTO order_items VALUES
      (1, 'ord_01', 'p001', 's001', 129.90, 15.50),
      (2, 'ord_02', 'p002', 's002', 89.00, 22.10),
      (3, 'ord_03', 'p003', 's003', 49.99, 12.00),
      (4, 'ord_04', 'p004', 's001', 499.00, 35.00),
      (5, 'ord_05', 'p001', 's001', 129.90, 18.00);
    INSERT INTO order_reviews VALUES
      ('rev_1', 'ord_01', 5, 'Fast delivery and great product.', '2024-01-19'),
      ('rev_2', 'ord_02', 4, 'Very good quality.', '2024-01-26'),
      ('rev_3', 'ord_03', 5, 'Loved the material.', '2024-02-05'),
      ('rev_4', 'ord_04', 5, 'Excellent workstation performance.', '2024-02-13');
  `);
  fs.writeFileSync(path.join(outDir, 'ecommerce.sqlite'), Buffer.from(ecommerce.export()));

  // 14. GitHub Analytics
  console.log('Generating GitHub database...');
  const github = new SQL.Database();
  github.run(`
    CREATE TABLE users (user_id INTEGER PRIMARY KEY, username TEXT NOT NULL, full_name TEXT, company TEXT, location TEXT, followers_count INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE repositories (repo_id INTEGER PRIMARY KEY, repo_name TEXT NOT NULL, owner_id INTEGER NOT NULL, primary_language TEXT, stars_count INTEGER NOT NULL DEFAULT 0, forks_count INTEGER NOT NULL DEFAULT 0, open_issues_count INTEGER NOT NULL DEFAULT 0, is_private INTEGER NOT NULL DEFAULT 0, FOREIGN KEY (owner_id) REFERENCES users(user_id));
    CREATE TABLE commits (commit_id INTEGER PRIMARY KEY, repo_id INTEGER NOT NULL, author_id INTEGER NOT NULL, commit_hash TEXT NOT NULL, message TEXT NOT NULL, lines_added INTEGER NOT NULL, lines_deleted INTEGER NOT NULL, committed_date TEXT NOT NULL, FOREIGN KEY (repo_id) REFERENCES repositories(repo_id), FOREIGN KEY (author_id) REFERENCES users(user_id));
    CREATE TABLE pull_requests (pr_id INTEGER PRIMARY KEY, repo_id INTEGER NOT NULL, author_id INTEGER NOT NULL, title TEXT NOT NULL, state TEXT NOT NULL, comments_count INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, FOREIGN KEY (repo_id) REFERENCES repositories(repo_id), FOREIGN KEY (author_id) REFERENCES users(user_id));

    INSERT INTO users VALUES
      (1, 'torvalds', 'Linus Torvalds', 'Linux Foundation', 'Portland, OR', 195000),
      (2, 'gaearon', 'Dan Abramov', 'Independent', 'London, UK', 84000),
      (3, 'sindresorhus', 'Sindre Sorhus', 'Self-employed', 'Bangkok, Thailand', 56000),
      (4, 'antirez', 'Salvatore Sanfilippo', 'Redis Labs', 'Sicily, Italy', 32000);
    INSERT INTO repositories VALUES
      (1, 'linux', 1, 'C', 172000, 53000, 420, 0),
      (2, 'react', 2, 'JavaScript', 224000, 45000, 1150, 0),
      (3, 'awesome', 3, 'Markdown', 315000, 27000, 80, 0),
      (4, 'redis', 4, 'C', 64000, 23000, 210, 0);
    INSERT INTO commits VALUES
      (1, 1, 1, 'a1c4e9f', 'Merge branch drivers-v2', 450, 120, '2024-05-01'),
      (2, 2, 2, 'b8e2d41', 'Refactor fiber reconciliation', 180, 75, '2024-05-03'),
      (3, 4, 4, 'f9c0e22', 'Optimize dict hash collision', 65, 14, '2024-05-05'),
      (4, 2, 2, 'c3a1190', 'Fix state transition timing', 40, 12, '2024-05-06');
    INSERT INTO pull_requests VALUES
      (1, 2, 2, 'Add compiler memoization hints', 'merged', 14, '2024-04-20'),
      (2, 2, 3, 'Support strict server components', 'merged', 8, '2024-04-25'),
      (3, 4, 4, 'Cluster replication heartbeat patch', 'merged', 5, '2024-05-02'),
      (4, 1, 1, 'Memory cgroup barrier sync', 'open', 3, '2024-05-07');
  `);
  fs.writeFileSync(path.join(outDir, 'github.sqlite'), Buffer.from(github.export()));

  // 15. Flights
  console.log('Generating Flights database...');
  const flights = new SQL.Database();
  flights.run(`
    CREATE TABLE airlines (airline_id INTEGER PRIMARY KEY, iata_code TEXT NOT NULL, airline_name TEXT NOT NULL, country TEXT NOT NULL);
    CREATE TABLE airports (airport_id INTEGER PRIMARY KEY, iata_code TEXT NOT NULL, name TEXT NOT NULL, city TEXT NOT NULL, country TEXT NOT NULL, timezone TEXT NOT NULL);
    CREATE TABLE flights (flight_id INTEGER PRIMARY KEY, flight_number TEXT NOT NULL, airline_id INTEGER NOT NULL, origin_airport_id INTEGER NOT NULL, dest_airport_id INTEGER NOT NULL, scheduled_departure TEXT NOT NULL, scheduled_arrival TEXT NOT NULL, departure_delay_min INTEGER NOT NULL DEFAULT 0, arrival_delay_min INTEGER NOT NULL DEFAULT 0, distance_miles INTEGER NOT NULL, status TEXT NOT NULL, FOREIGN KEY (airline_id) REFERENCES airlines(airline_id), FOREIGN KEY (origin_airport_id) REFERENCES airports(airport_id), FOREIGN KEY (dest_airport_id) REFERENCES airports(airport_id));

    INSERT INTO airlines VALUES
      (1, 'DL', 'Delta Air Lines', 'USA'),
      (2, 'UA', 'United Airlines', 'USA'),
      (3, 'BA', 'British Airways', 'UK'),
      (4, 'LH', 'Lufthansa', 'Germany'),
      (5, 'SQ', 'Singapore Airlines', 'Singapore');
    INSERT INTO airports VALUES
      (1, 'JFK', 'John F. Kennedy International', 'New York', 'USA', 'America/New_York'),
      (2, 'LHR', 'London Heathrow', 'London', 'UK', 'Europe/London'),
      (3, 'SFO', 'San Francisco International', 'San Francisco', 'USA', 'America/Los_Angeles'),
      (4, 'FRA', 'Frankfurt Airport', 'Frankfurt', 'Germany', 'Europe/Berlin'),
      (5, 'SIN', 'Singapore Changi', 'Singapore', 'Singapore', 'Asia/Singapore');
    INSERT INTO flights VALUES
      (1, 'DL401', 1, 1, 2, '2024-06-01 08:30:00', '2024-06-01 20:45:00', 5, 0, 3451, 'on_time'),
      (2, 'UA102', 2, 3, 1, '2024-06-01 09:00:00', '2024-06-01 17:35:00', 25, 18, 2586, 'delayed'),
      (3, 'BA178', 3, 1, 2, '2024-06-01 18:00:00', '2024-06-02 06:15:00', 0, 0, 3451, 'on_time'),
      (4, 'LH404', 4, 4, 1, '2024-06-01 11:15:00', '2024-06-01 14:05:00', 45, 30, 3855, 'delayed'),
      (5, 'SQ025', 5, 1, 5, '2024-06-01 21:00:00', '2024-06-03 06:10:00', 0, 0, 9537, 'on_time');
  `);
  fs.writeFileSync(path.join(outDir, 'flights.sqlite'), Buffer.from(flights.export()));

  // 16. Hospital Healthcare
  console.log('Generating Hospital database...');
  const hospital = new SQL.Database();
  hospital.run(`
    CREATE TABLE departments (dept_id INTEGER PRIMARY KEY, name TEXT NOT NULL, head_doctor TEXT NOT NULL, bed_capacity INTEGER NOT NULL);
    CREATE TABLE doctors (doctor_id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, specialty TEXT NOT NULL, dept_id INTEGER NOT NULL, FOREIGN KEY (dept_id) REFERENCES departments(dept_id));
    CREATE TABLE patients (patient_id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, date_of_birth TEXT NOT NULL, gender TEXT NOT NULL, blood_type TEXT NOT NULL);
    CREATE TABLE admissions (admission_id INTEGER PRIMARY KEY, patient_id INTEGER NOT NULL, attending_doctor_id INTEGER NOT NULL, admission_date TEXT NOT NULL, discharge_date TEXT, room_number TEXT NOT NULL, diagnosis TEXT NOT NULL, FOREIGN KEY (patient_id) REFERENCES patients(patient_id), FOREIGN KEY (attending_doctor_id) REFERENCES doctors(doctor_id));
    CREATE TABLE medications (medication_id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, unit_cost REAL NOT NULL);
    CREATE TABLE prescriptions (prescription_id INTEGER PRIMARY KEY, admission_id INTEGER NOT NULL, medication_id INTEGER NOT NULL, dosage TEXT NOT NULL, frequency TEXT NOT NULL, quantity INTEGER NOT NULL, FOREIGN KEY (admission_id) REFERENCES admissions(admission_id), FOREIGN KEY (medication_id) REFERENCES medications(medication_id));

    INSERT INTO departments VALUES
      (1, 'Cardiology', 'Dr. Robert Mercer', 45),
      (2, 'Neurology', 'Dr. Sarah Connor', 30),
      (3, 'Orthopedics', 'Dr. Gregory House', 40),
      (4, 'Pediatrics', 'Dr. Allison Cameron', 25);
    INSERT INTO doctors VALUES
      (1, 'Robert', 'Mercer', 'Cardiologist', 1),
      (2, 'Sarah', 'Connor', 'Neurologist', 2),
      (3, 'Gregory', 'House', 'Diagnostic Medicine', 3),
      (4, 'James', 'Wilson', 'Oncologist', 1);
    INSERT INTO patients VALUES
      (1, 'Arthur', 'Dent', '1982-03-11', 'M', 'O+'),
      (2, 'Trillian', 'Astra', '1985-07-24', 'F', 'A+'),
      (3, 'Ford', 'Prefect', '1979-11-04', 'M', 'B-'),
      (4, 'Zaphod', 'Beeblebrox', '1975-04-12', 'M', 'AB+');
    INSERT INTO admissions VALUES
      (1, 1, 1, '2024-04-10', '2024-04-15', '302A', 'Hypertension Crisis'),
      (2, 2, 2, '2024-04-18', '2024-04-22', '415B', 'Migraine with Aura'),
      (3, 3, 3, '2024-05-01', NULL, '208', 'Fractured Fibula'),
      (4, 4, 1, '2024-05-03', NULL, '310', 'Arrhythmia');
    INSERT INTO medications VALUES
      (1, 'Lisinopril', 'Antihypertensive', 12.50),
      (2, 'Sumatriptan', 'Triptan', 28.00),
      (3, 'Ibuprofen 800mg', 'NSAID', 4.50),
      (4, 'Amiodarone', 'Antiarrhythmic', 45.00);
    INSERT INTO prescriptions VALUES
      (1, 1, 1, '10mg', 'Once daily', 30),
      (2, 2, 2, '50mg', 'As needed', 12),
      (3, 3, 3, '800mg', 'Every 8 hours', 45),
      (4, 4, 4, '200mg', 'Twice daily', 60);
  `);
  fs.writeFileSync(path.join(outDir, 'hospital.sqlite'), Buffer.from(hospital.export()));

  // 17. Real Estate
  console.log('Generating Real Estate database...');
  const realEstate = new SQL.Database();
  realEstate.run(`
    CREATE TABLE neighborhoods (neighborhood_id INTEGER PRIMARY KEY, neighborhood_name TEXT NOT NULL, city TEXT NOT NULL, state TEXT NOT NULL, zip_code TEXT NOT NULL);
    CREATE TABLE agents (agent_id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, agency_name TEXT NOT NULL, phone TEXT NOT NULL, commission_rate REAL NOT NULL);
    CREATE TABLE properties (property_id INTEGER PRIMARY KEY, address TEXT NOT NULL, neighborhood_id INTEGER NOT NULL, agent_id INTEGER NOT NULL, property_type TEXT NOT NULL, bedrooms INTEGER NOT NULL, bathrooms REAL NOT NULL, square_feet INTEGER NOT NULL, price REAL NOT NULL, status TEXT NOT NULL, listed_date TEXT NOT NULL, FOREIGN KEY (neighborhood_id) REFERENCES neighborhoods(neighborhood_id), FOREIGN KEY (agent_id) REFERENCES agents(agent_id));

    INSERT INTO neighborhoods VALUES
      (1, 'Back Bay', 'Boston', 'MA', '02116'),
      (2, 'Capitol Hill', 'Seattle', 'WA', '98102'),
      (3, 'SoHo', 'New York', 'NY', '10012'),
      (4, 'Lincoln Park', 'Chicago', 'IL', '60614');
    INSERT INTO agents VALUES
      (1, 'Jessica', 'Pearson', 'Pearson Real Estate', '617-555-0199', 2.5),
      (2, 'Harvey', 'Specter', 'Manhattan Luxury Living', '212-555-0144', 3.0),
      (3, 'Rachel', 'Zane', 'Emerald City Properties', '206-555-0182', 2.5);
    INSERT INTO properties VALUES
      (1, '142 Beacon St', 1, 1, 'Condo', 2, 2.0, 1450, 1250000.00, 'for_sale', '2024-03-01'),
      (2, '89 Commonwealth Ave', 1, 1, 'Townhouse', 4, 3.5, 3200, 3100000.00, 'sold', '2024-01-15'),
      (3, '452 Broadway #4A', 3, 2, 'Loft', 3, 2.5, 2400, 4200000.00, 'for_sale', '2024-03-20'),
      (4, '712 E Pine St', 2, 3, 'Single Family', 3, 2.0, 1850, 890000.00, 'sold', '2024-02-10'),
      (5, '2214 N Clark St', 4, 3, 'Condo', 2, 1.5, 1150, 475000.00, 'for_sale', '2024-04-05');
  `);
  fs.writeFileSync(path.join(outDir, 'real_estate.sqlite'), Buffer.from(realEstate.export()));

  // 18. Stock Market
  console.log('Generating Stock Market database...');
  const stocks = new SQL.Database();
  stocks.run(`
    CREATE TABLE companies (company_id INTEGER PRIMARY KEY, company_name TEXT NOT NULL, sector TEXT NOT NULL, market_cap_billions REAL NOT NULL, dividend_yield_pct REAL NOT NULL);
    CREATE TABLE tickers (ticker_id INTEGER PRIMARY KEY, ticker TEXT NOT NULL UNIQUE, company_id INTEGER NOT NULL, exchange TEXT NOT NULL, FOREIGN KEY (company_id) REFERENCES companies(company_id));
    CREATE TABLE daily_prices (price_id INTEGER PRIMARY KEY, ticker_id INTEGER NOT NULL, trade_date TEXT NOT NULL, open_price REAL NOT NULL, high_price REAL NOT NULL, low_price REAL NOT NULL, close_price REAL NOT NULL, volume INTEGER NOT NULL, FOREIGN KEY (ticker_id) REFERENCES tickers(ticker_id));
    CREATE TABLE portfolios (portfolio_id INTEGER PRIMARY KEY, portfolio_name TEXT NOT NULL, investor_name TEXT NOT NULL, created_date TEXT NOT NULL);
    CREATE TABLE holdings (holding_id INTEGER PRIMARY KEY, portfolio_id INTEGER NOT NULL, ticker_id INTEGER NOT NULL, shares_owned REAL NOT NULL, average_buy_price REAL NOT NULL, FOREIGN KEY (portfolio_id) REFERENCES portfolios(portfolio_id), FOREIGN KEY (ticker_id) REFERENCES tickers(ticker_id));

    INSERT INTO companies VALUES
      (1, 'Apple Inc.', 'Technology', 2850.50, 0.55),
      (2, 'Microsoft Corp.', 'Technology', 3120.00, 0.72),
      (3, 'JPMorgan Chase & Co.', 'Financials', 580.20, 2.35),
      (4, 'Johnson & Johnson', 'Healthcare', 375.40, 3.10);
    INSERT INTO tickers VALUES
      (1, 'AAPL', 1, 'NASDAQ'),
      (2, 'MSFT', 2, 'NASDAQ'),
      (3, 'JPM', 3, 'NYSE'),
      (4, 'JNJ', 4, 'NYSE');
    INSERT INTO daily_prices VALUES
      (1, 1, '2024-05-10', 183.05, 184.20, 182.10, 183.85, 48200000),
      (2, 2, '2024-05-10', 412.50, 415.80, 411.20, 414.70, 21400000),
      (3, 3, '2024-05-10', 198.40, 200.10, 197.80, 199.50, 9400000),
      (4, 4, '2024-05-10', 148.20, 149.30, 147.90, 148.90, 6800000);
    INSERT INTO portfolios VALUES
      (1, 'Tech Growth Fund', 'Warren Buffett', '2022-01-15'),
      (2, 'Dividend Income', 'Charlie Munger', '2022-03-01');
    INSERT INTO holdings VALUES
      (1, 1, 1, 500.0, 155.00),
      (2, 1, 2, 350.0, 320.00),
      (3, 2, 3, 800.0, 160.00),
      (4, 2, 4, 600.0, 142.00);
  `);
  fs.writeFileSync(path.join(outDir, 'stocks.sqlite'), Buffer.from(stocks.export()));

  // 19. Food Delivery
  console.log('Generating Food Delivery database...');
  const foodDelivery = new SQL.Database();
  foodDelivery.run(`
    CREATE TABLE restaurants (restaurant_id INTEGER PRIMARY KEY, name TEXT NOT NULL, cuisine_type TEXT NOT NULL, address TEXT NOT NULL, rating REAL NOT NULL);
    CREATE TABLE drivers (driver_id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, vehicle_type TEXT NOT NULL, rating REAL NOT NULL);
    CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, email TEXT NOT NULL, delivery_address TEXT NOT NULL);
    CREATE TABLE orders (order_id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL, restaurant_id INTEGER NOT NULL, driver_id INTEGER, order_total REAL NOT NULL, delivery_fee REAL NOT NULL, tip_amount REAL NOT NULL, order_status TEXT NOT NULL, delivery_time_minutes INTEGER, order_timestamp TEXT NOT NULL, FOREIGN KEY (customer_id) REFERENCES customers(customer_id), FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id), FOREIGN KEY (driver_id) REFERENCES drivers(driver_id));

    INSERT INTO restaurants VALUES
      (1, 'Lucia Pizzeria', 'Italian', '140 Grand St', 4.8),
      (2, 'Tokyo Ramen Bar', 'Japanese', '88 Bowery St', 4.7),
      (3, 'Taqueria El Sol', 'Mexican', '230 5th Ave', 4.6),
      (4, 'Green Garden Bowl', 'Vegan / Salad', '55 Spring St', 4.5);
    INSERT INTO drivers VALUES
      (1, 'Marco', 'Rossi', 'Scooter', 4.9),
      (2, 'Kenji', 'Takahashi', 'Bicycle', 4.8),
      (3, 'Carlos', 'Gomez', 'Car', 4.7);
    INSERT INTO customers VALUES
      (1, 'Emily', 'Clark', 'emily@example.com', '12 Waverly Pl'),
      (2, 'David', 'Kim', 'david@example.com', '340 W 42nd St'),
      (3, 'Sarah', 'Jenkins', 'sarah@example.com', '78 1st Ave');
    INSERT INTO orders VALUES
      (1, 1, 1, 1, 38.50, 3.99, 5.00, 'delivered', 28, '2024-05-01 19:15:00'),
      (2, 2, 2, 2, 29.00, 2.99, 4.50, 'delivered', 22, '2024-05-01 19:40:00'),
      (3, 3, 3, 3, 44.00, 4.50, 6.00, 'delivered', 35, '2024-05-01 20:05:00'),
      (4, 1, 4, 1, 24.50, 3.99, 3.50, 'delivered', 25, '2024-05-02 12:30:00');
  `);
  fs.writeFileSync(path.join(outDir, 'food_delivery.sqlite'), Buffer.from(foodDelivery.export()));

  // 20. Library
  console.log('Generating Library database...');
  const library = new SQL.Database();
  library.run(`
    CREATE TABLE authors (author_id INTEGER PRIMARY KEY, name TEXT NOT NULL, nationality TEXT NOT NULL);
    CREATE TABLE genres (genre_id INTEGER PRIMARY KEY, genre_name TEXT NOT NULL);
    CREATE TABLE books (book_id INTEGER PRIMARY KEY, title TEXT NOT NULL, author_id INTEGER NOT NULL, genre_id INTEGER NOT NULL, isbn TEXT NOT NULL, published_year INTEGER, total_copies INTEGER NOT NULL, available_copies INTEGER NOT NULL, FOREIGN KEY (author_id) REFERENCES authors(author_id), FOREIGN KEY (genre_id) REFERENCES genres(genre_id));
    CREATE TABLE members (member_id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, email TEXT NOT NULL, membership_type TEXT NOT NULL, join_date TEXT NOT NULL);
    CREATE TABLE loans (loan_id INTEGER PRIMARY KEY, book_id INTEGER NOT NULL, member_id INTEGER NOT NULL, loan_date TEXT NOT NULL, due_date TEXT NOT NULL, return_date TEXT, FOREIGN KEY (book_id) REFERENCES books(book_id), FOREIGN KEY (member_id) REFERENCES members(member_id));
    CREATE TABLE fines (fine_id INTEGER PRIMARY KEY, loan_id INTEGER NOT NULL, amount REAL NOT NULL, is_paid INTEGER NOT NULL DEFAULT 0, FOREIGN KEY (loan_id) REFERENCES loans(loan_id));

    INSERT INTO authors VALUES
      (1, 'George Orwell', 'British'),
      (2, 'Gabriel García Márquez', 'Colombian'),
      (3, 'Jane Austen', 'British'),
      (4, 'Haruki Murakami', 'Japanese');
    INSERT INTO genres VALUES
      (1, 'Dystopian Fiction'),
      (2, 'Magical Realism'),
      (3, 'Classic Romance'),
      (4, 'Contemporary Fiction');
    INSERT INTO books VALUES
      (1, '1984', 1, 1, '978-0451524935', 1949, 5, 2),
      (2, 'Animal Farm', 1, 1, '978-0451526342', 1945, 4, 3),
      (3, 'One Hundred Years of Solitude', 2, 2, '978-0060883287', 1967, 3, 1),
      (4, 'Pride and Prejudice', 3, 3, '978-0141439518', 1813, 6, 4),
      (5, 'Norwegian Wood', 4, 4, '978-0375704024', 1987, 4, 2);
    INSERT INTO members VALUES
      (1, 'Alice', 'Walker', 'alice@library.org', 'Standard', '2023-01-10'),
      (2, 'Bob', 'Dylan', 'bob@library.org', 'Premium', '2023-03-15'),
      (3, 'Clara', 'Schumann', 'clara@library.org', 'Student', '2023-09-01');
    INSERT INTO loans VALUES
      (1, 1, 1, '2024-04-15', '2024-05-01', NULL),
      (2, 3, 2, '2024-04-10', '2024-04-24', '2024-04-22'),
      (3, 5, 3, '2024-04-01', '2024-04-15', NULL);
    INSERT INTO fines VALUES
      (1, 1, 3.50, 0),
      (2, 3, 7.00, 0);
  `);
  fs.writeFileSync(path.join(outDir, 'library.sqlite'), Buffer.from(library.export()));

  // 21. Gaming & Esports
  console.log('Generating Gaming database...');
  const gaming = new SQL.Database();
  gaming.run(`
    CREATE TABLE guilds (guild_id INTEGER PRIMARY KEY, guild_name TEXT NOT NULL, tag TEXT NOT NULL, region TEXT NOT NULL);
    CREATE TABLE players (player_id INTEGER PRIMARY KEY, gamer_tag TEXT NOT NULL, guild_id INTEGER, level INTEGER NOT NULL, rank_tier TEXT NOT NULL, matches_played INTEGER NOT NULL, matches_won INTEGER NOT NULL, total_score INTEGER NOT NULL, FOREIGN KEY (guild_id) REFERENCES guilds(guild_id));
    CREATE TABLE weapons (weapon_id INTEGER PRIMARY KEY, name TEXT NOT NULL, weapon_class TEXT NOT NULL, base_damage INTEGER NOT NULL);
    CREATE TABLE match_stats (stat_id INTEGER PRIMARY KEY, player_id INTEGER NOT NULL, weapon_id INTEGER NOT NULL, kills INTEGER NOT NULL, deaths INTEGER NOT NULL, headshots INTEGER NOT NULL, damage_dealt INTEGER NOT NULL, accuracy_pct REAL NOT NULL, FOREIGN KEY (player_id) REFERENCES players(player_id), FOREIGN KEY (weapon_id) REFERENCES weapons(weapon_id));

    INSERT INTO guilds VALUES
      (1, 'Sentinels', 'SEN', 'NA'),
      (2, 'Fnatic', 'FNC', 'EU'),
      (3, 'Paper Rex', 'PRX', 'APAC');
    INSERT INTO players VALUES
      (1, 'TenZ', 1, 120, 'Radiant', 340, 245, 94200),
      (2, 'Boaster', 2, 115, 'Immortal 3', 310, 210, 81500),
      (3, 'f0rsakeN', 3, 125, 'Radiant', 380, 270, 102300),
      (4, 'Chronicle', 2, 110, 'Radiant', 290, 205, 78900);
    INSERT INTO weapons VALUES
      (1, 'Vandal', 'Rifle', 40),
      (2, 'Phantom', 'Rifle', 39),
      (3, 'Operator', 'Sniper', 150),
      (4, 'Sheriff', 'Sidearm', 55);
    INSERT INTO match_stats VALUES
      (1, 1, 1, 24, 12, 16, 3850, 42.5),
      (2, 1, 3, 14, 5, 12, 2100, 78.0),
      (3, 2, 2, 18, 15, 8, 2900, 31.0),
      (4, 3, 1, 31, 14, 21, 4800, 46.0),
      (5, 4, 1, 22, 11, 14, 3400, 38.5);
  `);
  fs.writeFileSync(path.join(outDir, 'gaming.sqlite'), Buffer.from(gaming.export()));

  // 22. Crypto Ledgers
  console.log('Generating Crypto database...');
  const crypto = new SQL.Database();
  crypto.run(`
    CREATE TABLE tokens (token_id INTEGER PRIMARY KEY, symbol TEXT NOT NULL, name TEXT NOT NULL, consensus_type TEXT NOT NULL, current_price_usd REAL NOT NULL, circulating_supply REAL NOT NULL, volume_24h_usd REAL NOT NULL);
    CREATE TABLE wallets (wallet_id INTEGER PRIMARY KEY, wallet_address TEXT NOT NULL UNIQUE, label TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE balances (balance_id INTEGER PRIMARY KEY, wallet_id INTEGER NOT NULL, token_id INTEGER NOT NULL, balance_amount REAL NOT NULL, last_updated TEXT NOT NULL, FOREIGN KEY (wallet_id) REFERENCES wallets(wallet_id), FOREIGN KEY (token_id) REFERENCES tokens(token_id));
    CREATE TABLE transactions (tx_id INTEGER PRIMARY KEY, tx_hash TEXT NOT NULL UNIQUE, from_wallet_id INTEGER NOT NULL, to_wallet_id INTEGER NOT NULL, token_id INTEGER NOT NULL, amount REAL NOT NULL, gas_fee_usd REAL NOT NULL, status TEXT NOT NULL, timestamp TEXT NOT NULL, FOREIGN KEY (from_wallet_id) REFERENCES wallets(wallet_id), FOREIGN KEY (to_wallet_id) REFERENCES wallets(wallet_id), FOREIGN KEY (token_id) REFERENCES tokens(token_id));

    INSERT INTO tokens VALUES
      (1, 'BTC', 'Bitcoin', 'Proof of Work', 64500.00, 19700000.0, 28500000000.0),
      (2, 'ETH', 'Ethereum', 'Proof of Stake', 3450.00, 120000000.0, 14200000000.0),
      (3, 'SOL', 'Solana', 'Proof of History', 152.00, 445000000.0, 3800000000.0),
      (4, 'USDC', 'USD Coin', 'Fiat-backed', 1.00, 33000000000.0, 6100000000.0);
    INSERT INTO wallets VALUES
      (1, '0x71C...3a9', 'Treasury Cold Storage', '2021-01-10'),
      (2, '0x48D...e21', 'Liquidity Pool Staking', '2022-04-18'),
      (3, '0x99F...bc4', 'Exchange Hot Wallet', '2023-08-01');
    INSERT INTO balances VALUES
      (1, 1, 1, 150.5, '2024-05-10'),
      (2, 1, 2, 2800.0, '2024-05-10'),
      (3, 2, 2, 4500.0, '2024-05-10'),
      (4, 2, 3, 12000.0, '2024-05-10'),
      (5, 3, 4, 5000000.0, '2024-05-10');
    INSERT INTO transactions VALUES
      (1, '0xab1...01', 3, 1, 2, 50.0, 4.20, 'confirmed', '2024-05-09 14:22:00'),
      (2, '0xcd2...02', 1, 2, 2, 100.0, 3.85, 'confirmed', '2024-05-09 16:40:00'),
      (3, '0xef3...03', 3, 2, 3, 450.0, 0.05, 'confirmed', '2024-05-10 09:15:00');
  `);
  fs.writeFileSync(path.join(outDir, 'crypto.sqlite'), Buffer.from(crypto.export()));

  // 23. Hotel Bookings
  console.log('Generating Hotels database...');
  const hotels = new SQL.Database();
  hotels.run(`
    CREATE TABLE hotels (hotel_id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT NOT NULL, country TEXT NOT NULL, star_rating REAL NOT NULL);
    CREATE TABLE rooms (room_id INTEGER PRIMARY KEY, hotel_id INTEGER NOT NULL, room_type TEXT NOT NULL, nightly_rate REAL NOT NULL, max_occupancy INTEGER NOT NULL, FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id));
    CREATE TABLE guests (guest_id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, email TEXT NOT NULL, country TEXT NOT NULL);
    CREATE TABLE bookings (booking_id INTEGER PRIMARY KEY, hotel_id INTEGER NOT NULL, room_id INTEGER NOT NULL, guest_id INTEGER NOT NULL, check_in_date TEXT NOT NULL, check_out_date TEXT NOT NULL, total_amount REAL NOT NULL, status TEXT NOT NULL, FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id), FOREIGN KEY (room_id) REFERENCES rooms(room_id), FOREIGN KEY (guest_id) REFERENCES guests(guest_id));

    INSERT INTO hotels VALUES
      (1, 'Grand Palace Hotel', 'Paris', 'France', 4.9),
      (2, 'The Ritz Carlton', 'Tokyo', 'Japan', 4.8),
      (3, 'The Plaza Hotel', 'New York', 'USA', 4.7),
      (4, 'Amalfi Cliff Resort', 'Amalfi', 'Italy', 4.9);
    INSERT INTO rooms VALUES
      (1, 1, 'Deluxe King Suite', 450.00, 2),
      (2, 1, 'Executive Double', 320.00, 4),
      (3, 2, 'Panoramic Skyline Suite', 580.00, 2),
      (4, 3, 'Park View Penthouse', 850.00, 4),
      (5, 4, 'Sea View Terrace', 620.00, 2);
    INSERT INTO guests VALUES
      (1, 'Alexander', 'Wright', 'alex.wright@example.com', 'UK'),
      (2, 'Sophie', 'Dubois', 'sophie.dubois@example.fr', 'France'),
      (3, 'Kenzo', 'Tanaka', 'kenzo.tanaka@example.jp', 'Japan');
    INSERT INTO bookings VALUES
      (1, 1, 1, 1, '2024-06-10', '2024-06-15', 2250.00, 'completed'),
      (2, 2, 3, 2, '2024-07-01', '2024-07-05', 2320.00, 'completed'),
      (3, 3, 4, 3, '2024-08-12', '2024-08-16', 3400.00, 'confirmed'),
      (4, 4, 5, 1, '2024-09-05', '2024-09-10', 3100.00, 'confirmed');
  `);
  fs.writeFileSync(path.join(outDir, 'hotels.sqlite'), Buffer.from(hotels.export()));

  console.log('All 23 SQLite databases generated successfully in public/databases/');
}

createDatabases().catch(console.error);
