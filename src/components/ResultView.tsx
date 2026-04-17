import { TravelPlanResponse } from '../types';
import { motion } from 'motion/react';
import { Map, MapPin, Info, DollarSign, Compass } from 'lucide-react';

interface Props {
  plan: TravelPlanResponse;
}

export default function ResultView({ plan }: Props) {
  return (
    <div className="space-y-12 pb-20">
      {/* 1. Recommendations */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <Map className="text-brand-olive w-8 h-8" />
          <h2 className="text-3xl font-semibold">Recommended Destinations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plan.destinations.map((dest, idx) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="organic-card p-6 border-t-4 border-t-brand-olive"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{dest.name}</h3>
                <span className="text-xs font-semibold px-2 py-1 bg-brand-cream rounded-full uppercase tracking-tighter">
                  {dest.category}
                </span>
              </div>
              <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                {dest.description}
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-brand-olive uppercase tracking-wide">
                <DollarSign size={14} />
                Cost: {dest.budgetLevel}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 2. Itinerary */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <Compass className="text-brand-olive w-8 h-8" />
          <h2 className="text-3xl font-semibold">Daily Itinerary</h2>
        </div>
        <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-8 before:w-px before:bg-brand-sand">
          {plan.itinerary.map((day, idx) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative pl-20"
            >
              <div className="absolute left-0 top-0 w-16 h-16 rounded-full bg-white border-2 border-brand-olive flex items-center justify-center font-serif text-2xl font-bold shadow-sm z-10">
                {day.day}
              </div>
              <div className="organic-card p-8">
                <div className="flex items-center gap-2 mb-4 text-brand-olive">
                  <MapPin size={18} />
                  <h3 className="text-xl font-bold tracking-tight">{day.location}</h3>
                </div>
                <ul className="space-y-3 mb-6">
                  {day.activities.map((activity, i) => (
                    <li key={i} className="flex gap-3 text-neutral-700">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-olive shrink-0" />
                      {activity}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-brand-sand flex justify-between items-center text-sm font-medium">
                  <span className="text-neutral-500 uppercase tracking-widest text-xs">Estimated Daily Spend</span>
                  <span className="text-brand-olive">{day.estimatedCost}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Budget Summary */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="organic-card p-8 bg-brand-olive text-white shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-8 h-8" />
            <h2 className="text-2xl font-semibold serif-title">Budget Allocation</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/20 pb-2">
              <span className="text-white/70">Transport</span>
              <span className="font-medium">{plan.budgetSummary.transport}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/20 pb-2">
              <span className="text-white/70">Accommodation</span>
              <span className="font-medium">{plan.budgetSummary.accommodation}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/20 pb-2">
              <span className="text-white/70">Food & Misc</span>
              <span className="font-medium">{plan.budgetSummary.food}</span>
            </div>
            <div className="flex justify-between items-center pt-2 text-xl font-bold">
              <span>Total Estimated Cost</span>
              <span>{plan.budgetSummary.total}</span>
            </div>
          </div>
        </div>

        {/* 4. Travel Tips */}
        <div className="organic-card p-8">
          <div className="flex items-center gap-3 mb-6 text-brand-olive">
            <Info className="w-8 h-8" />
            <h2 className="text-2xl font-semibold">Essential Tips</h2>
          </div>
          <div className="space-y-4">
            {plan.travelTips.map((tip, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="w-8 h-8 rounded-full bg-brand-cream flex items-center justify-center shrink-0 group-hover:bg-brand-olive group-hover:text-white transition-colors">
                  <span className="text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed italic border-b border-neutral-100 pb-2 w-full">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
