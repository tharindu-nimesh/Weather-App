import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const API_KEY = "ac83661961c9d53f04a64bd3418f5773";

  const handleSearch = async () => {
    if (!city) return;

    try {
      setError("");
      setWeather(null);

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "City not found");
        return;
      }

      setWeather(data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">Weather App</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter city"
          className="px-4 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-600 font-medium mb-2">{error}</p>}

      {weather && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center w-80">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {weather.name}, {weather.sys.country}
          </h2>
          <p className="text-5xl font-semibold text-blue-700">
            {Math.round(weather.main.temp)}°C
          </p>
          <p className="text-lg text-gray-700 mt-2 capitalize">
            {weather.weather[0].description}
          </p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className="mx-auto mt-2"
          />
        </div>
      )}
    </div>
  );
}

export default App;
