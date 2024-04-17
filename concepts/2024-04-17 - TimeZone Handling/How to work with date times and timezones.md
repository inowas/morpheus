# Problem — The raw idea, a use case, or something we’ve seen that motivates us to work on this

Our world has time zones. When we work with date times, we need to be aware of the time zone to avoid confusion and errors.
As talked with Christian we need to specify the time zone in our date-time objects.
But the client computer comes with a different time zone depending on the user's location.
We need to handle this situation and make sure that the time zone is correctly set in our date-time objects.
Also we need to make sure to not confuse the user with a different time zone than the one he is used to.

# Appetite — How much time we want to spend and how that constrains the solution

We have already spent 2 days on this and we want to spend another 1 day on this.

# Solution — The core elements we came up with, presented in a form that’s easy for people to immediately understand

The project should have a time zone specified. By default it's UTC.
The owner should be able to change the time zone in the settings.
All dates and times should be stored in the database with the given project time zone.

All user input (if not specified with time zone) should be parsed as the project time zone.
The default date time format is ISO 8601.

# Rabbit holes — Details about the solution worth calling out to avoid problems

There are a lot of libs that can help us with this. We should check them out before implementing our own solution.
DATE-FNS was a good starting point, but as it only manipulates the internal date object, it's not enough for our use case.
Moment.js is a good alternative, but it's deprecated and we should look for a better alternative.
Luxon is a good alternative to Moment.js!

# No-gos — Anything specifically excluded from the concept: functionality or use cases we intentionally aren’t covering to fit the appetite or make the problem tractable

No Moment.js!
No Date-FNS!
No manual date-time handling!
