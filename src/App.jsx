import { useState } from "react";

function App() {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", city);
    // fetch weather here
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">Weather App</h1>

      <div className="flex gap-2">
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
    </div>
  );
}

export default App;
