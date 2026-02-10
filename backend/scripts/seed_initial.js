const pool = require('../db');
const bcrypt = require('bcrypt');

const seed = async () => {
    try {
        console.log("🌱 Starting Seed Process...");

        // 1. Seed States (Wilayas) - Algerie 58 Wilayas
        const wilayas = [
            { code: '01', name: 'Adrar' }, { code: '02', name: 'Chlef' }, { code: '03', name: 'Laghouat' }, { code: '04', name: 'Oum El Bouaghi' },
            { code: '05', name: 'Batna' }, { code: '06', name: 'Béjaïa' }, { code: '07', name: 'Biskra' }, { code: '08', name: 'Béchar' },
            { code: '09', name: 'Blida' }, { code: '10', name: 'Bouira' }, { code: '11', name: 'Tamanrasset' }, { code: '12', name: 'Tébessa' },
            { code: '13', name: 'Tlemcen' }, { code: '14', name: 'Tiaret' }, { code: '15', name: 'Tizi Ouzou' }, { code: '16', name: 'Alger' },
            { code: '17', name: 'Djelfa' }, { code: '18', name: 'Jijel' }, { code: '19', name: 'Sétif' }, { code: '20', name: 'Saïda' },
            { code: '21', name: 'Skikda' }, { code: '22', name: 'Sidi Bel Abbès' }, { code: '23', name: 'Annaba' }, { code: '24', name: 'Guelma' },
            { code: '25', name: 'Constantine' }, { code: '26', name: 'Médéa' }, { code: '27', name: 'Mostaganem' }, { code: '28', name: 'M\'Sila' },
            { code: '29', name: 'Mascara' }, { code: '30', name: 'Ouargla' }, { code: '31', name: 'Oran' }, { code: '32', name: 'El Bayadh' },
            { code: '33', name: 'Illizi' }, { code: '34', name: 'Bordj Bou Arreridj' }, { code: '35', name: 'Boumerdès' }, { code: '36', name: 'El Tarf' },
            { code: '37', name: 'Tindouf' }, { code: '38', name: 'Tissemsilt' }, { code: '39', name: 'El Oued' }, { code: '40', name: 'Khenchela' },
            { code: '41', name: 'Souk Ahras' }, { code: '42', name: 'Tipaza' }, { code: '43', name: 'Mila' }, { code: '44', name: 'Aïn Defla' },
            { code: '45', name: 'Naâma' }, { code: '46', name: 'Aïn Témouchent' }, { code: '47', name: 'Ghardaïa' }, { code: '48', name: 'Relizane' },
            { code: '49', name: 'Timimoun' }, { code: '50', name: 'Bordj Badji Mokhtar' }, { code: '51', name: 'Ouled Djellal' }, { code: '52', name: 'Béni Abbès' },
            { code: '53', name: 'In Salah' }, { code: '54', name: 'In Guezzam' }, { code: '55', name: 'Touggourt' }, { code: '56', name: 'Djanet' },
            { code: '57', name: 'El M\'Ghair' }, { code: '58', name: 'El Meniaa' }
        ];

        console.log("Inserting States...");
        for (const w of wilayas) {
            try {
                // Ensure code is integer
                await pool.query('INSERT INTO states (code, name) VALUES ($1, $2) ON CONFLICT (code) DO NOTHING', [parseInt(w.code), w.name]);
            } catch (innerErr) {
                console.error(`❌ Failed to seed state ${w.name}:`, innerErr.message);
            }
        }
        console.log("✅ States Seeded");

        // 2. Seed File Types
        const fileTypes = ['Cram', 'Cnas', 'Casnos'];
        console.log("Inserting File Types...");
        for (const f of fileTypes) {
            try {
                await pool.query('INSERT INTO file_types (name, display_name) VALUES ($1, $1) ON CONFLICT (name) DO NOTHING', [f]);
            } catch (innerErr) {
                // Try without display_name if that column doesn't exist? 
                // Schema said created with display_name.
                console.error(`❌ Failed to seed fileType ${f}:`, innerErr.message);
            }
        }
        console.log("✅ File Types Seeded");

        // 3. Seed Users (Admin & Employee)
        const salt = await bcrypt.genSalt(10);

        console.log("Inserting Users...");

        // Admin
        try {
            const adminPass = await bcrypt.hash('admin123', salt);
            await pool.query(`
                INSERT INTO users (username, password_hash, role, visible_password) 
                VALUES ('admin', $1, 'admin', 'admin123') 
                ON CONFLICT (username) DO NOTHING
            `, [adminPass]);
        } catch (err) { console.error("Admin Seed Error", err.message); }

        // Employee (Abdelkarim)
        try {
            const empPass = await bcrypt.hash('123456', salt);
            await pool.query(`
                INSERT INTO users (username, password_hash, role, visible_password) 
                VALUES ('Abdelkarim', $1, 'user', '123456') 
                ON CONFLICT (username) DO NOTHING
            `, [empPass]);
        } catch (err) { console.error("Abdelkarim Seed Error", err.message); }

        console.log("✅ Users Seeded (admin / Abdelkarim - Preserved if exists)");

        console.log("🎉 Seeding Complete!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Global Seeding Failed:", err);
        process.exit(1);
    }
};

seed();
