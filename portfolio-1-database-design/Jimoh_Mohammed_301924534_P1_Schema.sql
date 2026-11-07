-- Pharmacy Inventory & Dispensing System: tables, keys and business constraints.
-- Run once in a fresh PostgreSQL database.
BEGIN;
SET LOCAL standard_conforming_strings = on;
CREATE SCHEMA portfolio;
CREATE TABLE portfolio."medication" (
  "medication_id" bigint NOT NULL,
  "generic_name" text NOT NULL,
  "strength" text NOT NULL,
  "dosage_form" text NOT NULL,
  "active" boolean NOT NULL,
  CONSTRAINT "pk_medication" PRIMARY KEY ("medication_id"),
  CONSTRAINT "uq_medication_0" UNIQUE ("generic_name", "strength", "dosage_form")
);
CREATE TABLE portfolio."pharmacy" (
  "pharmacy_id" bigint NOT NULL,
  "pharmacy_name" text NOT NULL,
  "license_code" text NOT NULL,
  "active" boolean NOT NULL,
  CONSTRAINT "pk_pharmacy" PRIMARY KEY ("pharmacy_id"),
  CONSTRAINT "uq_pharmacy_0" UNIQUE ("license_code")
);
CREATE TABLE portfolio."inventory" (
  "inventory_id" bigint NOT NULL,
  "pharmacy_id" bigint NOT NULL,
  "medication_id" bigint NOT NULL,
  "lot_code" text NOT NULL,
  "expiry_date" date NOT NULL,
  "quantity_on_hand" bigint NOT NULL,
  "reorder_level" bigint NOT NULL,
  CONSTRAINT "pk_inventory" PRIMARY KEY ("inventory_id"),
  CONSTRAINT "uq_inventory_0" UNIQUE ("pharmacy_id", "medication_id", "lot_code")
);
CREATE TABLE portfolio."patient" (
  "patient_id" bigint NOT NULL,
  "patient_ref" text NOT NULL,
  "active" boolean NOT NULL,
  CONSTRAINT "pk_patient" PRIMARY KEY ("patient_id"),
  CONSTRAINT "uq_patient_0" UNIQUE ("patient_ref")
);
CREATE TABLE portfolio."dispense" (
  "dispense_id" bigint NOT NULL,
  "inventory_id" bigint NOT NULL,
  "patient_id" bigint NOT NULL,
  "dispensed_at" timestamptz NOT NULL,
  "quantity" bigint NOT NULL,
  "prescription_ref" text NOT NULL,
  CONSTRAINT "pk_dispense" PRIMARY KEY ("dispense_id")
);
ALTER TABLE portfolio."inventory" ADD CONSTRAINT "fk_inventory_0" FOREIGN KEY ("pharmacy_id") REFERENCES portfolio."pharmacy" ("pharmacy_id");
ALTER TABLE portfolio."inventory" ADD CONSTRAINT "fk_inventory_1" FOREIGN KEY ("medication_id") REFERENCES portfolio."medication" ("medication_id");
ALTER TABLE portfolio."dispense" ADD CONSTRAINT "fk_dispense_0" FOREIGN KEY ("inventory_id") REFERENCES portfolio."inventory" ("inventory_id");
ALTER TABLE portfolio."dispense" ADD CONSTRAINT "fk_dispense_1" FOREIGN KEY ("patient_id") REFERENCES portfolio."patient" ("patient_id");
ALTER TABLE portfolio."inventory" ADD CONSTRAINT "inventory_nonnegative" CHECK ("quantity_on_hand" >= 0);
ALTER TABLE portfolio."dispense" ADD CONSTRAINT "dispense_positive_quantity" CHECK ("quantity" > 0);
COMMIT;
