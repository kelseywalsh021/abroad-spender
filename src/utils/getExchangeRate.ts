export async function getExchangeRateToUSD(currency: string): Promise<number> {
    if (currency === 'USD') return 1;
  
    const cache = localStorage.getItem('exchangeRates');
    const rates = cache ? JSON.parse(cache) : {};
  
    if (rates[currency]) {
      return rates[currency];
    }
  
    try {
      const response = await fetch(`https://api.exchangerate.host/convert?from=${currency}&to=USD&amount=1`);
      const data = await response.json();
  
      if (data.success && data.result != null) {
        const rate = data.result;
        rates[currency] = rate;
        localStorage.setItem('exchangeRates', JSON.stringify(rates));
        return rate;
      } else {
        console.error("Failed to fetch exchange rate.");
        return 1;
      }
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      return 1;
    }
  }