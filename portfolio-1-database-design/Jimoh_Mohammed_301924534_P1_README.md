# Portfolio 1 — Database Design and Modelling

I organised the data into medication, pharmacy, inventory, patient, dispense. The design document explains the fields, keys, relationships and business rules. The normalisation document shows the sample tables at 1NF, 2NF and 3NF.

## Database checks

| Table | Rows |
| --- | --- |
| medication | 2 |
| pharmacy | 2 |
| inventory | 2 |
| patient | 2 |
| dispense | 2 |

The 16 invalid inserts were rejected at their expected constraints, and the valid sample rows remained unchanged.

## Files

- [Design](Jimoh_Mohammed_301924534_P1_Design.md)
- [ER diagram](Jimoh_Mohammed_301924534_P1_ERDiagram.md)
- [Normalisation](Jimoh_Mohammed_301924534_P1_Normalisation.md)
- [Schema](Jimoh_Mohammed_301924534_P1_Schema.sql)
- [Sample data](Jimoh_Mohammed_301924534_P1_SampleData.sql)
- [Constraint tests](Jimoh_Mohammed_301924534_P1_ConstraintTests.sql)
- [Table and constraint evidence](screenshots/Jimoh_Mohammed_301924534_P1_DatabaseResults.png)

## Run the SQL

Create a fresh PostgreSQL database. Run the schema first, then the sample data. Run the deliberately invalid statements in ConstraintTests.sql individually outside a transaction; each is expected to produce an error.

## References

- [PostgreSQL — constraints](https://www.postgresql.org/docs/17/ddl-constraints.html)

