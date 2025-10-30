# Squad Grid - Solana Payment Platform

A modern payment platform built on Solana using Grid SDK, featuring payment links, embeddable widgets, and real-time analytics.

## 🚀 Features

- **Email Authentication** - Secure OTP-based login with Grid Protocol
- **Wallet Integration** - Connect Phantom, Solflare, and other Solana wallets
- **Payment Links** - Generate secure payment links with custom amounts and currencies
- **Embeddable Widgets** - Add payment buttons to any website
- **Multi-Currency Support** - Accept USDC, USDT, and PYUSD
- **Real-time Analytics** - Track payments, success rates, and transaction data
- **x402 Protocol** - Internet-native payment protocol support

## 🛠️ Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:your_password@your_host/neondb?sslmode=require"

# Authentication
NEXTAUTH_SECRET="your-random-secret-here-32-chars-minimum"
NEXTAUTH_URL="http://localhost:3000"

# Grid SDK (Required - Get from https://grid.squads.xyz)
GRID_API_KEY="your_grid_api_key_here"
GRID_ENV="sandbox"  # Use "production" for live environment
```

### 2. Database Setup

Run the database migrations:

```bash
pnpm drizzle-kit push
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔑 Grid SDK Setup

1. **Sign up** at [https://grid.squads.xyz](https://grid.squads.xyz)
2. **Get your API key** from the dashboard
3. **Set GRID_ENV** to "sandbox" for testing or "production" for live
4. **Configure your domain** in Grid dashboard for webhooks

## 📚 Key Components

- **Email Auth**: `/src/app/auth/page.tsx` - OTP-based authentication
- **Dashboard**: `/src/app/dashboard/` - Payment management interface
- **Payment Links**: `/src/app/dashboard/magic-links/` - Create and manage links
- **Widgets**: `/src/app/dashboard/widgets/` - Embeddable payment components
- **Checkout**: `/src/app/checkout/[paymentLinkId]/` - Payment processing

## 🔧 API Routes

- `POST /api/auth/solana-verify` - Wallet authentication
- `POST /api/auth/update-wallet` - Update user wallet address
- `POST/GET /api/payment-links` - Payment link CRUD
- `POST /api/payments` - Process payments with x402
- `GET /api/analytics` - Payment analytics
- `GET /api/transactions` - Transaction history

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment

```bash
pnpm build
pnpm start
```

## 📖 Documentation

- [Grid SDK Documentation](https://grid.squads.xyz/grid/v1/sdk-reference)
- [x402 Protocol](https://www.x402.org)
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)

## 🐛 Troubleshooting

### OTP Not Working
1. Check your `GRID_API_KEY` environment variable
2. Ensure `GRID_ENV` is set to "sandbox" for testing
3. Check browser console for Grid SDK errors
4. Verify your email address format

### Wallet Connection Issues
1. Ensure you're using a compatible wallet (Phantom, Solflare)
2. Check browser console for wallet adapter errors
3. Try refreshing the page and reconnecting

### Database Issues
1. Verify your `DATABASE_URL` is correct
2. Run `pnpm drizzle-kit push` to ensure tables are created
3. Check Neon dashboard for connection issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
# demo-grid-page
