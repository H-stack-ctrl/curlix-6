import { useState } from 'react';
import TravelForm from './components/TravelForm';
import { generateTravelPlan } from './services/geminiService';
import { TravelPreferences, TravelPlanResponse } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, RefreshCw, Compass } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<TravelPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (prefs: TravelPreferences) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateTravelPlan(prefs);
      setPlan(result);
    } catch (err) {
      console.error(err);
      setError("Failed to generate your plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setPlan(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-10 py-6 border-b border-glass-border flex justify-between items-center bg-bg-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-extrabold tracking-tight text-accent-green">
          CEYLON <span className="text-accent-gold">AI</span>
        </div>
        <div className="text-sm font-medium opacity-80 uppercase tracking-widest hidden md:block">
          Your Personalized Island Guide
        </div>
        {plan && (
          <button
            onClick={reset}
            className="text-xs font-bold uppercase tracking-widest text-text-dim hover:text-accent-gold transition-colors flex items-center gap-2"
          >
            <RefreshCw size={14} />
            Reset
          </button>
        )}
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[260px_1fr_300px] gap-10 p-10 max-w-[1600px] mx-auto w-full">
        {/* Left: Input Panel */}
        <aside className="sticky top-28 self-start">
          <TravelForm onGenerate={handleGenerate} isLoading={isLoading} />
        </aside>

        {/* Center: Itinerary */}
        <section className="space-y-6">
          <AnimatePresence mode="wait">
            {!plan && !isLoading && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 glass-panel border-dashed"
              >
                <Compass size={64} className="text-glass-border mb-6" />
                <h2 className="text-2xl font-bold mb-2">Ready to explore?</h2>
                <p className="text-text-dim">Configure your travel preferences in the setup panel to generate a custom Sri Lanka itinerary.</p>
              </motion.div>
            )}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12"
              >
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-accent-green/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-accent-green border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-xl font-bold mb-2">Crafting your journey...</h2>
                <p className="text-text-dim text-sm italic">Analyzing best routes and destinations in Sri Lanka</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 glass-panel border-red-500/30 text-red-400"
              >
                {error}
              </motion.div>
            )}

            {plan && (
              <motion.div
                key="plan-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="itinerary-container"
              >
                <div className="flex justify-between items-end mb-4">
                  <h2 className="section-title !mb-0">Planned Itinerary</h2>
                  <span className="text-[10px] text-text-dim uppercase tracking-widest">{plan.itinerary.length} Days in Paradise</span>
                </div>
                <div className="space-y-6">
                  {plan.itinerary.map((day) => (
                    <motion.div
                      key={day.day}
                      className="glass-panel overflow-hidden accent-border-left"
                    >
                      {day.imageUrl && (
                        <div className="h-48 w-full overflow-hidden relative">
                          <img 
                            src={day.imageUrl} 
                            alt={day.location}
                            className="w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-transparent"></div>
                        </div>
                      )}
                      <div className="p-6 relative">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-xs font-bold text-accent-green bg-accent-green/10 px-2 py-1 rounded">DAY {String(day.day).padStart(2, '0')}</span>
                          <span className="text-xs font-bold text-text-dim opacity-60 uppercase">{day.estimatedCost}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3">{day.location}</h3>
                        <ul className="space-y-2">
                          {day.activities.map((act, i) => (
                            <li key={i} className="text-sm text-text-dim flex items-start gap-3">
                              <span className="text-accent-gold mt-1">→</span>
                              {act}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Right: Meta Panel */}
        <aside className="sticky top-28 self-start flex flex-col gap-6">
          <AnimatePresence>
            {plan && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {/* Recommendations */}
                <div className="space-y-2">
                  <h2 className="section-title">Top Picks</h2>
                  <div className="space-y-3">
                    {plan.destinations.map((dest) => (
                      <div key={dest.name} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-colors">
                        <div className="w-14 h-14 bg-glass-border rounded-lg overflow-hidden flex items-center justify-center text-xl shrink-0 border border-white/10">
                          {dest.imageUrl ? (
                            <img 
                              src={dest.imageUrl} 
                              alt={dest.name} 
                              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            dest.category.toLowerCase().includes('beach') ? '🏖️' : 
                            dest.category.toLowerCase().includes('nature') ? '⛰️' :
                            dest.category.toLowerCase().includes('wildlife') ? '🐘' :
                            dest.category.toLowerCase().includes('culture') ? '🏰' : '📍'
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold leading-tight truncate">{dest.name}</h4>
                          <p className="text-[11px] text-text-dim mt-1 truncate">{dest.category} • {dest.budgetLevel}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget Summary */}
                <div className="glass-panel p-6 bg-accent-gold/5 border-accent-gold/20">
                  <h2 className="section-title !text-accent-gold mb-4">Budget Summary</h2>
                  <div className="space-y-3 text-[13px]">
                    <div className="flex justify-between text-text-dim">
                      <span>Transport</span>
                      <span className="font-bold text-text-main">{plan.budgetSummary.transport}</span>
                    </div>
                    <div className="flex justify-between text-text-dim">
                      <span>Stays</span>
                      <span className="font-bold text-text-main">{plan.budgetSummary.accommodation}</span>
                    </div>
                    <div className="flex justify-between text-text-dim border-b border-accent-gold/20 pb-2">
                      <span>Food/Entry</span>
                      <span className="font-bold text-text-main">{plan.budgetSummary.food}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold uppercase text-[10px] tracking-widest text-accent-gold">Estimated Total</span>
                      <span className="text-2xl font-bold text-accent-gold">{plan.budgetSummary.total}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </main>

      {/* Footer */}
      <footer className="px-10 py-6 bg-black/30 border-t border-glass-border flex flex-wrap gap-x-12 gap-y-4 justify-center md:justify-start">
        <div className="text-xs text-text-dim">
          <span className="text-accent-green font-bold tracking-widest uppercase mr-2 text-[10px]">Travel Tip</span>
          Dec–Apr is prime season for South & West Coast.
        </div>
        <div className="text-xs text-text-dim">
          <span className="text-accent-green font-bold tracking-widest uppercase mr-2 text-[10px]">Culture</span>
          Modest dress is strictly required for religious sites.
        </div>
        <div className="text-xs text-text-dim">
          <span className="text-accent-green font-bold tracking-widest uppercase mr-2 text-[10px]">Safety</span>
          Use official registered tourist drivers for long hauls.
        </div>
      </footer>
    </div>
  );
}

