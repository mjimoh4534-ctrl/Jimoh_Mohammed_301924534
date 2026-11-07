# Pharmacy Inventory & Dispensing System — SQL queries

## 1. Show related dispense, inventory, medication, patient records (up to 20).

```sql
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
```

| dispense_dispense_id | dispense_dispensed_at | inventory_inventory_id | inventory_lot_code | medication_medication_id | medication_generic_name | patient_patient_id | patient_patient_ref |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 5001 | 2026-11-01T10:15:00+00:00 | 3001 | LOT-AMX-01 | 1001 | amoxicillin | 4001 | SYN-PAT-001 |
| 5002 | 2026-11-02T14:30:00+00:00 | 3002 | LOT-CTZ-01 | 1002 | cetirizine | 4002 | SYN-PAT-002 |

## 2. Find inventory records where expiry_date matches "2027-06-30" (up to 20).

```sql
SELECT * FROM portfolio."inventory"
WHERE "expiry_date" IS NOT DISTINCT FROM '2027-06-30'
ORDER BY "inventory_id"
LIMIT 20;
```

| inventory_id | pharmacy_id | medication_id | lot_code | expiry_date | quantity_on_hand | reorder_level |
| --- | --- | --- | --- | --- | --- | --- |
| 3001 | 2001 | 1001 | LOT-AMX-01 | 2027-06-30 | 40 | 10 |

## 3. Count dispense records for each inventory_id (up to 20 groups).

```sql
SELECT "inventory_id", count(*) AS record_count
FROM portfolio."dispense"
GROUP BY "inventory_id"
ORDER BY record_count DESC, "inventory_id" NULLS LAST
LIMIT 20;
```

| inventory_id | record_count |
| --- | --- |
| 3001 | 1 |
| 3002 | 1 |


## Index comparison

| Phase | Median (ms) | Three runs (ms) | Plan nodes | Buffer hits |
| --- | --- | --- | --- | --- |
| Before index | 2.229 | 2.229, 7.96, 2.223 | Sort → Seq Scan | 274 |
| After index | 0.264 | 0.257, 0.31, 0.264 | Sort → Bitmap Heap Scan → Bitmap Index Scan | 55 |

The median execution time changed from 2.229 ms to 0.264 ms. The measured plan used p2_filter_idx. The results matched in both phases. An index adds storage and write-maintenance costs; timings depend on the selected lookup and environment.

## Execution plans

### Before index, run 1

```text
Sort (actual time=2.198..2.201 rows=50 loops=1)
  Seq Scan on inventory (actual time=0.014..2.159 rows=50 loops=1)
Planning Time: 0.302 ms
Execution Time: 2.229 ms
```

### Before index, run 2

```text
Sort (actual time=7.909..7.913 rows=50 loops=1)
  Seq Scan on inventory (actual time=0.025..7.845 rows=50 loops=1)
Planning Time: 2.505 ms
Execution Time: 7.96 ms
```

### Before index, run 3

```text
Sort (actual time=2.191..2.194 rows=50 loops=1)
  Seq Scan on inventory (actual time=0.014..2.153 rows=50 loops=1)
Planning Time: 0.305 ms
Execution Time: 2.223 ms
```

### After index, run 1

```text
Sort (actual time=0.209..0.212 rows=50 loops=1)
  Bitmap Heap Scan on inventory (actual time=0.03..0.172 rows=50 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.014..0.014 rows=50 loops=1)
Planning Time: 0.532 ms
Execution Time: 0.257 ms
```

### After index, run 2

```text
Sort (actual time=0.262..0.264 rows=50 loops=1)
  Bitmap Heap Scan on inventory (actual time=0.029..0.224 rows=50 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.014..0.014 rows=50 loops=1)
Planning Time: 0.526 ms
Execution Time: 0.31 ms
```

### After index, run 3

```text
Sort (actual time=0.216..0.218 rows=50 loops=1)
  Bitmap Heap Scan on inventory (actual time=0.029..0.179 rows=50 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.014..0.014 rows=50 loops=1)
Planning Time: 0.508 ms
Execution Time: 0.264 ms
```

## Reproduce

Use a fresh database with the Portfolio 1 schema and sample data. Run Jimoh_Mohammed_301924534_P2_Queries.sql, then Jimoh_Mohammed_301924534_P2_Optimisation.sql. The optimisation script creates a separate performance table and runs EXPLAIN (ANALYZE, BUFFERS).

[Query screenshot](screenshots/Jimoh_Mohammed_301924534_P2_QueryResults.png) · [Index comparison](screenshots/Jimoh_Mohammed_301924534_P2_IndexComparison.png)

## References

- [PostgreSQL — EXPLAIN](https://www.postgresql.org/docs/17/using-explain.html)

