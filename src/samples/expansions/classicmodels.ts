import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const classicmodelsExpansion: SampleQuery[] = [
  sample('classicmodels-11', 'Product Margin Potential', 'Compares list price with buy price to identify high-margin products.', `SELECT product_name, product_line, buy_price, msrp,
       ROUND(msrp - buy_price, 2) AS unit_margin,
       ROUND((msrp - buy_price) * 100.0 / msrp, 1) AS margin_pct
FROM products
WHERE msrp > 0
ORDER BY margin_pct DESC
LIMIT 20;`),
    sample('classicmodels-12', 'Customer Balance Estimate', 'Compares customer payments with the value of their placed orders.', `WITH order_totals AS (
    SELECT o.customer_number, SUM(od.quantity_ordered * od.price_each) AS ordered_value
    FROM orders o JOIN order_details od ON o.order_number = od.order_number
    GROUP BY o.customer_number
), payment_totals AS (
    SELECT customer_number, SUM(amount) AS paid_value FROM payments GROUP BY customer_number
)
SELECT c.customer_name, ROUND(ot.ordered_value, 2) AS ordered_value,
       ROUND(COALESCE(pt.paid_value, 0), 2) AS paid_value,
       ROUND(ot.ordered_value - COALESCE(pt.paid_value, 0), 2) AS balance
FROM customers c JOIN order_totals ot ON c.customer_number = ot.customer_number
LEFT JOIN payment_totals pt ON c.customer_number = pt.customer_number
ORDER BY balance DESC;`),
    sample('classicmodels-13', 'Sales Team Customer Books', 'Counts customers and credit exposure assigned to each sales representative.', `SELECT e.first_name || ' ' || e.last_name AS sales_rep, o.city AS office,
       COUNT(c.customer_number) AS customers, ROUND(SUM(c.credit_limit), 2) AS credit_limit_total
FROM employees e
JOIN offices o ON e.office_code = o.office_code
LEFT JOIN customers c ON e.employee_number = c.sales_rep_employee_number
GROUP BY e.employee_number, sales_rep, o.city
ORDER BY customers DESC;`),
    ...profileSamples({ key: 'classicmodels', table: 'products', subject: 'products', value: 'msrp', valueLabel: 'List Prices', category: 'product_line', categoryLabel: 'Product Line', id: 'product_code' })
];
