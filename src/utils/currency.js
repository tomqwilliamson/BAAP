export const formatCurrency = (amount, options = {}) => {
  const {
    currency = 'USD',
    locale = 'en-US',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
  } = options;

  if (typeof amount === 'string') {
    amount = parseFloat(amount.replace(/[^\d.-]/g, ''));
  }

  if (isNaN(amount)) {
    return '$0.00';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits
  }).format(amount);
};

export const formatCompactCurrency = (amount, options = {}) => {
  const { locale = 'en-US' } = options;
  
  if (typeof amount === 'string') {
    amount = parseFloat(amount.replace(/[^\d.-]/g, ''));
  }

  if (isNaN(amount)) {
    return '$0';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    compactDisplay: 'short'
  }).format(amount);
};