import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const northwindExpansion: SampleQuery[] = [
  sample('northwind-11', 'Discount Cost by Country', 'Estimates the sales value given up to discounts in each shipping country.', `SELECT o.ship_country,
       ROUND(SUM(od.unit_price * od.quantity * od.discount), 2) AS discount_value,
       ROUND(SUM(od.unit_price * od.quantity * (1 - od.discount)), 2) AS net_sales
FROM orders o
JOIN order_details od ON o.order_id = od.order_id
GROUP BY o.ship_country
ORDER BY discount_value DESC;`),
    sample('northwind-12', 'Suppliers With No Ordered Products', 'Locates suppliers whose products have not appeared in an order.', `SELECT s.supplier_id, s.company_name, s.country
FROM suppliers s
LEFT JOIN products p ON s.supplier_id = p.supplier_id
LEFT JOIN order_details od ON p.product_id = od.product_id
GROUP BY s.supplier_id, s.company_name, s.country
HAVING COUNT(od.order_id) = 0;`),
    sample('northwind-13', 'Employee Reporting Lines', 'Displays employees beside their direct managers using a self join.', `SELECT e.employee_id,
       e.first_name || ' ' || e.last_name AS employee,
       m.first_name || ' ' || m.last_name AS manager,
       e.title
FROM employees e
LEFT JOIN employees m ON e.reports_to = m.employee_id
ORDER BY manager, employee;`),
    sample('northwind-14', 'Products Near Stockout', 'Lists active products with the lowest remaining stock.', `SELECT p.product_name, c.category_name, s.company_name AS supplier, p.units_in_stock FROM products p JOIN categories c ON p.category_id = c.category_id LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id WHERE p.discontinued = 0 ORDER BY p.units_in_stock, p.product_name LIMIT 20;`),
    sample('northwind-15', 'Customer Order Cadence', 'Measures the average time between each customer orders.', `WITH gaps AS (SELECT customer_id, order_date, julianday(order_date) - julianday(LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date)) AS gap_days FROM orders) SELECT c.company_name, ROUND(AVG(g.gap_days), 1) AS avg_days_between_orders FROM gaps g JOIN customers c ON g.customer_id = c.customer_id GROUP BY g.customer_id, c.company_name ORDER BY avg_days_between_orders;`),
    sample('northwind-16', 'Category Sales Mix', 'Calculates revenue and unit volume for every product category.', `SELECT c.category_name, SUM(od.quantity) AS units, ROUND(SUM(od.unit_price * od.quantity * (1 - od.discount)), 2) AS revenue FROM categories c JOIN products p ON c.category_id = p.category_id JOIN order_details od ON p.product_id = od.product_id GROUP BY c.category_id, c.category_name ORDER BY revenue DESC;`),
    sample('northwind-17', 'Freight Cost Leaders', 'Ranks customers by freight charges across their orders.', `SELECT c.company_name, COUNT(o.order_id) AS orders, ROUND(SUM(o.freight), 2) AS freight, ROUND(AVG(o.freight), 2) AS avg_freight FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.company_name ORDER BY freight DESC;`),
    sample('northwind-18', 'Employee Sales Ranking', 'Ranks employees by net sales value.', `SELECT e.first_name || ' ' || e.last_name AS employee, ROUND(SUM(od.unit_price * od.quantity * (1 - od.discount)), 2) AS sales, DENSE_RANK() OVER (ORDER BY SUM(od.unit_price * od.quantity * (1 - od.discount)) DESC) AS sales_rank FROM employees e JOIN orders o ON e.employee_id = o.employee_id JOIN order_details od ON o.order_id = od.order_id GROUP BY e.employee_id, employee;`),
    sample('northwind-19', 'Discontinued Product Demand', 'Shows whether discontinued products still account for meaningful order volume.', `SELECT p.product_name, SUM(od.quantity) AS units_ordered, ROUND(SUM(od.unit_price * od.quantity), 2) AS gross_sales FROM products p JOIN order_details od ON p.product_id = od.product_id WHERE p.discontinued = 1 GROUP BY p.product_id, p.product_name ORDER BY units_ordered DESC;`),
    sample('northwind-20', 'Country Product Preferences', 'Finds the best selling category in each shipping country.', `WITH sales AS (SELECT o.ship_country, c.category_name, SUM(od.quantity) AS units FROM orders o JOIN order_details od ON o.order_id = od.order_id JOIN products p ON od.product_id = p.product_id JOIN categories c ON p.category_id = c.category_id GROUP BY o.ship_country, c.category_name), ranked AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY ship_country ORDER BY units DESC) AS position FROM sales) SELECT ship_country, category_name, units FROM ranked WHERE position = 1 ORDER BY ship_country;`),
];
