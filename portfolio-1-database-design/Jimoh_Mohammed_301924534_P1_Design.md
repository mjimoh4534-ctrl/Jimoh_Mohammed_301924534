# Pharmacy Inventory & Dispensing System — database design

My case study records medication, pharmacy, inventory, patient, dispense.

## Users

- Pharmacy inventory staff
- Dispensing pharmacists
- Database students

## Main operations

- Maintain pharmacy, medication, and lot-level stock records
- Find stock by expiry date and reorder level
- Record dispensing and summarize quantities dispensed

## Entities

| Entity | Information stored |
| --- | --- |
| medication | Medication catalogue. |
| pharmacy | Pharmacy locations holding stock. |
| inventory | Lot-level medication stock at a pharmacy. |
| patient | Synthetic patient references for dispensing records. |
| dispense | Recorded medication dispensing events. |

## medication

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| medication_id | BIGINT | PK | Yes |
| generic_name | TEXT |  | Yes |
| strength | TEXT |  | Yes |
| dosage_form | TEXT |  | Yes |
| active | BOOLEAN |  | Yes |
- Unique key: (generic_name, strength, dosage_form).

## pharmacy

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| pharmacy_id | BIGINT | PK | Yes |
| pharmacy_name | TEXT |  | Yes |
| license_code | TEXT | Unique | Yes |
| active | BOOLEAN |  | Yes |
- Unique key: (license_code).

## inventory

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| inventory_id | BIGINT | PK | Yes |
| pharmacy_id | BIGINT | FK | Yes |
| medication_id | BIGINT | FK | Yes |
| lot_code | TEXT |  | Yes |
| expiry_date | DATE |  | Yes |
| quantity_on_hand | INTEGER |  | Yes |
| reorder_level | INTEGER |  | Yes |
- pharmacy_id → pharmacy.pharmacy_id
- medication_id → medication.medication_id
- Unique key: (pharmacy_id, medication_id, lot_code).

## patient

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| patient_id | BIGINT | PK | Yes |
| patient_ref | TEXT | Unique | Yes |
| active | BOOLEAN |  | Yes |
- Unique key: (patient_ref).

## dispense

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| dispense_id | BIGINT | PK | Yes |
| inventory_id | BIGINT | FK | Yes |
| patient_id | BIGINT | FK | Yes |
| dispensed_at | TIMESTAMPTZ |  | Yes |
| quantity | INTEGER |  | Yes |
| prescription_ref | TEXT |  | Yes |
- inventory_id → inventory.inventory_id
- patient_id → patient.patient_id

## Relationships and business rules

- Stock quantity on hand must be zero or greater.
- Each dispense record must have a quantity greater than zero.
- A pharmacy cannot store duplicate rows for the same medication lot.
- Each inventory row must reference an existing pharmacy through pharmacy_id.
- Each inventory row must reference an existing medication through medication_id.
- Each dispense record must reference an existing inventory row through inventory_id.
- Each dispense record must reference an existing patient through patient_id.

## Assumptions

- Worked normalization example: decompose an initial inventory row that repeats pharmacy name and license, medication name and strength, and lot and quantity into Pharmacy, Medication, and Inventory. Inventory is the foreign-key-bearing root, with one row per pharmacy, medication, and lot; pharmacy and medication attributes are stored only in their respective entities.
- Each entity has one single-column primary key. Synthetic ID values are allocated from disjoint ranges so primary-key values are globally unique across entities.
- A dispense record refers to one stock lot and one synthetic patient; the pharmacy is determined through that lot's Inventory row.
- A dispense may be recorded only when the selected lot has sufficient stock; its stock decrement and dispense record form one atomic transaction.
- Separate benchmark plan: generate 50000 synthetic Inventory rows and run the same expiry-date range filter before and after adding a B-tree index on expiry_date. Compare query plans and measured latency without assuming an outcome.

