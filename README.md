![Playwright Tests](https://github.com/miteshahir0505/self-learning-playwright-agent/actions/workflows/playwright.yml/badge.svg)

# Self-Learning Playwright Agent

AI-augmented test automation that generates test cases from requirements and heals its own broken selectors — getting faster every time it encounters a problem it's already solved.

## Why this exists

Manual QA doesn't scale, and traditional automation is brittle — a single UI change breaks selectors across dozens of tests, and every new feature needs test cases written from scratch. This project explores a practical, honest way to use AI agents to reduce both problems, without pretending AI replaces engineering judgment.

## What it does

### 1. AI-generated test cases from requirements
- Write a requirement as a simple Markdown file (title, description, acceptance criteria).
- The agent sends it to Gemini and gets back structured, prioritized test cases (positive, negative, and edge cases) as JSON — saved for traceability back to the original requirement.
- A generator turns that JSON into runnable Playwright test stubs.
- Example: one requirement produced **8 test cases**, including edge cases a first-pass manual review might miss (double-click duplication, badge state after refresh, empty-cart display).

### 2. Self-healing, self-learning selector agent
- When a Playwright selector breaks, the agent doesn't just fail — it asks Gemini, using the live page HTML, for a working replacement.
- Every AI suggestion is **verified against the real DOM before use** — if the AI gets it wrong, the agent fails safely instead of silently continuing with a bad selector.
- Verified fixes are cached locally. The next time the same selector breaks, the agent reuses the cached fix instantly — no AI call needed.

**Measured results:**
- **Static broken selector:** first encounter took ~6.5s (AI call + verification). Every subsequent encounter took ~9ms (cache hit) — a ~700x speedup, and zero additional API cost.
- **Genuinely dynamic element ID** (regenerated on every page load): one AI call produced a generalized, pattern-based fix (`button[id^="submit-btn"]`) instead of a one-off literal selector. That single fix correctly matched the element across 5 subsequent runs — each with a different random ID — with zero additional AI calls needed.

## Tech stack
- Playwright + TypeScript
- Google Gemini API (`@google/genai`)
- Node.js

## Project structure

src/
ai/ # Gemini client, test-case generation, JSON prompting
agent/ # Self-healing selector logic + local learning cache
fixtures/ # Local HTML fixtures used to reliably demo dynamic-ID healing
requirements/ # Human-written requirement docs (input)
generated/ # AI-generated test case JSON (traceable output)
tests/
generated/ # Auto-generated test stubs (fixme, awaiting implementation)
manual/ # Hand-implemented, passing tests
pages/ # Page Object Model classes
logs/ # Agent activity logs (selector healing, cache hits)


## How to run it

1. Clone the repo and install dependencies:

npm install
npx playwright install


2. Add your own Gemini API key (free tier available at [aistudio.google.com](https://aistudio.google.com)) to a `.env` file in the project root:

GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.6-flash


3. Generate test cases from a requirement:

npx tsx src/ai/generateTestCases.ts add-to-cart.md
npx tsx src/ai/generateTestFile.ts add-to-cart.json


4. Run the implemented tests:

npx playwright test tests/manual


5. Try the self-healing agent demos:

npx playwright test tests/manual/self-healing-login.spec.ts --project=chromium
npx playwright test tests/manual/self-healing-dynamic-id.spec.ts --project=chromium

Check `logs/agent.log` afterward to see the healing and caching behavior. Run the dynamic-ID test multiple times to see the cached fix survive a fresh randomized ID each time.

## Design decisions worth noting

- **AI generates test cases, not blind automation.** Test steps are AI-suggested but implemented and reviewed by a human — this keeps output honest and avoids brittle, hallucinated locators in production tests.
- **The agent verifies before it trusts.** Every AI-suggested selector is checked against the live DOM before being used or cached, so a wrong AI guess fails the test loudly instead of passing on a false assumption.
- **Cached fixes can generalize, not just memorize.** On the dynamic-ID scenario, the AI returned a prefix-based CSS selector rather than one specific ID — meaning the cached fix keeps working even as the underlying page state changes on every load.
- **The model name is config-driven, not hardcoded**, after hitting real API model-deprecation issues mid-build — a good reminder that AI tooling in production needs to tolerate upstream change.

## What's next

- Add GitHub Actions CI to run the suite automatically on push.

## Author

**Mitesh Ahir**
GitHub: [@miteshahir0505](https://github.com/miteshahir0505)
LinkedIn: [linkedin.com/in/mitesh-ahir-48376828](https://www.linkedin.com/in/mitesh-ahir-48376828/)

Built as a hands-on exploration of practical AI-agent integration in test automation — combining traditional QA fundamentals (Page Object Model, structured test design) with AI-assisted test generation and self-healing automation.