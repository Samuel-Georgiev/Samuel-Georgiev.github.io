# Financial Dashboard API Setup Guide - Finnhub Troubleshooting

Your financial dashboard supports real-time data from Finnhub API! Here's how to fix common issues.

## � Finnhub API Issues & Solutions

### Issue 1: Invalid API Key
**Problem**: Getting 401 errors or "Forbidden" responses
**Solution**: 
1. Go to https://finnhub.io/register
2. Create a free account
3. Get your API key from the dashboard
4. Replace `YOUR_ACTUAL_FINNHUB_API_KEY` in app.js with your real key

### Issue 2: CORS Errors (Browser Console)
**Problem**: "CORS policy" errors in browser console
**Solutions**:
- Use a simple HTTP server instead of opening file directly
- Try: `python -m http.server 8000` or use Live Server extension
- Finnhub free tier has some CORS limitations

### Issue 3: Premium Endpoint Access
**Problem**: 403 errors for historical data (candles)
**Solution**: The `/stock/candle` endpoint requires Premium subscription
- Free tier only gets basic quote data
- Historical charts will use demo data until Premium upgrade

### Issue 4: Rate Limiting
**Problem**: 429 "Too Many Requests" errors
**Solution**: Free tier allows 60 requests/minute
- Code already implements 1-second delays
- Avoid rapid page refreshes

## 🚀 Quick Setup for Finnhub

### Step 1: Get API Key
- Visit: https://finnhub.io/register
- Sign up for free (no credit card required)
- Copy your API key from dashboard

### Step 2: Update Code
- Open `app.js`
- Find line ~143: `key: 'YOUR_ACTUAL_FINNHUB_API_KEY'`
- Replace with your real API key:

```javascript
{
    name: 'Finnhub',
    key: 'your_real_api_key_here', // ← Your actual key
    baseUrl: 'https://finnhub.io/api/v1',
    rateLimit: 60,
    enabled: true
}
```

### Step 3: Test
- Open browser developer tools (F12)
- Look for console logs starting with "🔍 DEBUG:"
- Should see "✅ Real market data loaded successfully from Finnhub"

## 📊 What Works with Free Tier

✅ **Available**:
- Real-time stock quotes (`/quote` endpoint)
- Current price, change, change %
- Basic company info

❌ **Premium Only**:
- Historical candlestick data (`/stock/candle`)
- Advanced technical indicators
- Extended market data

## 🐛 Debugging Steps

1. **Check Console**: Open F12 → Console tab
2. **Look for Errors**: Search for "Finnhub error" or "❌" messages
3. **Verify API Key**: Should not be 'demo' or placeholder
4. **Check Network Tab**: Look for 401/403/429 HTTP status codes
5. **Test API Direct**: Try https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_KEY

## 🔄 Fallback System

If Finnhub fails, the dashboard will:
1. Try Alpha Vantage API (if configured)
2. Fall back to demo data
3. Continue working with simulated data

## 🎯 Supported Symbols

The dashboard currently tracks:
- `^GSPC` - S&P 500 Index (mapped to SPY ETF for APIs)
- `^IXIC` - Nasdaq Composite (mapped to QQQ ETF)
- `^NYA` - NYSE Composite (mapped to VTI ETF)

## 🔒 API Limits (Free Tiers)

- **Alpha Vantage**: 5 requests/minute, 500/day
- **Finnhub**: 60 requests/minute
- **Twelve Data**: 8 requests/minute, 800/day

## 🛠️ Customization

To add more stocks/indices:
1. Add new `.market-card` elements in your HTML
2. Set `data-symbol` attribute to the stock symbol
3. The dashboard will automatically fetch data for new symbols

## ⚡ Performance Tips

- The dashboard updates every 60 seconds to respect rate limits
- Uses smart caching to minimize API calls
- Automatically switches to fastest available API
- Demo data is used as fallback when APIs are unavailable

## 🎨 Visual Features

- Real-time price updates with color coding
- Animated mini-charts showing price trends
- Loading states and update animations
- API status indicator (auto-hides after 10 seconds)
- Mobile-responsive design

## 🐛 Troubleshooting

If you see demo data instead of real data:
1. Check your API keys are correctly entered
2. Verify your API quotas aren't exceeded
3. Check browser console for error messages
4. Ensure you have an internet connection

The dashboard will show which API is currently being used in the console logs.

---

**Enjoy your real-time financial dashboard! 📈**
