import React from 'react';
import { Wheat, Sun, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Native Delta Seeds & Organic Farming',
    subtitle: 'Cultivated in Kaveri Delta, Kumbakonam',
    description: 'We source indigenous traditional paddy and millet varieties directly from organic farmers of Kumbakonam without chemical fertilizers or GMO seeds.',
    icon: Wheat,
    color: 'bg-[#e7f4e8] text-[#007600]'
  },
  {
    step: '02',
    title: 'Traditional Natural Sun-Drying',
    subtitle: 'Preserving Natural Nutrients',
    description: 'Harvested grains are naturally sun-dried in open yards to retain original aroma, vital minerals, natural oil content, and high dietary fiber.',
    icon: Sun,
    color: 'bg-amber-50 text-amber-800'
  },
  {
    step: '03',
    title: 'Hygienic Chemical-Free Packaging',
    subtitle: 'Zero Preservatives or Artificial Colors',
    description: 'Cleaned and packed under hygienic quality standards in eco-friendly protective packaging to ensure maximum freshness and long shelf life.',
    icon: ShieldCheck,
    color: 'bg-[#c6f3ed] text-[#0f1111]'
  },
  {
    step: '04',
    title: 'Direct to Customer Delivery',
    subtitle: 'Authentic Flavor & Uncompromising Purity',
    description: 'Shipped straight from our Kumbakonam store directly to your doorstep with guaranteed purity, fair price to farmers, and 100% transparency.',
    icon: HeartHandshake,
    color: 'bg-rose-50 text-rose-800'
  }
];

export default function ProcessSection() {
  return (
    <section id="organic-process" className="max-w-7xl mx-auto px-3 py-8 md:px-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-8 shadow-xs">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1 bg-[#e7f4e8] text-[#007600] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-[#007600]/20">
            <Sparkles className="w-3.5 h-3.5 fill-[#007600]" />
            Our Organic Promise
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0f1111] tracking-tight font-['Inter']">
            From Kaveri Delta Fields to Your Kitchen
          </h2>
          <p className="text-xs sm:text-sm text-[#565959] mt-2 leading-relaxed">
            Discover how Sakthi Foods preserves traditional South Indian heritage rice, unpolished millets, and health mixes through authentic organic practices.
          </p>
        </div>

        {/* Process Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROCESS_STEPS.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.step}
                className="bg-[#f7f8f8] rounded-xl p-5 border border-gray-200 hover:border-[#87d8d2] transition-all hover:shadow-md flex flex-col justify-between relative group"
              >
                <span className="absolute top-4 right-4 text-2xl font-black text-gray-300 group-hover:text-[#007600]/30 transition-colors font-['Inter']">
                  {item.step}
                </span>

                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <h3 className="text-sm font-extrabold text-[#0f1111] font-['Inter'] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] font-bold text-[#565959] mt-0.5 mb-2">
                    {item.subtitle}
                  </p>
                  <p className="text-xs text-[#565959] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 flex items-center gap-1.5 text-[11px] font-bold text-[#007600]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified 100% Organic</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
