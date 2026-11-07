-- Fictional sample records for Pharmacy Inventory & Dispensing System.
BEGIN;
SET LOCAL standard_conforming_strings = on;
INSERT INTO portfolio."medication" ("medication_id", "generic_name", "strength", "dosage_form", "active") VALUES (1001, 'amoxicillin', '250 mg', 'capsule', TRUE);
INSERT INTO portfolio."medication" ("medication_id", "generic_name", "strength", "dosage_form", "active") VALUES (1002, 'cetirizine', '10 mg', 'tablet', TRUE);
INSERT INTO portfolio."pharmacy" ("pharmacy_id", "pharmacy_name", "license_code", "active") VALUES (2001, 'Maple Pharmacy', 'SYN-LIC-2001', TRUE);
INSERT INTO portfolio."pharmacy" ("pharmacy_id", "pharmacy_name", "license_code", "active") VALUES (2002, 'Cedar Pharmacy', 'SYN-LIC-2002', TRUE);
INSERT INTO portfolio."patient" ("patient_id", "patient_ref", "active") VALUES (4001, 'SYN-PAT-001', TRUE);
INSERT INTO portfolio."patient" ("patient_id", "patient_ref", "active") VALUES (4002, 'SYN-PAT-002', TRUE);
INSERT INTO portfolio."inventory" ("inventory_id", "pharmacy_id", "medication_id", "lot_code", "expiry_date", "quantity_on_hand", "reorder_level") VALUES (3001, 2001, 1001, 'LOT-AMX-01', '2027-06-30', 40, 10);
INSERT INTO portfolio."inventory" ("inventory_id", "pharmacy_id", "medication_id", "lot_code", "expiry_date", "quantity_on_hand", "reorder_level") VALUES (3002, 2002, 1002, 'LOT-CTZ-01', '2027-09-30', 25, 5);
INSERT INTO portfolio."dispense" ("dispense_id", "inventory_id", "patient_id", "dispensed_at", "quantity", "prescription_ref") VALUES (5001, 3001, 4001, '2026-11-01T10:15:00Z', 2, 'SYN-RX-001');
INSERT INTO portfolio."dispense" ("dispense_id", "inventory_id", "patient_id", "dispensed_at", "quantity", "prescription_ref") VALUES (5002, 3002, 4002, '2026-11-02T14:30:00+00:00', 1, 'SYN-RX-002');
COMMIT;
