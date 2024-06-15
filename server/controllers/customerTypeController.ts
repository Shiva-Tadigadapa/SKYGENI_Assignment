import { Request, Response } from 'express'; // Importing Request and Response types from Express
import { promises as fs } from 'fs'; // Importing promises API from 'fs' module for file system operations
import path from 'path'; // Importing path module to handle and transform file paths

// Define a type for the customer type data
interface CustomerTypeData {
  customerId: string;
  customerName: string;
  customerType: string;
  // Define other properties as needed
}

// Function to handle the request for customer type data
export const getCustomerTypeData = async (req: Request, res: Response): Promise<void> => {
  // Construct the file path to the Customer_Type.json file
  const filePath = path.join(__dirname, '../data/Customer_Type.json');

  try {
    // Read the JSON file asynchronously
    const data = await fs.readFile(filePath, 'utf-8');
    
    // Parse the JSON data into an array of CustomerTypeData objects
    const parsedData: CustomerTypeData[] = JSON.parse(data);
    
    // Check if the parsed data is an array
    if (Array.isArray(parsedData)) {
      // Send the parsed data as a JSON response
      res.json(parsedData);
    } else {
      // Send an error response if the data format is invalid
      res.status(500).json({ error: 'Invalid data format' });
    }
  } catch (error) {
    // Log the error if there is an issue reading the file
    console.error('Error reading file:', error);
    
    // Send an error response if reading the file fails
    res.status(500).json({ error: 'Failed to read data' });
  }
};
