# Kenya Weather Intelligence Dashboard

A responsive React dashboard for Kenyan weather powered by Open-Meteo API. Features intelligent agricultural advisory, crop recommendations, and pest risk assessment based on real-time weather data.

## Features

- County-based weather selection with searchable dropdown
- Auto location weather detection using browser geolocation
- Current weather card with temperature, humidity, wind and feels-like details
- 7-day forecast cards
- Scrollable hourly forecast for the current day
- AI weather insight card
- Agricultural advisory with crop recommendations
- Pest risk level assessment
- Soil moisture indicators
- Dark/light theme toggle
- Fully responsive design (mobile, tablet, desktop)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/tonny1theetechie/weather-ai-dashboard.git
   cd weather-ai-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Note: This project uses Open-Meteo API which is free and requires no API key by default.

4. Start the app:
   ```bash
   npm start
   ```

The app will open at `http://localhost:3000`

## Project Structure

```
src/
├── App.js                    # Main app logic and state
├── App.css                   # Global styles and responsive design
├── api/
│   └── weatherService.js     # Weather API integration
├── components/
│   ├── SearchBar.jsx         # County selection dropdown
│   ├── CurrentWeather.jsx    # Current weather display
│   ├── ForecastCard.jsx      # Daily forecast card
│   ├── HourlyForecast.jsx    # Hourly forecast scroll
│   ├── AISummary.jsx         # AI-generated weather summary
│   ├── AgriculturalAdvisory.jsx # Crop & farming recommendations
│   └── Loader.jsx            # Loading spinner
└── data/
    ├── kenyaCounties.js      # County list data
    └── agriculturalData.js   # Crop data and agricultural logic
```

## Features in Detail

### Agricultural Advisory
- Real-time crop suitability scoring
- Soil moisture assessment
- Pest risk level prediction
- Farming recommendations based on weather conditions
- Supports 8 major Kenyan crops: Maize, Beans, Tea, Coffee, Wheat, Tomatoes, Potatoes, Cabbage

### Responsive Design
- Optimized for mobile (320px+), tablet, and desktop
- Touch-friendly dropdowns and buttons
- Adaptive grid layouts

### Theme Support
- Dark mode (default)
- Light mode toggle

## Deployment

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit: Weather AI Dashboard"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the Create React App settings

3. **Configure Environment Variables:**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add: `REACT_APP_WEATHER_API_KEY` (if using a paid weather API)
   - The default Open-Meteo API needs no key

4. **Deploy:**
   - Vercel will automatically build and deploy on every push to `main`
   - Your app will be live at: `https://your-project.vercel.app`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_WEATHER_API_KEY=your_api_key_here
```

Supported APIs:
- **Open-Meteo** (Free, no key required) - Currently used
- **WeatherAPI** (Free tier available)
- **Weather.com** (API integration available)

## GitHub Setup

1. **Initialize Git (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/weather-ai-dashboard.git
   git push -u origin main
   ```

2. **Protection Rules (Optional):**
   - Go to Settings → Branches → Branch Protection Rules
   - Protect `main` branch to require pull request reviews before merge

3. **.gitignore is already configured** to exclude:
   - `node_modules/`
   - `.env` (sensitive API keys)
   - Build artifacts
   - OS-specific files

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Production build: ~45 KB (gzipped)
- Fast initial load with code splitting
- Optimized images and CSS
- Responsive images for different screen sizes

## Troubleshooting

### Geolocation Not Working
- Ensure HTTPS is enabled (required for geolocation)
- Check browser permissions
- Falls back to IP-based location on mobile

### API Rate Limiting
- Open-Meteo: 10,000 requests/day free tier
- Upgrade to premium for higher limits

### Build Errors
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check Node version: requires Node 14+

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Email: support@weatherdashboard.app

## Roadmap

- [ ] Multiple location bookmarks
- [ ] Weather alerts and notifications
- [ ] Historical weather data
- [ ] Export weather reports
- [ ] Integration with agricultural APIs
- [ ] Multi-language support (Swahili, etc.)
- [ ] PWA (Progressive Web App) support
- [ ] iOS/Android native apps

## Acknowledgments

- Weather data powered by Open-Meteo
- Inspired by agricultural needs in Kenya
- Built with React and modern web technologies

Then deploy the `build/` folder to your hosting platform.
