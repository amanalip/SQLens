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

  // 1. Chinook Database
  console.log('Generating Chinook database...');
  const chinook = new SQL.Database();
  chinook.run(`
    CREATE TABLE artists (
      artist_id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE albums (
      album_id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      artist_id INTEGER NOT NULL,
      FOREIGN KEY (artist_id) REFERENCES artists(artist_id)
    );

    CREATE TABLE media_types (
      media_type_id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE genres (
      genre_id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE tracks (
      track_id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      album_id INTEGER,
      media_type_id INTEGER NOT NULL,
      genre_id INTEGER,
      composer TEXT,
      milliseconds INTEGER NOT NULL,
      bytes INTEGER,
      unit_price REAL NOT NULL,
      FOREIGN KEY (album_id) REFERENCES albums(album_id),
      FOREIGN KEY (media_type_id) REFERENCES media_types(media_type_id),
      FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
    );

    CREATE TABLE customers (
      customer_id INTEGER PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      company TEXT,
      city TEXT,
      state TEXT,
      country TEXT NOT NULL,
      email TEXT NOT NULL,
      support_rep_id INTEGER
    );

    CREATE TABLE invoices (
      invoice_id INTEGER PRIMARY KEY,
      customer_id INTEGER NOT NULL,
      invoice_date TEXT NOT NULL,
      billing_address TEXT,
      billing_city TEXT,
      billing_country TEXT NOT NULL,
      total REAL NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    );

    CREATE TABLE invoice_items (
      invoice_line_id INTEGER PRIMARY KEY,
      invoice_id INTEGER NOT NULL,
      track_id INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id),
      FOREIGN KEY (track_id) REFERENCES tracks(track_id)
    );
  `);

  // Insert seed data for Chinook
  chinook.run(`
    INSERT INTO artists VALUES
      (1, 'AC/DC'), (2, 'Accept'), (3, 'Aerosmith'), (4, 'Alanis Morissette'), (5, 'Alice In Chains'),
      (6, 'Miles Davis'), (7, 'Bill Evans'), (8, 'John Coltrane'), (9, 'Led Zeppelin'), (10, 'Queen');

    INSERT INTO albums VALUES
      (1, 'For Those About To Rock We Salute You', 1),
      (2, 'Balls to the Wall', 2),
      (3, 'Restless and Wild', 2),
      (4, 'Let There Be Rock', 1),
      (5, 'Big Ones', 3),
      (6, 'Jagged Little Pill', 4),
      (7, 'Facelift', 5),
      (8, 'Kind of Blue', 6),
      (9, 'A Love Supreme', 8),
      (10, 'A Night at the Opera', 10);

    INSERT INTO genres VALUES
      (1, 'Rock'), (2, 'Jazz'), (3, 'Metal'), (4, 'Alternative & Punk'), (5, 'Blues');

    INSERT INTO media_types VALUES
      (1, 'MPEG audio file'), (2, 'Protected AAC audio file'), (3, 'Protected MPEG-4 video file');

    INSERT INTO tracks VALUES
      (1, 'For Those About To Rock (We Salute You)', 1, 1, 1, 'Angus Young, Malcolm Young, Brian Johnson', 343719, 11170334, 0.99),
      (2, 'Balls to the Wall', 2, 2, 3, 'U. Dirkschneider, W. Hoffmann, H. Frank', 342562, 5510424, 0.99),
      (3, 'Fast As a Shark', 3, 2, 3, 'F. Baltes, S. Kaufman, U. Dirkchneider', 230619, 3990994, 0.99),
      (4, 'Restless and Wild', 3, 2, 3, 'F. Baltes, R.A. Smith-Diesel', 252051, 4331779, 0.99),
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
      (1, 1, 1, 0.99, 1),
      (2, 1, 2, 0.99, 1),
      (3, 2, 3, 0.99, 1),
      (4, 2, 4, 0.99, 2),
      (5, 3, 6, 1.29, 2),
      (6, 4, 9, 1.29, 3),
      (7, 5, 10, 0.99, 4);
  `);
  fs.writeFileSync(path.join(outDir, 'chinook.sqlite'), Buffer.from(chinook.export()));

  // 2. Northwind Database
  console.log('Generating Northwind database...');
  const northwind = new SQL.Database();
  northwind.run(`
    CREATE TABLE suppliers (
      supplier_id INTEGER PRIMARY KEY,
      company_name TEXT NOT NULL,
      contact_name TEXT,
      country TEXT
    );

    CREATE TABLE categories (
      category_id INTEGER PRIMARY KEY,
      category_name TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE products (
      product_id INTEGER PRIMARY KEY,
      product_name TEXT NOT NULL,
      supplier_id INTEGER,
      category_id INTEGER,
      unit_price REAL NOT NULL,
      units_in_stock INTEGER NOT NULL,
      discontinued INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
      FOREIGN KEY (category_id) REFERENCES categories(category_id)
    );

    CREATE TABLE customers (
      customer_id TEXT PRIMARY KEY,
      company_name TEXT NOT NULL,
      city TEXT,
      country TEXT
    );

    CREATE TABLE employees (
      employee_id INTEGER PRIMARY KEY,
      last_name TEXT NOT NULL,
      first_name TEXT NOT NULL,
      title TEXT,
      reports_to INTEGER,
      FOREIGN KEY (reports_to) REFERENCES employees(employee_id)
    );

    CREATE TABLE orders (
      order_id INTEGER PRIMARY KEY,
      customer_id TEXT,
      employee_id INTEGER,
      order_date TEXT,
      freight REAL,
      ship_country TEXT,
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
      FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
    );

    CREATE TABLE order_details (
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      discount REAL NOT NULL DEFAULT 0,
      PRIMARY KEY (order_id, product_id),
      FOREIGN KEY (order_id) REFERENCES orders(order_id),
      FOREIGN KEY (product_id) REFERENCES products(product_id)
    );
  `);

  northwind.run(`
    INSERT INTO suppliers VALUES
      (1, 'Exotic Liquids', 'Charlotte Cooper', 'UK'),
      (2, 'New Orleans Cajun Delights', 'Shelley Burke', 'USA'),
      (3, 'Grandma Kelly''s Homestead', 'Regina Murphy', 'USA'),
      (4, 'Tokyo Traders', 'Yoshi Nagase', 'Japan');

    INSERT INTO categories VALUES
      (1, 'Beverages', 'Soft drinks, coffees, teas, beers, and ales'),
      (2, 'Condiments', 'Sweet and savory sauces, relishes, spreads, and seasonings'),
      (3, 'Confections', 'Desserts, candies, and sweet breads'),
      (4, 'Dairy Products', 'Cheeses');

    INSERT INTO products VALUES
      (1, 'Chai', 1, 1, 18.00, 39, 0),
      (2, 'Chang', 1, 1, 19.00, 17, 0),
      (3, 'Aniseed Syrup', 1, 2, 10.00, 13, 0),
      (4, 'Chef Anton''s Cajun Seasoning', 2, 2, 22.00, 53, 0),
      (5, 'Chef Anton''s Gumbo Mix', 2, 2, 21.35, 0, 1),
      (6, 'Grandma''s Boysenberry Spread', 3, 2, 25.00, 120, 0),
      (7, 'Pavlova', 3, 3, 17.45, 29, 0),
      (8, 'Queso Cabrales', 4, 4, 21.00, 22, 0);

    INSERT INTO customers VALUES
      ('ALFKI', 'Alfreds Futterkiste', 'Berlin', 'Germany'),
      ('ANATR', 'Ana Trujillo Emparedados y helados', 'México D.F.', 'Mexico'),
      ('ANTON', 'Antonio Moreno Taquería', 'México D.F.', 'Mexico'),
      ('AROUT', 'Around the Horn', 'London', 'UK'),
      ('BERGS', 'Berglunds snabbköp', 'Luleå', 'Sweden');

    INSERT INTO employees VALUES
      (1, 'Davolio', 'Nancy', 'Sales Representative', 2),
      (2, 'Fuller', 'Andrew', 'Vice President, Sales', NULL),
      (3, 'Leverling', 'Janet', 'Sales Representative', 2),
      (4, 'Peacock', 'Margaret', 'Sales Representative', 2),
      (5, 'Buchanan', 'Steven', 'Sales Manager', 2);

    INSERT INTO orders VALUES
      (10248, 'ALFKI', 1, '2024-01-10', 32.38, 'Germany'),
      (10249, 'ANATR', 3, '2024-01-11', 11.61, 'Mexico'),
      (10250, 'BERGS', 4, '2024-01-15', 65.83, 'Sweden'),
      (10251, 'ALFKI', 1, '2024-02-01', 41.34, 'Germany'),
      (10252, 'AROUT', 5, '2024-02-03', 51.30, 'UK');

    INSERT INTO order_details VALUES
      (10248, 1, 18.00, 12, 0),
      (10248, 2, 19.00, 10, 0),
      (10249, 3, 10.00, 5, 0),
      (10250, 4, 22.00, 35, 0.15),
      (10250, 6, 25.00, 15, 0.05),
      (10251, 1, 18.00, 20, 0.1),
      (10252, 7, 17.45, 40, 0.05);
  `);
  fs.writeFileSync(path.join(outDir, 'northwind.sqlite'), Buffer.from(northwind.export()));

  // 3. Sakila Database
  console.log('Generating Sakila database...');
  const sakila = new SQL.Database();
  sakila.run(`
    CREATE TABLE actors (
      actor_id INTEGER PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL
    );

    CREATE TABLE categories (
      category_id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    );

    CREATE TABLE films (
      film_id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      release_year INTEGER,
      rental_duration INTEGER NOT NULL,
      rental_rate REAL NOT NULL,
      length INTEGER,
      rating TEXT
    );

    CREATE TABLE film_actor (
      actor_id INTEGER NOT NULL,
      film_id INTEGER NOT NULL,
      PRIMARY KEY (actor_id, film_id),
      FOREIGN KEY (actor_id) REFERENCES actors(actor_id),
      FOREIGN KEY (film_id) REFERENCES films(film_id)
    );

    CREATE TABLE film_category (
      film_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      PRIMARY KEY (film_id, category_id),
      FOREIGN KEY (film_id) REFERENCES films(film_id),
      FOREIGN KEY (category_id) REFERENCES categories(category_id)
    );

    CREATE TABLE customers (
      customer_id INTEGER PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE rentals (
      rental_id INTEGER PRIMARY KEY,
      rental_date TEXT NOT NULL,
      film_id INTEGER NOT NULL,
      customer_id INTEGER NOT NULL,
      return_date TEXT,
      FOREIGN KEY (film_id) REFERENCES films(film_id),
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    );

    CREATE TABLE payments (
      payment_id INTEGER PRIMARY KEY,
      customer_id INTEGER NOT NULL,
      rental_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      payment_date TEXT NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
      FOREIGN KEY (rental_id) REFERENCES rentals(rental_id)
    );
  `);

  sakila.run(`
    INSERT INTO actors VALUES
      (1, 'PENELOPE', 'GUINESS'),
      (2, 'NICK', 'WAHLBERG'),
      (3, 'ED', 'CHASE'),
      (4, 'JENNIFER', 'DAVIS'),
      (5, 'JOHNNY', 'LOLLOBRIGIDA');

    INSERT INTO categories VALUES
      (1, 'Action'), (2, 'Animation'), (3, 'Children'), (4, 'Classics'), (5, 'Comedy'), (6, 'Drama');

    INSERT INTO films VALUES
      (1, 'ACADEMY DINOSAUR', 'An Epic Drama of a Feminist And a Mad Scientist', 2006, 6, 0.99, 86, 'PG'),
      (2, 'ACE GOLDFINGER', 'A Astounding Epistle of a Database Administrator', 2006, 3, 4.99, 48, 'G'),
      (3, 'ADAPTATION HOLES', 'A Astounding Reflection of a Lumberjack', 2006, 7, 2.99, 50, 'NC-17'),
      (4, 'AFFAIR PREJUDICE', 'A Fanciful Documentary of a Frisbee', 2006, 5, 2.99, 117, 'G'),
      (5, 'AFRICAN EGG', 'A Fast-Paced Documentary of a Pastry Chef', 2006, 6, 2.99, 130, 'G');

    INSERT INTO film_actor VALUES
      (1, 1), (1, 2), (2, 3), (3, 1), (4, 4), (5, 5), (2, 5);

    INSERT INTO film_category VALUES
      (1, 6), (2, 1), (3, 2), (4, 4), (5, 5);

    INSERT INTO customers VALUES
      (1, 'MARY', 'SMITH', 'mary.smith@sakilacustomer.org', 1),
      (2, 'PATRICIA', 'JOHNSON', 'patricia.johnson@sakilacustomer.org', 1),
      (3, 'LINDA', 'WILLIAMS', 'linda.williams@sakilacustomer.org', 1),
      (4, 'BARBARA', 'JONES', 'barbara.jones@sakilacustomer.org', 1);

    INSERT INTO rentals VALUES
      (1, '2024-02-14 15:16:03', 1, 1, '2024-02-18 11:20:00'),
      (2, '2024-02-15 10:00:00', 2, 2, '2024-02-17 14:30:00'),
      (3, '2024-02-16 12:45:00', 3, 3, '2024-02-22 17:00:00'),
      (4, '2024-02-17 08:30:00', 5, 1, NULL);

    INSERT INTO payments VALUES
      (1, 1, 1, 2.99, '2024-02-14 15:16:03'),
      (2, 2, 2, 4.99, '2024-02-15 10:00:00'),
      (3, 3, 3, 2.99, '2024-02-16 12:45:00'),
      (4, 1, 4, 2.99, '2024-02-17 08:30:00');
  `);
  fs.writeFileSync(path.join(outDir, 'sakila.sqlite'), Buffer.from(sakila.export()));

  // 4. World Database
  console.log('Generating World database...');
  const world = new SQL.Database();
  world.run(`
    CREATE TABLE countries (
      code TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      continent TEXT NOT NULL,
      region TEXT NOT NULL,
      surface_area REAL NOT NULL,
      population INTEGER NOT NULL,
      life_expectancy REAL,
      gnp REAL,
      capital INTEGER
    );

    CREATE TABLE cities (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      country_code TEXT NOT NULL,
      district TEXT NOT NULL,
      population INTEGER NOT NULL,
      FOREIGN KEY (country_code) REFERENCES countries(code)
    );

    CREATE TABLE country_languages (
      country_code TEXT NOT NULL,
      language TEXT NOT NULL,
      is_official TEXT NOT NULL DEFAULT 'F',
      percentage REAL NOT NULL,
      PRIMARY KEY (country_code, language),
      FOREIGN KEY (country_code) REFERENCES countries(code)
    );
  `);

  world.run(`
    INSERT INTO countries VALUES
      ('USA', 'United States', 'North America', 'North America', 9363520.00, 278357000, 77.1, 8510700.00, 1),
      ('CAN', 'Canada', 'North America', 'North America', 9970610.00, 31147000, 79.4, 598862.00, 2),
      ('JPN', 'Japan', 'Asia', 'Eastern Asia', 377829.00, 126714000, 80.7, 3787042.00, 3),
      ('DEU', 'Germany', 'Europe', 'Western Europe', 357022.00, 82164700, 77.4, 2133367.00, 4),
      ('FRA', 'France', 'Europe', 'Western Europe', 551500.00, 59225700, 78.8, 1424285.00, 5),
      ('BRA', 'Brazil', 'South America', 'South America', 8547403.00, 170115000, 62.9, 776739.00, 6),
      ('GBR', 'United Kingdom', 'Europe', 'British Islands', 242900.00, 59623400, 77.7, 1378330.00, 7);

    INSERT INTO cities VALUES
      (1, 'Washington', 'USA', 'District of Columbia', 572059),
      (2, 'Ottawa', 'CAN', 'Ontario', 337000),
      (3, 'Tokyo', 'JPN', 'Tokyo-to', 7980230),
      (4, 'Berlin', 'DEU', 'Berliini', 3386667),
      (5, 'Paris', 'FRA', 'Île-de-France', 2125246),
      (6, 'Brasília', 'BRA', 'Distrito Federal', 1968394),
      (7, 'London', 'GBR', 'England', 7285000),
      (8, 'New York', 'USA', 'New York', 8008278),
      (9, 'Los Angeles', 'USA', 'California', 3694820),
      (10, 'Toronto', 'CAN', 'Ontario', 2481494),
      (11, 'Osaka', 'JPN', 'Osaka', 2595674),
      (12, 'Munich', 'DEU', 'Bayern', 1194560);

    INSERT INTO country_languages VALUES
      ('USA', 'English', 'T', 86.2),
      ('USA', 'Spanish', 'F', 7.5),
      ('CAN', 'English', 'T', 60.4),
      ('CAN', 'French', 'T', 23.2),
      ('JPN', 'Japanese', 'T', 99.1),
      ('DEU', 'German', 'T', 91.3),
      ('FRA', 'French', 'T', 95.0),
      ('BRA', 'Portuguese', 'T', 97.5),
      ('GBR', 'English', 'T', 97.3);
  `);
  fs.writeFileSync(path.join(outDir, 'world.sqlite'), Buffer.from(world.export()));

  // 5. Employees Database
  console.log('Generating Employees database...');
  const employees = new SQL.Database();
  employees.run(`
    CREATE TABLE departments (
      dept_no TEXT PRIMARY KEY,
      dept_name TEXT NOT NULL
    );

    CREATE TABLE employees (
      emp_no INTEGER PRIMARY KEY,
      birth_date TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      gender TEXT NOT NULL,
      hire_date TEXT NOT NULL
    );

    CREATE TABLE dept_emp (
      emp_no INTEGER NOT NULL,
      dept_no TEXT NOT NULL,
      from_date TEXT NOT NULL,
      to_date TEXT NOT NULL,
      PRIMARY KEY (emp_no, dept_no),
      FOREIGN KEY (emp_no) REFERENCES employees(emp_no),
      FOREIGN KEY (dept_no) REFERENCES departments(dept_no)
    );

    CREATE TABLE dept_manager (
      dept_no TEXT NOT NULL,
      emp_no INTEGER NOT NULL,
      from_date TEXT NOT NULL,
      to_date TEXT NOT NULL,
      PRIMARY KEY (dept_no, emp_no),
      FOREIGN KEY (dept_no) REFERENCES departments(dept_no),
      FOREIGN KEY (emp_no) REFERENCES employees(emp_no)
    );

    CREATE TABLE titles (
      emp_no INTEGER NOT NULL,
      title TEXT NOT NULL,
      from_date TEXT NOT NULL,
      to_date TEXT,
      PRIMARY KEY (emp_no, title, from_date),
      FOREIGN KEY (emp_no) REFERENCES employees(emp_no)
    );

    CREATE TABLE salaries (
      emp_no INTEGER NOT NULL,
      salary INTEGER NOT NULL,
      from_date TEXT NOT NULL,
      to_date TEXT NOT NULL,
      PRIMARY KEY (emp_no, from_date),
      FOREIGN KEY (emp_no) REFERENCES employees(emp_no)
    );
  `);

  employees.run(`
    INSERT INTO departments VALUES
      ('d001', 'Marketing'),
      ('d002', 'Finance'),
      ('d003', 'Human Resources'),
      ('d004', 'Production'),
      ('d005', 'Development'),
      ('d006', 'Quality Management'),
      ('d007', 'Sales');

    INSERT INTO employees VALUES
      (10001, '1973-09-02', 'Georgi', 'Facello', 'M', '2016-06-26'),
      (10002, '1974-06-02', 'Bezalel', 'Simmel', 'F', '2015-11-21'),
      (10003, '1979-12-03', 'Parto', 'Bamford', 'M', '2016-08-28'),
      (10004, '1974-05-01', 'Chirstian', 'Koblick', 'M', '2016-12-01'),
      (10005, '1975-01-21', 'Kyoichi', 'Maliniak', 'M', '2017-09-12'),
      (10006, '1973-04-20', 'Anneke', 'Preusig', 'F', '2018-06-02'),
      (10007, '1977-05-23', 'Tzvetan', 'Zielinski', 'F', '2019-02-10');

    INSERT INTO dept_emp VALUES
      (10001, 'd005', '2016-06-26', '9999-01-01'),
      (10002, 'd007', '2015-11-21', '9999-01-01'),
      (10003, 'd004', '2016-08-28', '9999-01-01'),
      (10004, 'd004', '2016-12-01', '9999-01-01'),
      (10005, 'd003', '2017-09-12', '9999-01-01'),
      (10006, 'd005', '2018-06-02', '9999-01-01'),
      (10007, 'd001', '2019-02-10', '9999-01-01');

    INSERT INTO dept_manager VALUES
      ('d001', 10007, '2019-02-10', '9999-01-01'),
      ('d004', 10003, '2016-08-28', '9999-01-01'),
      ('d005', 10001, '2016-06-26', '9999-01-01');

    INSERT INTO titles VALUES
      (10001, 'Senior Engineer', '2016-06-26', '9999-01-01'),
      (10002, 'Staff', '2015-11-21', '9999-01-01'),
      (10003, 'Senior Engineer', '2016-08-28', '9999-01-01'),
      (10004, 'Engineer', '2016-12-01', '9999-01-01'),
      (10005, 'Senior Staff', '2017-09-12', '9999-01-01'),
      (10006, 'Senior Engineer', '2018-06-02', '9999-01-01'),
      (10007, 'Senior Staff', '2019-02-10', '9999-01-01');

    INSERT INTO salaries VALUES
      (10001, 88958, '2016-06-26', '9999-01-01'),
      (10002, 72527, '2015-11-21', '9999-01-01'),
      (10003, 43612, '2016-08-28', '9999-01-01'),
      (10004, 74057, '2016-12-01', '9999-01-01'),
      (10005, 94692, '2017-09-12', '9999-01-01'),
      (10006, 59755, '2018-06-02', '9999-01-01'),
      (10007, 88074, '2019-02-10', '9999-01-01');
  `);
  fs.writeFileSync(path.join(outDir, 'employees.sqlite'), Buffer.from(employees.export()));

  console.log('All 5 SQLite databases generated successfully in public/databases/');
}

createDatabases().catch(console.error);
