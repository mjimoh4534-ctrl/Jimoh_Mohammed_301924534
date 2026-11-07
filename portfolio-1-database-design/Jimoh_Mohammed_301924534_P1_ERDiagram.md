# Pharmacy Inventory & Dispensing System — ER diagram

```mermaid
erDiagram
    direction LR
    medication {
        bigint medication_id PK
        text generic_name
        text strength
        text dosage_form
        boolean active
    }
    pharmacy {
        bigint pharmacy_id PK
        text pharmacy_name
        text license_code UK
        boolean active
    }
    inventory {
        bigint inventory_id PK
        bigint pharmacy_id FK
        bigint medication_id FK
        text lot_code
        date expiry_date
        integer quantity_on_hand
        integer reorder_level
    }
    patient {
        bigint patient_id PK
        text patient_ref UK
        boolean active
    }
    dispense {
        bigint dispense_id PK
        bigint inventory_id FK
        bigint patient_id FK
        timestamptz dispensed_at
        integer quantity
        text prescription_ref
    }
    pharmacy ||--o{ inventory : "pharmacy_id"
    medication ||--o{ inventory : "medication_id"
    inventory ||--o{ dispense : "inventory_id"
    patient ||--o{ dispense : "patient_id"
```

PK identifies a record; FK links to another table; UK marks a single-field unique value. The relationship ends show exactly one, zero or one, or zero or many records. Composite unique keys and conditional rules are listed in the schema and design.

[Diagram image](../images/Jimoh_Mohammed_301924534_ERDiagram.png)
