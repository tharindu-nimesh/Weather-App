import { useState, useEffect, useRef } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const suggestionsRef = useRef(null);

  const API_KEY = "ac83661961c9d53f04a64bd3418f5773";

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch weather data for the city
  const handleSearch = async () => {
    if (!city) return;

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // Fetch city name suggestions
  const fetchCitySuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Suggestion error:", error);
      setSuggestions([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col items-center justify-center p-4 relative">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">
          <span className="inline-block animate-pulse">☁️</span> Weather App
        </h1>

        <div className="relative w-full mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for a city..."
            className="w-full pl-10 pr-16 py-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/90"
            value={city}
            onChange={(e) => {
              const value = e.target.value;
              setCity(value);
              fetchCitySuggestions(value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Search"
            )}
          </button>
        </div>

        {/* Display suggestions */}
        {suggestions.length > 0 && (
          <ul
            ref={suggestionsRef}
            className="bg-white rounded-lg shadow-lg mt-1 w-full text-left absolute z-10 max-h-60 overflow-y-auto transition-all duration-200 animate-fadeIn"
            style={{ width: "calc(100% - 3rem)", maxWidth: "24rem" }}
          >
            {suggestions.map((sugg, index) => (
              <li
                key={index}
                onClick={() => {
                  setCity(
                    `${sugg.name}${sugg.state ? ", " + sugg.state : ""}, ${
                      sugg.country
                    }`
                  );
                  setSuggestions([]);
                  handleSearch();
                }}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors duration-150"
              >
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  <span>
                    <span className="font-medium">{sugg.name}</span>
                    {sugg.state ? (
                      <span className="text-gray-600">, {sugg.state}</span>
                    ) : (
                      ""
                    )}
                    <span className="text-gray-500">, {sugg.country}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded animate-fadeIn">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {weather && (
          <div className="bg-white p-6 rounded-xl shadow-md text-center w-full animate-fadeIn transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {weather.name}, {weather.sys.country}
              </h2>
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center justify-center">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                alt={weather.weather[0].description}
                className="w-32 h-32 mr-4 animate-pulse"
              />
              <div className="text-left">
                <p className="text-6xl font-semibold text-blue-700">
                  {Math.round(weather.main.temp)}°C
                </p>
                <p className="text-xl text-gray-700 capitalize">
                  {weather.weather[0].description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 text-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-gray-500 text-sm">Feels Like</p>
                <p className="text-xl font-medium text-blue-800">
                  {Math.round(weather.main.feels_like)}°C
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-gray-500 text-sm">Humidity</p>
                <p className="text-xl font-medium text-blue-800">
                  {weather.main.humidity}%
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-gray-500 text-sm">Wind</p>
                <p className="text-xl font-medium text-blue-800">
                  {Math.round(weather.wind.speed)} m/s
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-gray-500 text-sm">Pressure</p>
                <p className="text-xl font-medium text-blue-800">
                  {weather.main.pressure} hPa
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
