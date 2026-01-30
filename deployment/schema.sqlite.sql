-- SQLite Schema

CREATE TABLE IF NOT EXISTS states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code INTEGER UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS file_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state_id INTEGER,
    file_type_id INTEGER,
    employee_name TEXT NOT NULL,
    postal_account TEXT,
    amount DECIMAL(15, 2) NOT NULL,
    treatment_date TEXT NOT NULL, -- ISO8601 String
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(state_id) REFERENCES states(id) ON DELETE CASCADE,
    FOREIGN KEY(file_type_id) REFERENCES file_types(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_records_state_file ON records(state_id, file_type_id);
CREATE INDEX IF NOT EXISTS idx_records_treatment_date ON records(treatment_date);
