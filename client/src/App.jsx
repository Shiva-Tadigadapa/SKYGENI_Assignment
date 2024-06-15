import React, { useEffect, useState } from "react";
import BarChart from "./components/BarChart";
import PieChart from "./components/DonutChart";
import TableDetails from "./components/TableDetails";
import axios from "axios";
import { Toaster, toast } from "sonner";

const App = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      toast("Waking up the server...", { duration: 0, id: "server-wakeup" });

      const response = await axios.get("https://skygeni-assignment.onrender.com/api/customer");

      toast.dismiss("server-wakeup");
      toast.success("Server woke up! Data fetched successfully.");

      setData(response.data);
      console.log(response);
    } catch (error) {
      toast.dismiss("server-wakeup");
      toast.error("Failed to fetch data.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sonnerPromise = () =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ name: "Sonner" }), 2000)
    );

  const handleSonnerPromise = () => {
    toast.promise(sonnerPromise, {
      loading: "Loading...",
      success: (data) => `${data.name} toast has been added`,
      error: "Error",
    });
  };

  return (
    <div className="justify-between p-20 h-screen w-full flex-col gap-20 flex items-center">
      <Toaster richColors position="top-center" />
      <h1 className="text-2xl font-semibold -mt-10">
        Won ACV mix by Cust Type
      </h1>
      <div className="flex">
        <div>
          <h1>Bar Chart with D3.js and React</h1>
          <BarChart data={data} />
        </div>
        <div>
          <h1>Pie Chart with D3.js and React</h1>
          <PieChart data={data} />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h1>Table Details</h1>
        <TableDetails data={data} />
      </div>
    </div>
  );
};

export default App;
