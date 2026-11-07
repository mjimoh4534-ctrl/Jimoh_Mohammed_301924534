# Portfolio 4 — NoSQL and Advanced Data Models

I used MongoDB collection dispense_events for dispensed and dispense_reversed events. These are fictional event examples based on dispense, inventory, medication, pharmacy, patient.

## Document model

| Field | Meaning |
| --- | --- |
| _id | Unique string event ID |
| eventType | One of the two selected case event labels |
| occurredAt | Native BSON Date; sample timestamps are in 2030 |
| source | Original entity, primary key and saved JSON snapshot |
| embedded | Linked record snapshots read with the event |
| references | Keys for linked sources kept outside the embedded snapshots |
| details | Event metadata whose fields vary |

Related medication, pharmacy details are stored as snapshots with the event. This makes an event readable in one document. It duplicates some information, and later SQL changes do not automatically update the snapshots. PostgreSQL continues to enforce the relational rules.

## Example document

```javascript
{
    "_id": "event_000001",
    "schemaVersion": 1,
    "simulation": true,
    "eventType": "dispensed",
    "occurredAt": ISODate("2030-01-01T10:00:00Z"),
    "source": {
        "entity": "dispense",
        "key": {
            "dispense_id": 5001
        },
        "snapshot": {
            "dispense_id": 5001,
            "inventory_id": 3001,
            "patient_id": 4001,
            "dispensed_at": "2026-11-01T10:15:00Z",
            "quantity": 2,
            "prescription_ref": "SYN-RX-001"
        }
    },
    "embedded": {
        "medication": [
            {
                "key": {
                    "medication_id": 1001
                },
                "snapshot": {
                    "medication_id": 1001,
                    "generic_name": "amoxicillin",
                    "strength": "250 mg",
                    "dosage_form": "capsule",
                    "active": true
                },
                "via": [
                    "dispense.inventory_id → inventory.medication_id → medication"
                ]
            }
        ],
        "pharmacy": [
            {
                "key": {
                    "pharmacy_id": 2001
                },
                "snapshot": {
                    "pharmacy_id": 2001,
                    "pharmacy_name": "Maple Pharmacy",
                    "license_code": "SYN-LIC-2001",
                    "active": true
                },
                "via": [
                    "dispense.inventory_id → inventory.pharmacy_id → pharmacy"
                ]
            }
        ]
    },
    "references": {
        "inventory": [
            {
                "key": {
                    "inventory_id": 3001
                },
                "via": [
                    "dispense.inventory_id → inventory"
                ]
            }
        ],
        "patient": [
            {
                "key": {
                    "patient_id": 4001
                },
                "via": [
                    "dispense.patient_id → patient"
                ]
            }
        ]
    },
    "details": {
        "channel": "web"
    }
}
```

## Queries and results

| Query | Returned documents |
| --- | --- |
| Find the first sample event type (up to five documents). | 2 |
| Find events for the first source record using nested key fields (up to five). | 2 |
| Find events in the sample time range using a MongoDB Date filter (up to five). | 4 |
| Count documents for each event type. | 2 |

## 1. Find the first sample event type (up to five documents).

```javascript
db.getCollection("dispense_events").find({"eventType":"dispensed"}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "dispensed",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "dispense_id": 5001
    }
  },
  {
    "_id": "event_000003",
    "eventType": "dispensed",
    "occurredAt": {
      "$date": "2030-01-01T10:02:00Z"
    },
    "source": {
      "dispense_id": 5002
    }
  }
]
```

## 2. Find events for the first source record using nested key fields (up to five).

```javascript
db.getCollection("dispense_events").find({"source.key.dispense_id":5001}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "dispensed",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "dispense_id": 5001
    }
  },
  {
    "_id": "event_000002",
    "eventType": "dispense_reversed",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "dispense_id": 5001
    }
  }
]
```

## 3. Find events in the sample time range using a MongoDB Date filter (up to five).

```javascript
db.getCollection("dispense_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "dispensed",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "dispense_id": 5001
    }
  },
  {
    "_id": "event_000002",
    "eventType": "dispense_reversed",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "dispense_id": 5001
    }
  },
  {
    "_id": "event_000003",
    "eventType": "dispensed",
    "occurredAt": {
      "$date": "2030-01-01T10:02:00Z"
    },
    "source": {
      "dispense_id": 5002
    }
  },
  {
    "_id": "event_000004",
    "eventType": "dispense_reversed",
    "occurredAt": {
      "$date": "2030-01-01T10:03:00Z"
    },
    "source": {
      "dispense_id": 5002
    }
  }
]
```

## 4. Count documents for each event type.

```javascript
db.getCollection("dispense_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray();
```

| _id | documentCount |
| --- | --- |
| dispense_reversed | 2 |
| dispensed | 2 |

## Validation and suitability

MongoDB inserted 4 documents. An invalid date type was rejected with code 121 and a repeated event ID with 11000. The collection still contained 4 valid documents. The compound eventType/occurredAt index supports those access fields; this exercise does not measure its speed.

The details field can vary across event types, while the common fields have a validator. Events can be added as separate documents rather than growing one large history record.

## Run the script

Connect mongosh to a fresh exercise database and run Jimoh_Mohammed_301924534_P4_MongoDB.js. It selects portfolio_nosql, creates the collection, inserts the sample documents and displays the query results. [Implementation evidence](screenshots/Jimoh_Mohammed_301924534_P4_DocumentsAndQueries.png).

## References

- [MongoDB — data modelling](https://www.mongodb.com/docs/manual/data-modeling/)

