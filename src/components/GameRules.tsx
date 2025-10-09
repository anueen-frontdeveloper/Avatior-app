import React from "react";
import { X } from "lucide-react";

interface GameRulesProps {
  visible: boolean;
  onClose: () => void;
}

const GameRules: React.FC<GameRulesProps> = ({ visible, onClose }) => {
  if (!visible) return null; // don't render if not visible

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#121212] text-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-yellow-500 uppercase tracking-widest">
            Game Rules
          </h1>
          <button
            onClick={onClose}
            aria-label="Close Game Rules"
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <hr className="border-gray-700 mb-6" />

        {/* Rules Section */}
        <div className="bg-yellow-500 text-black rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Basic Rules</h2>
          <ul className="space-y-4 text-base leading-relaxed">
            <li>
              <span className="font-bold">1.</span> Each round starts after a
              short countdown. Players can place one or two bets before the round
              begins.
            </li>
            <li>
              <span className="font-bold">2.</span> The multiplier (coefficient)
              increases continuously as the plane flies.
            </li>
            <li>
              <span className="font-bold">3.</span> You must cash out before the
              plane flies away to secure your winnings.
            </li>
            <li>
              <span className="font-bold">4.</span> If you don’t cash out in
              time, the bet amount is lost.
            </li>
            <li>
              <span className="font-bold">5.</span> Maximum winning amount per bet
              is <span className="font-bold">₹2,500,000.00</span>.
            </li>
          </ul>
        </div>

        <hr className="border-gray-700 mb-6" />

        {/* Extra Info */}
        <div className="text-sm text-gray-400 text-center leading-relaxed">
          Please play responsibly. Betting involves financial risk — only play
          with money you can afford to lose.
        </div>
      </div>
    </div>
  );
};

export default GameRules;
