# Requirement: Add to Cart

## Description
As a logged-in user on the SauceDemo inventory page, I want to add a product to my cart so that I can purchase it later. The cart icon badge should update to reflect the number of items in the cart.

## Acceptance Criteria
- User must be logged in and on the inventory (products) page.
- Clicking "Add to cart" on a product changes the button to "Remove".
- The cart badge (icon counter) increments by 1 for each item added.
- Adding multiple different products increments the badge correctly (e.g. 2 items = badge shows "2").
- The cart badge is not visible/shows nothing when the cart is empty.

## Notes
- Target site: https://www.saucedemo.com
- Test user: standard_user / secret_sauce