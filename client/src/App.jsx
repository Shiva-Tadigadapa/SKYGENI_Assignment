import React, { useEffect, useState } from "react";
import BarChart from "./components/BarChart";
import PieChart from "./components/DonutChart";
// import data from "./Customer_Type.json"; // Import your JSON data
import axios from "axios";

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/customer");
        setData(response.data);
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className=" justify-between p-20 h-screen w-full  flex items-center">
      <div>
        <h1>Bar Chart with D3.js and React</h1>
        <BarChart data={data} />
      </div>
      <div>
        <h1>Pie Chart with D3.js and React</h1>
        <PieChart data={data} />
      </div>
    </div>
  );
};

export default App;
