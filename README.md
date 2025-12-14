# Just Flip

## Prerequisites

Before you begin, ensure you have:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** package manager (comes with Node.js)

Check your Node.js version:
```bash
node --version
```

## Getting Started

### Development Setup

1. **Install dependencies from project root**
```bash
   npm install
```

2. **Set up environment variables**
   Create a `.env` in the root of the project directory and copy the contents of `.env.example` into the newly created `.env` file:
```bash
   cp .env.example .env
```

**Important:** For the actual environment variable values, **reach out to someone on the frontend team**.

3. **Run the development server**
```bash
   npm run dev
```

4. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## Testing

### Unit Tests

Run tests with Jest:
```bash
npm run test           # Run all tests
npm run test:coverage  # With coverage report
npm run test:watch     # Watch mode
```

### End-to-End Tests

Run Playwright tests:
```bash
npm run test:e2e
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Chakra UI
- **Blockchain:** Privy + Viem + Base Network
- **Testing:** Jest + Playwright

## Common Issues

**"Module not found":** Run `npm install` from project root

**Environment errors:** Ensure `.env` exists with all required values (contact frontend team)

**Wallet issues:** Check you're on Base network with test ETH for gas

## Getting Help

- Environment variables → Contact frontend team
- Smart contracts → Contact blockchain team