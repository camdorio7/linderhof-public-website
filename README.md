LINDEX public renter registration — normalized unit key fix

Replace app/api/register-renter/route.ts in the public website repository.
The supplied registry row is unit_label=18-11, unit_key=1811.
The API now converts entries like 18-11, 18 11, and Unit 18-11 into 1811 for exact lookup.
No SQL changes are needed.

Deploy, submit one test, and verify it appears under LINDEX > Renters > Public Registrations.
If it still fails, inspect the new POST /api/register-renter status and response before making further changes.
