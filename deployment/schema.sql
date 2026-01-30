-- Create tables for Health Files Management System

CREATE TABLE IF NOT EXISTS states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code INTEGER UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS file_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- 'Surgery', 'IVF', 'Eye', 'Labs'
    display_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS records (
    id SERIAL PRIMARY KEY,
    state_id INTEGER REFERENCES states(id) ON DELETE CASCADE,
    file_type_id INTEGER REFERENCES file_types(id) ON DELETE CASCADE,
    employee_name VARCHAR(255) NOT NULL,
    postal_account VARCHAR(50),
    amount DECIMAL(15, 2) NOT NULL, -- Currency
    treatment_date TIMESTAMP WITH TIME ZONE NOT NULL, -- Stored in UTC
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for searching and filtering
CREATE INDEX idx_records_state_file ON records(state_id, file_type_id);
CREATE INDEX idx_records_treatment_date ON records(treatment_date);
CREATE INDEX idx_records_employee_name ON records(employee_name);
