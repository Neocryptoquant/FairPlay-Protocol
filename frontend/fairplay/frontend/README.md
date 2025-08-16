# FairPlay Protocol Frontend

This folder contains all the frontend components for the FairPlay Protocol application.

## Structure

\`\`\`
frontend/
├── pages/           # Page components
├── components/      # Reusable UI components  
├── lib/            # Utilities and integrations
├── assets/         # Images and static files
└── README.md       # This file
\`\`\`

## Smart Contract Integration

The `lib/anchor-integration.ts` file contains placeholder methods for integrating with your deployed smart contract. Replace the mock implementation with your actual Anchor IDL-generated hooks.

## Key Files

- `lib/anchor-integration.ts` - Interface for your deployed smart contract
- `lib/solana-integration.ts` - Current mock implementation (can be removed after integration)
- `components/campaign-launch-modal.tsx` - Campaign creation UI
- `components/campaign-finalize-modal.tsx` - Campaign finalization UI
- `pages/` - All page components (home, how-it-works, etc.)

## Next Steps

1. Add your Anchor IDL file to this folder
2. Replace `AnchorIntegration` class with actual smart contract calls
3. Update imports in the main app to use your real integration
4. Test the integration with your deployed program
