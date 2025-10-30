"use client";

import React, { FC, ReactNode, useMemo, useEffect } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

export const WalletContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Use Mainnet for production, Devnet for development
  const network = process.env.NODE_ENV === 'production'
    ? WalletAdapterNetwork.Mainnet
    : WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => {
      const walletAdapters = [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
      ];
      console.log('🔧 Wallet adapters initialized:', walletAdapters.map(w => ({
        name: w.name,
        url: w.url,
        icon: w.icon
      })));

      return walletAdapters;
    },
    [],
  );

  // Check for stored wallet preference only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedWallet = localStorage.getItem('walletName');
      if (storedWallet) {
        console.log('💾 Found stored wallet preference:', storedWallet);
      }
    }
  }, []);

  // Handle wallet connection persistence
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleWalletChange = () => {
      // Store wallet preference when connected
      const walletName = localStorage.getItem('walletName');
      if (walletName) {
        console.log('💾 Persisting wallet preference:', walletName);
      }
    };

    window.addEventListener('beforeunload', handleWalletChange);
    return () => window.removeEventListener('beforeunload', handleWalletChange);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        autoConnect={true}
        localStorageKey="solana-wallet"
        onError={(error) => {
          // Only log errors in development, suppress in production
          if (process.env.NODE_ENV === 'development') {
            console.warn('Wallet provider error (suppressed):', error.message);
          }
        }}
      >
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};

