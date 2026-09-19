# Requirement: Login

## Description
As a user of SauceDemo, I want to log in with my username and password so that I can access the inventory page and shop. The system should also handle invalid login attempts gracefully. The system should also handle security related cases as well.

## Acceptance Criteria
- A valid username/password combination logs the user in and redirects to the inventory page.
- An invalid username or password shows a clear error message and keeps the user on the login page.
- Locked-out users (e.g. `locked_out_user`) see a specific error message explaining the account is locked.
- Submitting the form with empty username and/or password fields shows an appropriate validation error.
- The password field masks input (does not display plain text).
- SQL Injection related case should be handled
- cases where login can be bypassed using some tools also can be handled 

## Notes
- Target site: https://www.saucedemo.com
- Known test users: standard_user, locked_out_user, problem_user (all use password: secret_sauce)