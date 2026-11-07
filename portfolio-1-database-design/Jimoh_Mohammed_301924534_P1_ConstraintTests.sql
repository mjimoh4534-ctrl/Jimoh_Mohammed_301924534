-- Run these deliberately invalid statements one at a time, outside a transaction.
-- Each should fail at the named constraint; the sample rows should remain unchanged.

-- 1. medication pk. Expected: pk_medication, SQLSTATE 23505.
INSERT INTO portfolio."medication" ("medication_id", "generic_name", "strength", "dosage_form", "active")
VALUES (1001, 'doxycycline', '100 mg', 'capsule', TRUE);

-- 2. medication unique. Expected: uq_medication_0, SQLSTATE 23505.
INSERT INTO portfolio."medication" ("medication_id", "generic_name", "strength", "dosage_form", "active")
VALUES (1101, 'amoxicillin', '250 mg', 'capsule', TRUE);

-- 3. medication not null. Expected: active, SQLSTATE 23502.
INSERT INTO portfolio."medication" ("medication_id", "generic_name", "strength", "dosage_form", "active")
VALUES (1201, 'loratadine', '10 mg', 'tablet', NULL);

-- 4. pharmacy pk. Expected: pk_pharmacy, SQLSTATE 23505.
INSERT INTO portfolio."pharmacy" ("pharmacy_id", "pharmacy_name", "license_code", "active")
VALUES (2001, 'Birch Pharmacy', 'SYN-LIC-2201', TRUE);

-- 5. pharmacy unique. Expected: uq_pharmacy_0, SQLSTATE 23505.
INSERT INTO portfolio."pharmacy" ("pharmacy_id", "pharmacy_name", "license_code", "active")
VALUES (2101, 'Elm Pharmacy', 'SYN-LIC-2001', TRUE);

-- 6. inventory pk. Expected: pk_inventory, SQLSTATE 23505.
INSERT INTO portfolio."inventory" ("inventory_id", "pharmacy_id", "medication_id", "lot_code", "expiry_date", "quantity_on_hand", "reorder_level")
VALUES (3001, 2001, 1002, 'LOT-PK-01', '2027-10-31', 12, 3);

-- 7. inventory unique. Expected: uq_inventory_0, SQLSTATE 23505.
INSERT INTO portfolio."inventory" ("inventory_id", "pharmacy_id", "medication_id", "lot_code", "expiry_date", "quantity_on_hand", "reorder_level")
VALUES (3101, 2001, 1001, 'LOT-AMX-01', '2027-08-31', 15, 4);

-- 8. inventory pharmacy fk. Expected: fk_inventory_0, SQLSTATE 23503.
INSERT INTO portfolio."inventory" ("inventory_id", "pharmacy_id", "medication_id", "lot_code", "expiry_date", "quantity_on_hand", "reorder_level")
VALUES (3201, 2999, 1001, 'LOT-FK-PH-01', '2027-08-31', 15, 4);

-- 9. inventory medication fk. Expected: fk_inventory_1, SQLSTATE 23503.
INSERT INTO portfolio."inventory" ("inventory_id", "pharmacy_id", "medication_id", "lot_code", "expiry_date", "quantity_on_hand", "reorder_level")
VALUES (3301, 2001, 1999, 'LOT-FK-MED-01', '2027-08-31', 15, 4);

-- 10. inventory check. Expected: inventory_nonnegative, SQLSTATE 23514.
INSERT INTO portfolio."inventory" ("inventory_id", "pharmacy_id", "medication_id", "lot_code", "expiry_date", "quantity_on_hand", "reorder_level")
VALUES (3401, 2001, 1001, 'LOT-CHECK-01', '2027-08-31', -1, 4);

-- 11. patient pk. Expected: pk_patient, SQLSTATE 23505.
INSERT INTO portfolio."patient" ("patient_id", "patient_ref", "active")
VALUES (4001, 'SYN-PAT-003', TRUE);

-- 12. patient unique. Expected: uq_patient_0, SQLSTATE 23505.
INSERT INTO portfolio."patient" ("patient_id", "patient_ref", "active")
VALUES (4101, 'SYN-PAT-001', TRUE);

-- 13. dispense pk. Expected: pk_dispense, SQLSTATE 23505.
INSERT INTO portfolio."dispense" ("dispense_id", "inventory_id", "patient_id", "dispensed_at", "quantity", "prescription_ref")
VALUES (5001, 3001, 4001, '2026-11-03T08:00:00Z', 3, 'SYN-RX-003');

-- 14. dispense inventory fk. Expected: fk_dispense_0, SQLSTATE 23503.
INSERT INTO portfolio."dispense" ("dispense_id", "inventory_id", "patient_id", "dispensed_at", "quantity", "prescription_ref")
VALUES (5101, 3999, 4001, '2026-11-03T08:00:00Z', 3, 'SYN-RX-004');

-- 15. dispense patient fk. Expected: fk_dispense_1, SQLSTATE 23503.
INSERT INTO portfolio."dispense" ("dispense_id", "inventory_id", "patient_id", "dispensed_at", "quantity", "prescription_ref")
VALUES (5201, 3001, 4999, '2026-11-03T08:00:00Z', 3, 'SYN-RX-005');

-- 16. dispense check. Expected: dispense_positive_quantity, SQLSTATE 23514.
INSERT INTO portfolio."dispense" ("dispense_id", "inventory_id", "patient_id", "dispensed_at", "quantity", "prescription_ref")
VALUES (5301, 3001, 4001, '2026-11-03T08:00:00Z', 0, 'SYN-RX-006');
