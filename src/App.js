import "./App.css";
import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import Papa from "papaparse";

import { Model } from "./assets/Model";

function App() {
  const [data, setData] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("Select All");
  const [selectedKPI, setSelectedKPI] = useState("CO2"); // Default KPI
  const [kpiValue, setKpiValue] = useState(0);

  // Load data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/iaq_preprocessed.csv");
        const text = await response.text();
        const parsedData = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        }).data;
        // Process data: extract CO2 values and month
        const dataWithMonths = parsedData.map((row) => {
          const date = new Date(row.start_time); // Ensure the date field exists and is valid
          return {
            co2: parseInt(row.co2),
            humidity: parseInt(row.humidity),
            temperature: parseInt(row.temp),
            occupancy: parseInt(row.Occupancy),
            month: date.toLocaleString("default", { month: "long" }), // Extract month name
            rowDate: row.date,
          };
        });

        const uniqueMonths = [
          "Select All",
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ]; // get unique months

        setData(dataWithMonths);
        setMonths(uniqueMonths);
      } catch (error) {
        console.log("Error in fetchData", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) updateKpiValue();
  }, [data, selectedMonth, selectedKPI]);

  const updateKpiValue = () => {
    const filteredData =
      selectedMonth === "Select All"
        ? data
        : data.filter((row) => row.month === selectedMonth);
    const avgValue =
    filteredData.reduce((sum, row) => {
      const value = row[selectedKPI.toLowerCase()];
      return sum + (value !== "" && !isNaN(value) ? parseFloat(value) : 0);
    }, 0) / filteredData.length;
    
    setKpiValue(avgValue || 0);
  };

  return (
    <div className="App">
      <div className="kpi-selector">
        {["CO2", "Humidity", "Temperature", "Occupancy"].map((kpi) => (
          <button
            key={kpi}
            className={`tile ${selectedKPI === kpi ? "active" : ""}`}
            onClick={() => setSelectedKPI(kpi)}
          >
            {kpi}
          </button>
        ))}
      </div>
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="month-dropdown"
      >
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
      <Canvas camera={{ fov: 18 }}>
        <ambientLight intensity={1.25} />
        <Suspense fallback={null}>
          <Model kpi={selectedKPI} value={kpiValue} />
        </Suspense>
        <Environment preset="sunset" />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
