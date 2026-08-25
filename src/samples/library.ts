import { SampleQuery } from './types';

export const librarySamples: SampleQuery[] = [
  {
    "id": "library-1",
    "name": "Most Borrowed Books",
    "description": "Calculates checkout counts and availability across book inventory.",
    "sql": "SELECT\n    b.title,\n    a.name AS author_name,\n    g.genre_name,\n    b.total_copies,\n    b.available_copies,\n    COUNT(l.loan_id) AS total_checkouts\nFROM books b\nINNER JOIN authors a ON b.author_id = a.author_id\nINNER JOIN genres g ON b.genre_id = g.genre_id\nLEFT JOIN loans l ON b.book_id = l.book_id\nGROUP BY b.book_id, b.title, a.name, g.genre_name, b.total_copies, b.available_copies\nORDER BY total_checkouts DESC;"
  },
  {
    "id": "library-2",
    "name": "Member Loans and Fine Balances",
    "description": "Aggregates active loans and outstanding fines per library member.",
    "sql": "SELECT\n    m.first_name || ' ' || m.last_name AS member_name,\n    m.email,\n    m.membership_type,\n    COUNT(DISTINCT l.loan_id) AS total_loans,\n    ROUND(SUM(f.amount), 2) AS total_fines\nFROM members m\nLEFT JOIN loans l ON m.member_id = l.member_id\nLEFT JOIN fines f ON l.loan_id = f.loan_id\nGROUP BY m.member_id, m.first_name, m.last_name, m.email, m.membership_type\nORDER BY total_loans DESC;"
  },
  {
    "id": "library-3",
    "name": "Unpaid Overdue Fines Above Average",
    "description": "Finds unpaid fines that exceed average penalty values.",
    "sql": "SELECT\n    f.fine_id,\n    m.first_name || ' ' || m.last_name AS member_name,\n    b.title AS book_title,\n    f.amount\nFROM fines f\nINNER JOIN loans l ON f.loan_id = l.loan_id\nINNER JOIN members m ON l.member_id = m.member_id\nINNER JOIN books b ON l.book_id = b.book_id\nWHERE f.is_paid = 0\n  AND f.amount > (SELECT AVG(amount) FROM fines)\nORDER BY f.amount DESC;"
  },
  {
    "id": "library-4",
    "name": "Genre Circulation CTE",
    "description": "Summarizes book catalog counts and circulation activity per genre.",
    "sql": "WITH genre_stats AS (\n    SELECT\n        g.genre_name,\n        COUNT(DISTINCT b.book_id) AS catalog_size,\n        COUNT(l.loan_id) AS loan_count\n    FROM genres g\n    LEFT JOIN books b ON g.genre_id = b.genre_id\n    LEFT JOIN loans l ON b.book_id = l.book_id\n    GROUP BY g.genre_id, g.genre_name\n)\nSELECT\n    genre_name,\n    catalog_size,\n    loan_count,\n    ROUND(loan_count * 1.0 / NULLIF(catalog_size, 0), 2) AS checkout_turnover_ratio\nFROM genre_stats\nORDER BY loan_count DESC;"
  },
  {
    "id": "library-5",
    "name": "Book Publication Year Ranking by Genre",
    "description": "Ranks books by published year within each genre.",
    "sql": "SELECT\n    genre_id,\n    title,\n    published_year,\n    RANK() OVER (PARTITION BY genre_id ORDER BY published_year DESC) AS publication_rank\nFROM books\nLIMIT 30;"
  },
  {
    "id": "library-6",
    "name": "Author Catalog Inventory Summary",
    "description": "Summarizes author publications and nationality demographics.",
    "sql": "SELECT\n    a.name AS author_name,\n    a.nationality,\n    COUNT(b.book_id) AS authored_books,\n    SUM(b.total_copies) AS total_inventory_copies\nFROM authors a\nLEFT JOIN books b ON a.author_id = b.author_id\nGROUP BY a.author_id, a.name, a.nationality\nORDER BY authored_books DESC;"
  },
  {
    "id": "library-7",
    "name": "Cumulative Loans per Member",
    "description": "Calculates running loan count per member ordered chronologically.",
    "sql": "SELECT\n    member_id,\n    loan_date,\n    book_id,\n    COUNT(loan_id) OVER (PARTITION BY member_id ORDER BY loan_date) AS running_member_loans\nFROM loans\nLIMIT 25;"
  },
  {
    "id": "library-8",
    "name": "Insert New Member (Add Data)",
    "description": "Registers a new library patron membership.",
    "sql": "INSERT INTO members (member_id, first_name, last_name, email, membership_type, join_date)\nVALUES (9901, 'Julian', 'Vance', 'julian.vance@example.org', 'Premium', '2024-02-15');"
  },
  {
    "id": "library-9",
    "name": "Update Book Copies (Modify Data)",
    "description": "Increases available copies for popular book titles.",
    "sql": "UPDATE books\nSET available_copies = available_copies + 2\nWHERE book_id = 1;"
  },
  {
    "id": "library-10",
    "name": "Delete Test Member (Remove Data)",
    "description": "Removes the test member registration.",
    "sql": "DELETE FROM members\nWHERE member_id = 9901;"
  }
];
