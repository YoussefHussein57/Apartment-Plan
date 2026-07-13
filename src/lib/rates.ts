const TROY_OUNCE_GRAMS = 31.1034768;

export interface LiveRates {
  usdToEgp: number;
  eurToEgp: number;
  goldEgp21kPerGram: number;
  goldEgp24kPerGram: number;
  fetchedAt: Date;
}

export async function fetchLiveRates(): Promise<LiveRates> {
  const [fxRes, goldRes] = await Promise.all([
    fetch('https://open.er-api.com/v6/latest/USD'),
    fetch('https://api.gold-api.com/price/XAU'),
  ]);

  if (!fxRes.ok || !goldRes.ok) throw new Error('تعذر جلب الأسعار الحالية');

  const fx = await fxRes.json();
  const gold = await goldRes.json();

  const usdToEgp: number | undefined = fx?.rates?.EGP;
  const eurPerUsd: number | undefined = fx?.rates?.EUR;
  const goldUsdPerOunce: number | undefined = gold?.price;

  if (!usdToEgp || !eurPerUsd || !goldUsdPerOunce) throw new Error('استجابة غير متوقعة من مزوّد الأسعار');

  const eurToEgp = usdToEgp / eurPerUsd;
  const goldUsdPerGram24k = goldUsdPerOunce / TROY_OUNCE_GRAMS;
  const goldEgp24kPerGram = goldUsdPerGram24k * usdToEgp;
  const goldEgp21kPerGram = goldEgp24kPerGram * (21 / 24);

  return { usdToEgp, eurToEgp, goldEgp21kPerGram, goldEgp24kPerGram, fetchedAt: new Date() };
}
