'use client';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import type { WalletName } from '@solana/wallet-adapter-base';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

export default function WalletButton() {
  const { select, connect, connected, disconnect, publicKey } = useWallet();
  const [open, setOpen] = useState(false);

  const wallets = [
    { name: 'Phantom', value: 'Phantom' as WalletName },
    { name: 'Solflare', value: 'Solflare' as WalletName },
    { name: 'Torus', value: 'Torus' as WalletName },
  ];

  const handleConnect = async (walletName: WalletName) => {
    try {
      await select(walletName);
      // Add a small delay to ensure wallet is selected
      setTimeout(async () => {
        try {
          await connect();
          setOpen(false);
        } catch (err) {
          console.error('Connection error:', err);
        }
      }, 100);
    } catch (error) {
      console.error('Selection error:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  return (
    <>
      {!connected ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="default" className="gap-2">
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect Wallet</DialogTitle>
              <DialogDescription>
                Choose a wallet to connect to Solana
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              {wallets.map((wallet) => (
                <Button
                  key={wallet.value}
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => handleConnect(wallet.value)}
                >
                  {wallet.name}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono bg-muted px-3 py-1.5 rounded">
            {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
          </div>
          <Button variant="outline" size="sm" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </div>
      )}
    </>
  );
}
