import { SampleQuery } from './chinook';

export const northwindSamples: SampleQuery[] = [
  {
    id: 'northwind-1',
    name: 'Products and Supplier Details',
    description: 'Retrieves stock values and product categories with multi-table left joins.',
    sql: `SELECT
    p.product_name,
    c.category_name,
    s.company_name AS supplier,
    p.unit_price,
    p.units_in_stock,
    ROUND(p.unit_price * p.units_in_stock, 2) AS inventory_value
FROM products p
LEFT JOIN categories c ON p.category_id = c.category_id
LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
WHERE p.discontinued = 0
ORDER BY inventory_value DESC;`,
  },
  {
    id: 'northwind-2',
    name: 'Order Totals by Employee',
    description: 'Calculates total freight costs and order volume handled per sales representative.',
    sql: `SELECT
    e.first_name || ' ' || e.last_name AS employee_name,
    e.title,
    COUNT(o.order_id) AS total_orders_handled,
    ROUND(SUM(o.freight), 2) AS total_freight_billed
FROM employees e
INNER JOIN orders o ON e.employee_id = o.employee_id
GROUP BY e.employee_id, e.first_name, e.last_name, e.title
ORDER BY total_orders_handled DESC;`,
  },
  {
    id: 'northwind-3',
    name: 'Products Above Category Average',
    description: 'Finds products priced higher than the average price in their respective category.',
    sql: `SELECT
    p1.product_name,
    p1.category_id,
    p1.unit_price
FROM products p1
WHERE p1.unit_price > (
    SELECT AVG(p2.unit_price)
    FROM products p2
    WHERE p2.category_id = p1.category_id
)
ORDER BY p1.unit_price DESC;`,
  },
  {
    id: 'northwind-4',
    name: 'Order Details Summary CTE',
    description: 'Aggregates item quantities per order before joining customer information.',
    sql: `WITH order_summary AS (
    SELECT
        order_id,
        COUNT(product_id) AS unique_items,
        SUM(quantity) AS total_quantity,
        ROUND(SUM(unit_price * quantity * (1 - discount)), 2) AS subtotal
    FROM order_details
    GROUP BY order_id
)
SELECT
    o.order_id,
    c.company_name AS customer,
    o.order_date,
    os.unique_items,
    os.total_quantity,
    os.subtotal
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN order_summary os ON o.order_id = os.order_id
ORDER BY os.subtotal DESC;`,
  },
];
