export const formatCurrency = (amount: number, currencyCode: string = 'INR'): string => {
  const symbolMap: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  const symbol = symbolMap[currencyCode] || '₹';
  const formattedVal = Math.abs(amount).toLocaleString(currencyCode === 'INR' ? 'en-IN' : 'en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });

  return `${amount < 0 ? '-' : ''}${symbol}${formattedVal}`;
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatPercent = (val: number): string => {
  return `${val.toFixed(1)}%`;
};
