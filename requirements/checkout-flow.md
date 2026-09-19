# Requirement: Checkout Flow

## Description
As a logged-in user with items in my cart, I want to complete the checkout process by entering my shipping information and confirming my order, so that I can complete my purchase.

## Acceptance Criteria
- From the cart page, clicking "Checkout" navigates to the checkout information form (first name, last name, zip/postal code).
- Submitting the form with all fields filled navigates to the checkout overview page, showing item(s), price breakdown, and total.
- Submitting the form with any required field empty shows a validation error and does not proceed.
- On the overview page, clicking "Finish" completes the order and shows a confirmation/thank you page.
- The cart is emptied (badge disappears) after an order is successfully completed.
- A user can cancel out of checkout at any step and return to the previous page without losing cart contents.
- after successful order generate pdf option should be visible
- upon clicking on generate pdf button, pdf should be downloaded
- check for the interruption cases, where order is in progress and network is lost or interrupted in that case order should not be placed
- check for the case where order is in progress and internet connection lost, check for the case as well when internet connection is restored again automatically allowing user to complete checkout process


## Notes
- Target site: https://www.saucedemo.com
- Assume the user is already logged in and has at least one item in the cart before starting checkout.