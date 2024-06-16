import React, { useEffect, useState } from "react";
import BarChart from "./components/BarChart";
import PieChart from "./components/DonutChart";
import TableDetails from "./components/TableDetails";
import { Toaster, toast } from "sonner";
import { useRef } from "react";

const App = () => {
  // State to store the fetched data
  const [data, setData] = useState([]);
  
  // useRef to track if data has been fetched to prevent multiple fetches
  const hasFetched = useRef(false);

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    // Function to wake up the server and fetch data
    const wakeUpServer = async () => {
      return new Promise((resolve, reject) => {
        // Fetch data from the server
        fetch(`https://skygeni-assignment.onrender.com/api/customer`)
          .then(response => {
            // Check if the response is ok (status in the range 200-299)
            if (!response.ok) {
              throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            // Check the content type of the response
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              return response.json();
            } else {
              return response.text(); // Handle non-JSON response as text
            }
          })
          .then(data => {
            // Log the fetched data
            console.log('Fetch succeeded:', data);
            // Set the fetched data to the state
            setData(data);
            // Resolve the promise with the fetched data
            resolve(data);
          })
          .catch(error => {
            // Log any errors during the fetch
            console.error('Fetch failed:', error);
            // Reject the promise with the error
            reject(error);
          });
      });
    };

    // Fetch data only if it hasn't been fetched before
    if (!hasFetched.current) {
      hasFetched.current = true;
      const fetchPromise = wakeUpServer();
      
      // Display toast notifications while fetching data
      toast.promise(fetchPromise, {
        loading: 'Waking up server...',
        success: (data) => {
          // Display success message based on the fetched data
          if (typeof data === 'object') {
            return `${data.message || 'Server'} is awake!`;
          } else {
            return `${data} is awake!`; 
          }
        },
        error: (error) => {
          // Display error message in case of failure
          console.log('Toast error handler error:', error);
          return `Error waking up server: ${error.message || error}`;
        },
      });
    }
  }, []);

  return (
    <div className="justify-between p-20 h-screen w-full flex-col gap-20 flex items-center">
      {/* Toaster component for displaying notifications */}
      <Toaster richColors position="top-center" />
      <h1 className="text-2xl font-semibold -mt-10">
        Won ACV mix by Cust Type
      </h1>
      <div className="flex">
        <div>
          <h1>Bar Chart with D3.js and React</h1>
          {/* Bar chart component to display data */}
          <BarChart data={data} />
        </div>
        <div>
          <h1>Pie Chart with D3.js and React</h1>
          {/* Pie chart component to display data */}
          <PieChart data={data} />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h1>Table Details</h1>
        {/* Table details component to display data */}
        <TableDetails data={data} />
      </div>
    </div>
  );
};

export default App;
