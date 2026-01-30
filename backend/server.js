const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

// Routes

// List all states
app.get('/api/states', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM states ORDER BY code ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get specific state by ID (code)
app.get('/api/states/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM states WHERE code = ?', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'State not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get record counts for a state
app.get('/api/states/:id/counts', async (req, res) => {
    try {
        const { id } = req.params; // This is the state CODE (1-60)

        // We need internal state ID
        const stateResult = await db.query('SELECT id FROM states WHERE code = ?', [id]);
        if (stateResult.rows.length === 0) return res.status(404).json({ error: 'State not found' });
        const internalStateId = stateResult.rows[0].id;

        // Query: Join file_types with records to get count per type
        // Use LEFT JOIN ensures we get 0 for types with no records if we grouped by file_types.
        // But simpler: just group records by file_type_id and map manually or join.
        // Let's do a LEFT JOIN from file_types to records
        const query = `
            SELECT f.name, COUNT(r.id) as count
            FROM file_types f
            LEFT JOIN records r ON f.id = r.file_type_id AND r.state_id = ?
            GROUP BY f.name
        `;

        const result = await db.query(query, [internalStateId]);

        // Convert array to object for easier lookup { surgery: 5, ivf: 0 }
        const counts = result.rows.reduce((acc, row) => {
            acc[row.name] = row.count;
            return acc;
        }, {});

        res.json(counts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// List records for a state and file type
app.get('/api/states/:stateId/files/:fileTypeId/records', async (req, res) => {
    try {
        const { stateId, fileTypeId } = req.params;

        const typeResult = await db.query('SELECT id FROM file_types WHERE name = ?', [fileTypeId]);
        if (typeResult.rows.length === 0) {
            return res.status(404).json({ error: 'File type not found' });
        }
        const actualFileTypeId = typeResult.rows[0].id;

        const result = await db.query(
            'SELECT * FROM records WHERE state_id = (SELECT id FROM states WHERE code = ?) AND file_type_id = ? ORDER BY treatment_date DESC',
            [stateId, actualFileTypeId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a new record
app.post('/api/records', async (req, res) => {
    try {
        const { employeeName, postalAccount, amount, treatmentDate, stateId, fileType, status, notes } = req.body;

        // Get internal IDs
        const stateResult = await db.query('SELECT id FROM states WHERE code = ?', [stateId]);
        if (stateResult.rows.length === 0) return res.status(404).json({ error: 'State not found' });
        const internalStateId = stateResult.rows[0].id;

        const typeResult = await db.query('SELECT id FROM file_types WHERE name = ?', [fileType]);
        if (typeResult.rows.length === 0) return res.status(404).json({ error: 'File type not found' });
        const internalFileTypeId = typeResult.rows[0].id;

        const recordStatus = status || 'completed';
        const recordNotes = notes || '';

        const result = await db.query(
            'INSERT INTO records (state_id, file_type_id, employee_name, postal_account, amount, treatment_date, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [internalStateId, internalFileTypeId, employeeName, postalAccount, amount, treatmentDate, recordStatus, recordNotes]
        );

        res.json({ message: 'Record added successfully', id: result.lastID });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update a record
app.put('/api/records/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { employeeName, postalAccount, amount, treatmentDate, status, notes } = req.body;

        const recordStatus = status || 'completed';
        const recordNotes = notes || '';

        await db.query(
            'UPDATE records SET employee_name = ?, postal_account = ?, amount = ?, treatment_date = ?, status = ?, notes = ? WHERE id = ?',
            [employeeName, postalAccount, amount, treatmentDate, recordStatus, recordNotes, id]
        );

        res.json({ message: 'Record updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a record
app.delete('/api/records/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM records WHERE id = ?', [id]);
        res.json({ message: 'Record deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Export CSV
app.get('/api/export', async (req, res) => {
    try {
        const { stateId, fileType } = req.query;
        let query = `
            SELECT r.*, s.name as state_name, f.display_name as file_type_name 
            FROM records r
            JOIN states s ON r.state_id = s.id
            JOIN file_types f ON r.file_type_id = f.id
            WHERE 1=1
        `;
        const params = [];

        if (stateId) {
            query += ` AND s.code = ?`;
            params.push(stateId);
        }

        if (fileType) {
            query += ` AND f.name = ?`;
            params.push(fileType);
        }

        query += ` ORDER BY r.treatment_date DESC`;

        const result = await db.query(query, params);

        // Manual CSV Generation
        const headers = ['ID', 'State', 'File Type', 'Employee Name', 'CCP', 'Amount', 'Date', 'Status', 'Notes'];
        const rows = result.rows.map(row => [
            row.id,
            row.state_name,
            row.file_type_name,
            `"${row.employee_name}"`,
            row.postal_account,
            row.amount,
            new Date(row.treatment_date).toISOString(),
            row.status || 'completed',
            `"${(row.notes || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename="health_records_export.csv"');
        res.send(csvContent);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
