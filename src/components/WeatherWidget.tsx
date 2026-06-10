import React, { useEffect, useState } from 'react';
import { Wind, Droplets, Thermometer } from 'lucide-react';

interface WeatherData {
  temperature: number;
  windspeed: number;
  humidity: number;
  weathercode: number;
  is_day: number;
}

interface WeatherWidgetProps {
  lat: number;
  lon: number;
}

const getWeatherIcon = (code: number, isDay: boolean) => {
  // WMO Weather interpretation codes
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  if (code <= 99) return '⛈️';
  return '🌤️';
};

const getWeatherDescription = (code: number) => {
  const descriptions: Record<number, string> = {
    0: 'Bezchmurnie',
    1: 'Głównie bezchmurnie',
    2: 'Częściowe zachmurzenie',
    3: 'Pochmurno',
    45: 'Mgła',
    48: 'Mgła z szadzią',
    51: 'Lekka mżawka',
    53: 'Umiarkowana mżawka',
    55: 'Gęsta mżawka',
    61: 'Lekki deszcz',
    63: 'Umiarkowany deszcz',
    65: 'Silny deszcz',
    71: 'Lekki śnieg',
    73: 'Umiarkowany śnieg',
    75: 'Silny śnieg',
    80: 'Przelotny deszcz',
    81: 'Umiarkowany przelotny deszcz',
    82: 'Gwałtowny przelotny deszcz',
    95: 'Burza',
    96: 'Burza z gradem',
    99: 'Silna burza z gradem',
  };
  return descriptions[code] || 'Nieznane warunki';
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ lat, lon }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // OpenMeteo API - darmowe, bez klucza API
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m&timezone=auto`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Błąd pobierania pogody');

        const data = await response.json();
        
        setWeather({
          temperature: data.current_weather.temperature,
          windspeed: data.current_weather.windspeed,
          humidity: data.hourly.relativehumidity_2m[0],
          weathercode: data.current_weather.weathercode,
          is_day: data.current_weather.is_day,
        });
      } catch (err: any) {
        console.error('Weather fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon]);

  if (loading) {
    return (
      <div className="bg-gray-900/60 border border-gray-800/60 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-500">Ładowanie pogody...</span>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return null; // Nie pokazuj błędu, po prostu ukryj widget
  }

  return (
    <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-500/30 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getWeatherIcon(weather.weathercode, weather.is_day === 1)}</span>
          <div>
            <div className="text-xs font-semibold text-gray-300">Pogoda w miejscu zdarzenia</div>
            <div className="text-xs text-gray-500">{getWeatherDescription(weather.weathercode)}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-300">{Math.round(weather.temperature)}°C</div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Wind className="w-3.5 h-3.5 text-blue-400" />
          <span>{Math.round(weather.windspeed)} km/h</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Thermometer className="w-3.5 h-3.5 text-orange-400" />
          <span>Odczuwalna</span>
        </div>
      </div>
    </div>
  );
};
