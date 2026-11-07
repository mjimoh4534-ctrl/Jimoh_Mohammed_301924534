// Run once in mongosh against a fresh exercise database.
// These records are fictional events for the case study.
(async function () {
  db = db.getSiblingDB('portfolio_nosql');
  if ((await db.getCollectionNames()).includes("dispense_events")) {
    throw new Error('The exercise collection already exists. Use a fresh database.');
  }

  // The validator checks the stable event fields while details can vary.
  await db.createCollection("dispense_events", {
    validator: {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "_id",
            "schemaVersion",
            "simulation",
            "eventType",
            "occurredAt",
            "source",
            "embedded",
            "references",
            "details"
        ],
        "properties": {
            "_id": {
                "bsonType": "string",
                "minLength": 1
            },
            "schemaVersion": {
                "enum": [
                    1
                ]
            },
            "simulation": {
                "enum": [
                    true
                ]
            },
            "eventType": {
                "bsonType": "string",
                "enum": [
                    "dispensed",
                    "dispense_reversed"
                ]
            },
            "occurredAt": {
                "bsonType": "date"
            },
            "source": {
                "bsonType": "object",
                "required": [
                    "entity",
                    "key",
                    "snapshot"
                ],
                "properties": {
                    "entity": {
                        "enum": [
                            "dispense"
                        ]
                    },
                    "key": {
                        "bsonType": "object",
                        "required": [
                            "dispense_id"
                        ]
                    },
                    "snapshot": {
                        "bsonType": "object"
                    }
                }
            },
            "embedded": {
                "bsonType": "object"
            },
            "references": {
                "bsonType": "object"
            },
            "details": {
                "bsonType": "object"
            }
        }
    }
},
    validationLevel: 'strict', validationAction: 'error'
  });

  // Insert the four example events and show their IDs.
  printjson(await db.getCollection("dispense_events").insertMany([
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
    },
    {
        "_id": "event_000002",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "dispense_reversed",
        "occurredAt": ISODate("2030-01-01T10:01:00Z"),
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
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "attributes": [
                {
                    "entity": "dispense",
                    "key": {
                        "dispense_id": 5001
                    },
                    "field": "prescription_ref",
                    "value": "SYN-RX-001"
                }
            ],
            "examples": {
                "batch_metadata": "illustrative batch_metadata"
            }
        }
    },
    {
        "_id": "event_000003",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "dispensed",
        "occurredAt": ISODate("2030-01-01T10:02:00Z"),
        "source": {
            "entity": "dispense",
            "key": {
                "dispense_id": 5002
            },
            "snapshot": {
                "dispense_id": 5002,
                "inventory_id": 3002,
                "patient_id": 4002,
                "dispensed_at": "2026-11-02T14:30:00+00:00",
                "quantity": 1,
                "prescription_ref": "SYN-RX-002"
            }
        },
        "embedded": {
            "medication": [
                {
                    "key": {
                        "medication_id": 1002
                    },
                    "snapshot": {
                        "medication_id": 1002,
                        "generic_name": "cetirizine",
                        "strength": "10 mg",
                        "dosage_form": "tablet",
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
                        "pharmacy_id": 2002
                    },
                    "snapshot": {
                        "pharmacy_id": 2002,
                        "pharmacy_name": "Cedar Pharmacy",
                        "license_code": "SYN-LIC-2002",
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
                        "inventory_id": 3002
                    },
                    "via": [
                        "dispense.inventory_id → inventory"
                    ]
                }
            ],
            "patient": [
                {
                    "key": {
                        "patient_id": 4002
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
    },
    {
        "_id": "event_000004",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "dispense_reversed",
        "occurredAt": ISODate("2030-01-01T10:03:00Z"),
        "source": {
            "entity": "dispense",
            "key": {
                "dispense_id": 5002
            },
            "snapshot": {
                "dispense_id": 5002,
                "inventory_id": 3002,
                "patient_id": 4002,
                "dispensed_at": "2026-11-02T14:30:00+00:00",
                "quantity": 1,
                "prescription_ref": "SYN-RX-002"
            }
        },
        "embedded": {
            "medication": [
                {
                    "key": {
                        "medication_id": 1002
                    },
                    "snapshot": {
                        "medication_id": 1002,
                        "generic_name": "cetirizine",
                        "strength": "10 mg",
                        "dosage_form": "tablet",
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
                        "pharmacy_id": 2002
                    },
                    "snapshot": {
                        "pharmacy_id": 2002,
                        "pharmacy_name": "Cedar Pharmacy",
                        "license_code": "SYN-LIC-2002",
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
                        "inventory_id": 3002
                    },
                    "via": [
                        "dispense.inventory_id → inventory"
                    ]
                }
            ],
            "patient": [
                {
                    "key": {
                        "patient_id": 4002
                    },
                    "via": [
                        "dispense.patient_id → patient"
                    ]
                }
            ]
        },
        "details": {
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "attributes": [
                {
                    "entity": "dispense",
                    "key": {
                        "dispense_id": 5002
                    },
                    "field": "prescription_ref",
                    "value": "SYN-RX-002"
                }
            ],
            "examples": {
                "batch_metadata": "illustrative batch_metadata"
            }
        }
    }
]));
  await db.getCollection("dispense_events").createIndex({eventType: 1, occurredAt: -1}, {name: 'event_type_time'});

  // 1. Find the first sample event type (up to five documents).
  printjson(await db.getCollection("dispense_events").find({"eventType":"dispensed"}).sort({_id:1}).limit(5).toArray());

  // 2. Find events for the first source record using nested key fields (up to five).
  printjson(await db.getCollection("dispense_events").find({"source.key.dispense_id":5001}).sort({_id:1}).limit(5).toArray());

  // 3. Find events in the sample time range using a MongoDB Date filter (up to five).
  printjson(await db.getCollection("dispense_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray());

  // 4. Count documents for each event type.
  printjson(await db.getCollection("dispense_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray());

  // A date stored as text should be rejected by the validator.
  try {
    await db.getCollection("dispense_events").insertOne({...{
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
}, _id: 'invalid_date_example', occurredAt: 'not-a-date'});
  } catch (error) { print('Invalid date error: ' + error.code); }

  // Reusing an event ID should be rejected by the unique _id index.
  try { await db.getCollection("dispense_events").insertOne({
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
}); }
  catch (error) { print('Duplicate ID error: ' + error.code); }

  print('Document count: ' + await db.getCollection("dispense_events").countDocuments());
})().catch(error => { print(error.stack || String(error)); quit(1); });
