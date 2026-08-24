import { SampleQuery } from './chinook';

export const classicmodelsSamples: SampleQuery[] = [
  {
    id: 'cm-1',
    name: 'Customer Orders and Assigned Sales Rep',
    description: 'Retrieves customer orders with employee details and order statuses.',
    sql: `SELECT
    c.customer_name,
    c.country,
    e.first_name || ' ' || e.last_name AS sales_rep,
    o.order_number,
    o.order_date,
    o.status
FROM customers c
INNER JOIN employees e ON c.sales_rep_employee_number = e.employee_number
INNER JOIN orders o ON c.customer_number = o.customer_number
ORDER BY o.order_date DESC;`,
  },
  {
    id: 'cm-2',
    name: 'Revenue and Units Sold by Product Line',
    description: 'Aggregates sales amounts and quantities across product lines.',
    sql: `SELECT
    pl.product_line,
    COUNT(DISTINCT p.product_code) AS product_count,
    SUM(od.quantity_ordered) AS total_units_sold,
    ROUND(SUM(od.quantity_ordered * od.price_each), 2) AS total_revenue
FROM product_lines pl
INNER JOIN products p ON pl.product_line = p.product_line
INNER JOIN order_details od ON p.product_code = od.product_code
GROUP BY pl.product_line
ORDER BY total_revenue DESC;`,
  },
  {
    id: 'cm-3',
    name: 'Customer Payment Balances CTE',
    description: 'Compares total billed orders against total payments received per customer.',
    sql: `WITH billed_totals AS (
    SELECT
        o.customer_number,
        ROUND(SUM(od.quantity_ordered * od.price_each), 2) AS total_billed
    FROM orders o
    INNER JOIN order_details od ON o.order_number = od.order_number
    GROUP BY o.customer_number
),
payment_totals AS (
    SELECT
        customer_number,
        ROUND(SUM(amount), 2) AS total_paid
    FROM payments
    GROUP BY customer_number
)
SELECT
    c.customer_name,
    c.country,
    bt.total_billed,
    COALESCE(pt.total_paid, 0.00) AS total_paid,
    ROUND(bt.total_billed - COALESCE(pt.total_paid, 0.00), 2) AS balance_due
FROM customers c
INNER JOIN billed_totals bt ON c.customer_number = bt.customer_number
LEFT JOIN payment_totals pt ON c.customer_number = pt.customer_number
ORDER BY balance_due DESC;`,
  },
];
