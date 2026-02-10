-- Backfill Serial Numbers for Legacy Records
-- Scoped by State and File Type
-- ordered by treatment_date ASC

DO $$
DECLARE
    rec RECORD;
    counter INTEGER;
BEGIN
    -- Loop through each State + File Type combination
    FOR rec IN 
        SELECT DISTINCT state_id, file_type_id 
        FROM records
    LOOP
        counter := 0;
        
        -- Update records within this scope
        -- We use a CTE or a temporary update approach
        -- Actually, a simple UPDATE with FROM / OVER partioning is cleaner but let's be explicit
        
        UPDATE records r
        SET serial_number = sub.new_serial
        FROM (
            SELECT id, 
                   ROW_NUMBER() OVER (
                       PARTITION BY state_id, file_type_id 
                       ORDER BY treatment_date ASC, created_at ASC, id ASC
                   ) as new_serial
            FROM records
            WHERE state_id = rec.state_id AND file_type_id = rec.file_type_id
        ) sub
        WHERE r.id = sub.id
          AND (r.serial_number IS NULL OR r.serial_number = 0); -- Only update missing ones? 
          -- Actually user wants consistency. Let's re-serialize ALL to be safe/sequential?
          -- User said "if i have 16 records before , the new record is number 17".
          -- Re-serializing ensures 1..16 are clean.
          
    END LOOP;
END $$;

-- Simpler Global Approach compatible with all Postgres versions
WITH Serialized AS (
    SELECT id, 
           ROW_NUMBER() OVER (
               PARTITION BY state_id, file_type_id 
               ORDER BY treatment_date ASC, created_at ASC, id ASC
           ) as new_serial
    FROM records
)
UPDATE records
SET serial_number = Serialized.new_serial
FROM Serialized
WHERE records.id = Serialized.id;
