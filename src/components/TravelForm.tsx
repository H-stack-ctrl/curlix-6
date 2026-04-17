import React, { useState } from 'react';
import { TravelPreferences, BudgetLevel } from '../types';
import { Plane, Compass } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onGenerate: (prefs: TravelPreferences) => void;
  isLoading: boolean;
}

const INTEREST_OPTIONS = ['Beach', 'Nature', 'Culture', 'Adventure', 'Wildlife'];

export default function TravelForm({ onGenerate, isLoading }: Props) {
  const [days, setDays] = useState<number>(3);
  const [budget, setBudget] = useState<BudgetLevel>('Medium');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<string>('');

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInterests.length === 0) {
      alert("Please select at least one interest");
      return;
    }
    onGenerate({
      days,
      budget,
      interests: selectedInterests,
      preferredDestinations: destinations
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-panel p-6"
    >
      <div className="flex items-center gap-2 mb-8 px-2 border-b border-glass-border pb-4">
        <Compass className="text-accent-green w-6 h-6" />
        <h2 className="text-lg font-bold uppercase tracking-tight">Setup Panel</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Days */}
        <div className="space-y-2">
          <label className="text-[11px] uppercase tracking-[1px] text-text-dim font-bold">
            Travel Days
          </label>
          <input
            type="number"
            min={1}
            max={30}
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="w-full bg-transparent text-text-main font-semibold py-2 border-b border-glass-border outline-none focus:border-accent-green transition-all"
            required
          />
        </div>

        {/* Budget */}
        <div className="space-y-3">
          <label className="text-[11px] uppercase tracking-[1px] text-text-dim font-bold">
            Budget Tier
          </label>
          <div className="grid grid-cols-1 gap-2">
            {(['Low', 'Medium', 'High'] as BudgetLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setBudget(level)}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all text-left ${
                  budget === level
                    ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/30'
                    : 'bg-glass text-text-dim border border-glass-border hover:border-text-dim'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-3">
          <label className="text-[11px] uppercase tracking-[1px] text-text-dim font-bold">
            Interests
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`tag-pill ${
                  selectedInterests.includes(interest)
                    ? 'tag-green'
                    : 'bg-glass border border-glass-border text-text-dim'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Destinations */}
        <div className="space-y-2">
          <label className="text-[11px] uppercase tracking-[1px] text-text-dim font-bold">
            Focus Region
          </label>
          <input
            type="text"
            placeholder="e.g. Ella, Sigiriya..."
            value={destinations}
            onChange={(e) => setDestinations(e.target.value)}
            className="w-full bg-transparent text-text-main font-semibold py-2 border-b border-glass-border outline-none focus:border-accent-green transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 rounded-xl bg-accent-green text-bg-dark text-sm font-extrabold uppercase tracking-widest shadow-lg hover:shadow-accent-green/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mt-4"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-bg-dark"></div>
          ) : (
            <>
              <Plane size={18} />
              Generate
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
