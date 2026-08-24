import { SampleQuery } from './chinook';

export const librarySamples: SampleQuery[] = [
  {
    id: 'lib-1',
    name: 'Active Book Loans and Member Contacts',
    description: 'Lists currently checked-out books with member information and due dates.',
    sql: `SELECT
    b.title,
    b.isbn,
    a.name AS author_name,
    m.first_name || ' ' || m.last_name AS member_name,
    m.email,
    l.loan_date,
    l.due_date
FROM loans l
INNER JOIN books b ON l.book_id = b.book_id
INNER JOIN authors a ON b.author_id = a.author_id
INNER JOIN members m ON l.member_id = m.member_id
WHERE l.return_date IS NULL
ORDER BY l.due_date ASC;`,
  },
  {
    id: 'lib-2',
    name: 'Popular Book Genres and Checkout Volumes',
    description: 'Computes loan counts and catalog sizes grouped by literary genre.',
    sql: `SELECT
    g.genre_name,
    COUNT(DISTINCT b.book_id) AS total_titles,
    COUNT(l.loan_id) AS total_loans,
    SUM(b.total_copies) AS total_inventory_copies
FROM genres g
INNER JOIN books b ON g.genre_id = b.genre_id
LEFT JOIN loans l ON b.book_id = l.book_id
GROUP BY g.genre_id, g.genre_name
ORDER BY total_loans DESC;`,
  },
  {
    id: 'lib-3',
    name: 'Overdue Fines and Member Balances CTE',
    description: 'Calculates outstanding library fines using a Common Table Expression.',
    sql: `WITH unpaid_fines AS (
    SELECT
        l.member_id,
        COUNT(f.fine_id) AS fine_count,
        ROUND(SUM(f.amount), 2) AS total_fines
    FROM fines f
    INNER JOIN loans l ON f.loan_id = l.loan_id
    WHERE f.is_paid = 0
    GROUP BY l.member_id
)
SELECT
    m.first_name || ' ' || m.last_name AS member_name,
    m.membership_type,
    COALESCE(uf.fine_count, 0) AS overdue_count,
    COALESCE(uf.total_fines, 0.00) AS outstanding_balance
FROM members m
INNER JOIN unpaid_fines uf ON m.member_id = uf.member_id
ORDER BY outstanding_balance DESC;`,
  },
];
