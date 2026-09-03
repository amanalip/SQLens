import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const libraryExpansion: SampleQuery[] = [
  sample('library-11', 'Book Inventory Utilization', 'Shows how much of each title inventory is currently checked out.', `SELECT b.title, b.total_copies, b.available_copies,
       b.total_copies - b.available_copies AS checked_out,
       ROUND(100.0 * (b.total_copies - b.available_copies) / NULLIF(b.total_copies, 0), 1) AS utilization_pct
FROM books b
ORDER BY utilization_pct DESC, b.title;`),
    sample('library-12', 'Members With Unpaid Fines', 'Totals outstanding fines for members with unpaid balances.', `SELECT m.first_name || ' ' || m.last_name AS member, m.membership_type,
       COUNT(f.fine_id) AS unpaid_fines, ROUND(SUM(f.amount), 2) AS amount_due
FROM members m
JOIN loans l ON m.member_id = l.member_id
JOIN fines f ON l.loan_id = f.loan_id
WHERE f.is_paid = 0
GROUP BY m.member_id, member, m.membership_type
ORDER BY amount_due DESC;`),
    sample('library-13', 'Authors Across Genres', 'Finds authors whose catalog spans more than one genre.', `SELECT a.name AS author, COUNT(DISTINCT b.genre_id) AS genres,
       COUNT(b.book_id) AS books, SUM(b.total_copies) AS copies
FROM authors a JOIN books b ON a.author_id = b.author_id
GROUP BY a.author_id, a.name
HAVING COUNT(DISTINCT b.genre_id) > 1
ORDER BY genres DESC, books DESC;`),
    ...profileSamples({ key: 'library', table: 'books', subject: 'books', value: 'total_copies', valueLabel: 'Copy Counts', category: 'genre_id', categoryLabel: 'Genre', id: 'book_id' })
];
