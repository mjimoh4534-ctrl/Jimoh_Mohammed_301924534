-- Show related dispense, inventory, medication, patient records (up to 20).
SELECT t0."dispense_id" AS "dispense_dispense_id",
       t0."dispensed_at" AS "dispense_dispensed_at",
       t1."inventory_id" AS "inventory_inventory_id",
       t1."lot_code" AS "inventory_lot_code",
       t2."medication_id" AS "medication_medication_id",
       t2."generic_name" AS "medication_generic_name",
       t3."patient_id" AS "patient_patient_id",
       t3."patient_ref" AS "patient_patient_ref"
FROM portfolio."dispense" t0
JOIN portfolio."inventory" t1 ON t0."inventory_id" = t1."inventory_id"
JOIN portfolio."medication" t2 ON t1."medication_id" = t2."medication_id"
JOIN portfolio."patient" t3 ON t0."patient_id" = t3."patient_id"
ORDER BY t0."dispense_id", t1."inventory_id", t2."medication_id", t3."patient_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT t0."dispense_id" AS "dispense_dispense_id",
       t0."dispensed_at" AS "dispense_dispensed_at",
       t1."inventory_id" AS "inventory_inventory_id",
       t1."lot_code" AS "inventory_lot_code",
       t2."medication_id" AS "medication_medication_id",
       t2."generic_name" AS "medication_generic_name",
       t3."patient_id" AS "patient_patient_id",
       t3."patient_ref" AS "patient_patient_ref"
FROM portfolio."dispense" t0
JOIN portfolio."inventory" t1 ON t0."inventory_id" = t1."inventory_id"
JOIN portfolio."medication" t2 ON t1."medication_id" = t2."medication_id"
JOIN portfolio."patient" t3 ON t0."patient_id" = t3."patient_id"
ORDER BY t0."dispense_id", t1."inventory_id", t2."medication_id", t3."patient_id"
LIMIT 20;

-- Find inventory records where expiry_date matches "2027-06-30" (up to 20).
SELECT * FROM portfolio."inventory"
WHERE "expiry_date" IS NOT DISTINCT FROM '2027-06-30'
ORDER BY "inventory_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT * FROM portfolio."inventory"
WHERE "expiry_date" IS NOT DISTINCT FROM '2027-06-30'
ORDER BY "inventory_id"
LIMIT 20;

-- Count dispense records for each inventory_id (up to 20 groups).
SELECT "inventory_id", count(*) AS record_count
FROM portfolio."dispense"
GROUP BY "inventory_id"
ORDER BY record_count DESC, "inventory_id" NULLS LAST
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT "inventory_id", count(*) AS record_count
FROM portfolio."dispense"
GROUP BY "inventory_id"
ORDER BY record_count DESC, "inventory_id" NULLS LAST
LIMIT 20;
