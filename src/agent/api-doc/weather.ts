export const OPEN_METEO_DOCS = `
API Name: Open-Meteo Weather API
Base URL: https://api.open-meteo.com/v1/forecast

Parameters:
- latitude (required): float, latitude coordinate (-90 to 90)
- longitude (required): float, longitude coordinate (-180 to 180)  
- current_weather (optional): boolean, include current weather data

Example usage:
To get weather for Beijing: latitude=39.9042, longitude=116.4074, current_weather=true
To get weather for Shanghai: latitude=31.2304, longitude=121.4737, current_weather=true
`;
