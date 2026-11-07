# Pharmacy Inventory & Dispensing System — normalisation

The example uses the saved sample records. The full set of fields is in the design and schema.

## Starting grouped records

| inventory_id | dispense records (list) |
| --- | --- |
| 3001 | [5001] |
| 3002 | [5002] |


The record IDs are grouped in a list. In 1NF, each record has its own row and each cell holds one value.

## 1NF: one value per cell

| dispense.dispense_id | dispense.inventory_id | dispense.patient_id | dispense.prescription_ref | inventory.inventory_id | inventory.pharmacy_id | inventory.medication_id | inventory.lot_code |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 5001 | 3001 | 4001 | SYN-RX-001 | 3001 | 2001 | 1001 | LOT-AMX-01 |
| 5002 | 3002 | 4002 | SYN-RX-002 | 3002 | 2002 | 1002 | LOT-CTZ-01 |

Key: dispense_id.

## 2NF: depend on the whole key

The declared candidate keys do not introduce a partial dependency here, so the 1NF rows stay unchanged at this step.

## dispense_example

| dispense.dispense_id | dispense.inventory_id | dispense.patient_id | dispense.prescription_ref | inventory.inventory_id | inventory.pharmacy_id | inventory.medication_id | inventory.lot_code |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 5001 | 3001 | 4001 | SYN-RX-001 | 3001 | 2001 | 1001 | LOT-AMX-01 |
| 5002 | 3002 | 4002 | SYN-RX-002 | 3002 | 2002 | 1002 | LOT-CTZ-01 |

## 3NF: store each entity’s details once

The entity keys determine their own descriptions. Related records keep foreign keys rather than repeating those descriptions.

## medication

| medication_id | generic_name | strength | dosage_form | active |
| --- | --- | --- | --- | --- |
| 1001 | amoxicillin | 250 mg | capsule | true |
| 1002 | cetirizine | 10 mg | tablet | true |

## pharmacy

| pharmacy_id | pharmacy_name | license_code | active |
| --- | --- | --- | --- |
| 2001 | Maple Pharmacy | SYN-LIC-2001 | true |
| 2002 | Cedar Pharmacy | SYN-LIC-2002 | true |

## inventory

| inventory_id | pharmacy_id | medication_id | lot_code | expiry_date | quantity_on_hand | reorder_level |
| --- | --- | --- | --- | --- | --- | --- |
| 3001 | 2001 | 1001 | LOT-AMX-01 | 2027-06-30 | 40 | 10 |
| 3002 | 2002 | 1002 | LOT-CTZ-01 | 2027-09-30 | 25 | 5 |

## patient

| patient_id | patient_ref | active |
| --- | --- | --- |
| 4001 | SYN-PAT-001 | true |
| 4002 | SYN-PAT-002 | true |

## dispense

| dispense_id | inventory_id | patient_id | dispensed_at | quantity | prescription_ref |
| --- | --- | --- | --- | --- | --- |
| 5001 | 3001 | 4001 | 2026-11-01T10:15:00+00:00 | 2 | SYN-RX-001 |
| 5002 | 3002 | 4002 | 2026-11-02T14:30:00+00:00 | 1 | SYN-RX-002 |

## Dependencies

- medication: (medication_id) → generic_name, strength, dosage_form, active
- pharmacy: (pharmacy_id) → pharmacy_name, license_code, active
- inventory: (inventory_id) → pharmacy_id, medication_id, lot_code, expiry_date, quantity_on_hand, reorder_level
- patient: (patient_id) → patient_ref, active
- dispense: (dispense_id) → inventory_id, patient_id, dispensed_at, quantity, prescription_ref

Joining the decomposed sample tables reproduces the original 2 example rows. The design assumes the declared keys describe the relevant business dependencies.
