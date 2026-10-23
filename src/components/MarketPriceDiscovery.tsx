import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  DollarSign, 
  Calculator, 
  Store, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Coins,
  BadgeCheck
} from 'lucide-react';

interface CommodityItem {
  name: string;
  unit: string;
  priceUsd: number;
  prevPriceUsd: number;
  demand: string;
  supply: string;
  trend: 'up' | 'down' | 'stable';
}

interface MarketHub {
  id: string;
  name: string;
  location: string;
  commodities: CommodityItem[];
}

interface MarketData {
  lastUpdated: string;
  usdToZigRate: number;
  markets: MarketHub[];
}

interface Props {
  currentLocationName: string;
}

export const MarketPriceDiscovery: React.FC<Props> = ({ currentLocationName }) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [currency, setCurrency] = useState<'USD' | 'ZiG'>('USD');
  const [selectedMarketId, setSelectedMarketId] = useState<string>('mbare-harare');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Selling Recommender Calculator States
  const [selectedProduce, setSelectedProduce] = useState<string>('Maize (White Grain)');
  const [quantity, setQuantity] = useState<number>(30); // e.g. 30 bags
  const [customDistanceKm, setCustomDistanceKm] = useState<number>(45); // distance to major city

  const fetchMarketPrices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/market/prices');
      const data = await res.json();
      if (data.success && data.data) {
        setMarketData(data.data);
        try {
          localStorage.setItem('farmers_cached_market_prices', JSON.stringify(data.data));
        } catch (e) {
          console.warn('Cache write error:', e);
        }
      }
    } catch (err) {
      console.warn('Network unavailable, attempting offline cache:', err);
      try {
        const cached = localStorage.getItem('farmers_cached_market_prices');
        if (cached) {
          setMarketData(JSON.parse(cached));
        }
      } catch (e) {
        console.warn('Cache read error:', e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketPrices();
  }, []);

  const rate = marketData?.usdToZigRate || 28.5;

  const formatPrice = (usd: number) => {
    if (currency === 'ZiG') {
      return `ZiG ${(usd * rate).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
    }
    return `$${usd.toFixed(2)}`;
  };

  const currentHub = marketData?.markets.find(m => m.id === selectedMarketId) || marketData?.markets[0];

  // Recommender Decision Calculation
  // Calculate 3 channels:
  // 1. Local Farmgate Village Buyer (85% of market price, $0 transport)
  // 2. Mbare Musika Wholesale (100% price, $1.50 per bag transport haulage + $0.50 levy)
  // 3. GMB Depot (Statutory $16.75/bag if grain, $0.80 depot haulage)
  const isGrain = selectedProduce.includes('Maize') || selectedProduce.includes('Sorghum') || selectedProduce.includes('Mhunga');
  
  // Base benchmark price per unit
  let basePriceUsd = 14.50;
  if (selectedProduce.includes('Tomatoes')) basePriceUsd = 18.00;
  if (selectedProduce.includes('Groundnuts')) basePriceUsd = 16.00;
  if (selectedProduce.includes('Cabbage')) basePriceUsd = 0.65;
  if (selectedProduce.includes('Goat')) basePriceUsd = 38.00;
  if (selectedProduce.includes('Chickens')) basePriceUsd = 6.00;

  // Farmgate
  const farmgatePriceUsd = basePriceUsd * 0.82;
  const farmgateGross = quantity * farmgatePriceUsd;
  const farmgateNet = farmgateGross;

  // City Central Market (Mbare / Renkini)
  const cityPriceUsd = basePriceUsd;
  const cityGross = quantity * cityPriceUsd;
  const estimatedTransportPerUnit = Math.max(0.60, (customDistanceKm * 0.035));
  const cityTransportTotal = quantity * estimatedTransportPerUnit;
  const cityMarketLevy = quantity * 0.40;
  const cityNet = cityGross - cityTransportTotal - cityMarketLevy;

  // Channel 3: GMB / Contract Processor
  const gmbUnitUsd = isGrain ? 16.75 : basePriceUsd * 0.95;
  const gmbGross = quantity * gmbUnitUsd;
  const gmbDepotTransport = quantity * 0.80;
  const gmbNet = gmbGross - gmbDepotTransport;

  // Optimal channel verdict
  let bestChannel = 'City Wholesale Market (Mbare / Renkini)';
  let bestNet = cityNet;
  let reason = `Maximizes take-home cash ($${cityNet.toFixed(2)}) after paying $${cityTransportTotal.toFixed(2)} transport.`;

  if (isGrain && gmbNet > cityNet) {
    bestChannel = 'GMB National Grain Depot';
    bestNet = gmbNet;
    reason = `GMB statutory floor price guarantees $${gmbNet.toFixed(2)} net with zero market entrance fee.`;
  } else if (farmgateNet > cityNet) {
    bestChannel = 'Local Farmgate Buyer (Village)';
    bestNet = farmgateNet;
    reason = `High transport distance (${customDistanceKm}km) makes haulage uneconomical. Farmgate avoids transport risks.`;
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold">
                📈
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Zimbabwe Real-Time Agro Market Price Discovery
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              Aggregated daily price indices from Mbare Musika, GMB National Depots, Bulawayo Renkini, and CC Sales Livestock Auctions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency Switcher */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  currency === 'USD'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('ZiG')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  currency === 'ZiG'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ZiG (Gold)
              </button>
            </div>

            <button
              onClick={fetchMarketPrices}
              className="p-2 text-slate-600 hover:text-emerald-700 rounded-lg hover:bg-slate-100 border border-slate-200 transition"
              title="Refresh Prices"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-700' : ''}`} />
            </button>
          </div>
        </div>

        {/* Currency Benchmark Badge */}
        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
          <Coins className="w-3.5 h-3.5 text-amber-600" />
          <span>Official Benchmark Rate: 1.00 USD = {rate.toFixed(2)} ZiG</span>
          <span className="text-slate-300">•</span>
          <span>Last MSD/Agritex sync: {marketData ? new Date(marketData.lastUpdated).toLocaleDateString() : 'Today'}</span>
        </div>
      </div>

      {/* Market Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {marketData?.markets.map((hub) => (
          <button
            key={hub.id}
            onClick={() => setSelectedMarketId(hub.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
              hub.id === selectedMarketId
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span>{hub.name}</span>
            <span className="text-[10px] font-normal opacity-75">({hub.location})</span>
          </button>
        ))}
      </div>

      {/* Active Market Prices Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-slate-900">
              {currentHub?.name}
            </h4>
            <span className="text-xs text-slate-500">
              Location: {currentHub?.location} • Daily smallholder trading bulletin
            </span>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
            Active Trading Today
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Commodity / Produce</th>
                <th className="p-3.5">Standard Trading Unit</th>
                <th className="p-3.5">Today's Price</th>
                <th className="p-3.5">24h Shift</th>
                <th className="p-3.5">Buyer Demand</th>
                <th className="p-3.5">Market Supply</th>
                <th className="p-3.5 text-right">Farmer Selling Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentHub?.commodities.map((item, idx) => {
                const diff = item.priceUsd - item.prevPriceUsd;
                const pct = ((diff / item.prevPriceUsd) * 100).toFixed(1);

                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-bold text-slate-900">
                      {item.name}
                    </td>
                    <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                      {item.unit}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-800 text-sm">
                      {formatPrice(item.priceUsd)}
                    </td>
                    <td className="p-3.5">
                      {item.trend === 'up' ? (
                        <span className="inline-flex items-center text-emerald-700 font-semibold gap-1">
                          <TrendingUp className="w-3.5 h-3.5" /> +{pct}%
                        </span>
                      ) : item.trend === 'down' ? (
                        <span className="inline-flex items-center text-rose-600 font-semibold gap-1">
                          <TrendingDown className="w-3.5 h-3.5" /> {pct}%
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-slate-400 gap-1 font-semibold">
                          <Minus className="w-3.5 h-3.5" /> Stable
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.demand.includes('Very High') || item.demand.includes('Critical')
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.demand.includes('High')
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.demand}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {item.supply}
                    </td>
                    <td className="p-3.5 text-right">
                      <span className={`font-semibold text-[11px] ${
                        item.trend === 'up' ? 'text-emerald-700' : 'text-slate-600'
                      }`}>
                        {item.trend === 'up' ? 'Hold / Sell Peak' : 'Sell Promptly'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selling Price Recommender Calculator */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-emerald-700" />
          <h4 className="font-bold text-base text-slate-900">
            Smart Selling Channel Recommender & Net Profit Calculator
          </h4>
        </div>
        <p className="text-xs text-slate-600 mb-5 max-w-3xl">
          Should you sell to local village traders at farmgate, deliver to statutory GMB depots, or hire haulage transport to wholesale markets (Mbare / Renkini)? Enter your volume and road distance to see the exact net in pocket.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Select Product to Sell
            </label>
            <select
              value={selectedProduce}
              onChange={(e) => setSelectedProduce(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Maize (White Grain)">White Grain Maize (50kg bags)</option>
              <option value="Tomatoes (Sandveld/Roma)">Tomatoes (30kg Wooden Crates)</option>
              <option value="Groundnuts / Nzungu (Shelled)">Groundnuts / Nzungu (20L Tins)</option>
              <option value="Sorghum / Mhunga">Sorghum / Mhunga (50kg bags)</option>
              <option value="Cabbage (Drumhead)">Cabbages (Heads)</option>
              <option value="Boer/Indigenous Goat (Live)">Live Goats (25-30kg)</option>
              <option value="Indigenous Chickens (Roadrunners)">Roadrunner Chickens</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Quantity / Volume
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Distance to Major Wholesale Market (km)
            </label>
            <input
              type="number"
              min={5}
              value={customDistanceKm}
              onChange={(e) => setCustomDistanceKm(Math.max(5, parseInt(e.target.value) || 5))}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* 3 Channels Comparison Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl mb-5">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Selling Channel</th>
                <th className="p-3">Selling Price / Unit</th>
                <th className="p-3">Gross Value</th>
                <th className="p-3">Transport & Levies</th>
                <th className="p-3 font-extrabold text-emerald-900">Net Realized Cash</th>
                <th className="p-3">Suitability Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Channel 1: Farmgate */}
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-800 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-slate-400" />
                  Farmgate (Local Village Buyer)
                </td>
                <td className="p-3 text-slate-600">{formatPrice(farmgatePriceUsd)}</td>
                <td className="p-3 font-semibold">{formatPrice(farmgateGross)}</td>
                <td className="p-3 text-emerald-700 font-semibold">$0.00 (Zero Transport)</td>
                <td className="p-3 font-bold text-slate-900 text-sm">
                  {formatPrice(farmgateNet)}
                </td>
                <td className="p-3 text-slate-500">
                  Zero transport hassle; lowest risk of perishability.
                </td>
              </tr>

              {/* Channel 2: City Wholesale Market */}
              <tr className="hover:bg-slate-50 bg-emerald-50/20">
                <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-700" />
                  Mbare Musika / Renkini Wholesale
                </td>
                <td className="p-3 text-slate-600">{formatPrice(cityPriceUsd)}</td>
                <td className="p-3 font-semibold">{formatPrice(cityGross)}</td>
                <td className="p-3 text-rose-600 font-medium">
                  -${formatPrice(cityTransportTotal + cityMarketLevy).replace('$', '').replace('ZiG ', '')} (Haulage + Levy)
                </td>
                <td className="p-3 font-bold text-emerald-800 text-sm">
                  {formatPrice(cityNet)}
                </td>
                <td className="p-3 font-semibold text-emerald-700">
                  High cash realization for bulk quality produce.
                </td>
              </tr>

              {/* Channel 3: GMB / Processor */}
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-800 flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                  GMB Grain Depot / Contract Processor
                </td>
                <td className="p-3 text-slate-600">{formatPrice(gmbUnitUsd)}</td>
                <td className="p-3 font-semibold">{formatPrice(gmbGross)}</td>
                <td className="p-3 text-rose-600 font-medium">
                  -${formatPrice(gmbDepotTransport).replace('$', '').replace('ZiG ', '')} (Depot Haulage)
                </td>
                <td className="p-3 font-bold text-slate-900 text-sm">
                  {formatPrice(gmbNet)}
                </td>
                <td className="p-3 text-slate-500">
                  {isGrain ? 'Statutory guaranteed floor buyer for white maize & small grains.' : 'Contract buyer pricing.'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Actionable Verdict Card */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 block mb-1">
              AI Market Recommendation Verdict
            </span>
            <div className="text-base font-extrabold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Recommended Destination: {bestChannel}
            </div>
            <p className="text-xs text-slate-200 mt-1 max-w-xl">
              {reason} Net earnings estimated at <span className="font-bold text-emerald-300">{formatPrice(bestNet)}</span>.
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-xl p-3 text-center shrink-0">
            <span className="text-[10px] text-slate-300 block">Net Expected Payout</span>
            <span className="text-lg font-black text-emerald-300">{formatPrice(bestNet)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
