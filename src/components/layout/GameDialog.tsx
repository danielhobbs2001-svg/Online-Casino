import React from 'react';
import { useCasino } from '../../context/CasinoContext';
import { VegasNeonSlot } from '../games/VegasNeonSlot';
import { RocketCrashGame } from '../games/RocketCrashGame';
import { RouletteGame } from '../games/RouletteGame';
import { BlackjackGame } from '../games/BlackjackGame';
import { PlinkoGame } from '../games/PlinkoGame';
import { MinesGame } from '../games/MinesGame';
import { WheelOfFortuneGame } from '../games/WheelOfFortuneGame';
import { InstantScratcher } from '../games/InstantScratcher';
import { VideoPoker } from '../games/VideoPoker';
import { ModularQuickGame } from '../games/ModularQuickGame';
import { X, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';

export const GameDialog: React.FC = () => {
  const { activeGame, closeGame, currency } = useCasino();

  if (!activeGame) return null;

  const renderGameContent = () => {
    switch (activeGame.interactiveEngineId) {
      case 'slots':
        return <VegasNeonSlot />;
      case 'crash':
        return <RocketCrashGame />;
      case 'roulette':
        return <RouletteGame />;
      case 'blackjack':
        return <BlackjackGame />;
      case 'plinko':
        return <PlinkoGame />;
      case 'mines':
        return <MinesGame />;
      case 'wheel':
        return <WheelOfFortuneGame />;
      case 'scratch':
        return <InstantScratcher />;
      case 'poker':
        return <VideoPoker />;
      case 'modular':
      default:
        return <ModularQuickGame game={activeGame} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[96vh]">
        {/* Game Title Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={closeGame}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Lobby</span>
            </button>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-display">{activeGame.title}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono-numbers">
                  {activeGame.provider}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>RNG Certified · {activeGame.rtp}% RTP</span>
            </div>

            <button
              onClick={closeGame}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Game Canvas Container */}
        <div className="p-3 sm:p-6 overflow-y-auto">
          {renderGameContent()}
        </div>
      </div>
    </div>
  );
};
