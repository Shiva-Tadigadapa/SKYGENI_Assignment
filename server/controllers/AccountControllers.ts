import { Request, Response } from 'express'; // Importing Request and Response types from Express
import { promises as fs } from 'fs'; // Importing promises API from 'fs' module for file system operations
import path from 'path'; // Importing path module to handle and transform file paths

// Define a type for the account industry data
interface AccountIndustryData {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  Acct_Industry: string;
  query_key: string;
}

// Function to handle the request for account industry data
export const getAccountIndustryData = async (req: Request, res: Response): Promise<void> => {
  // Construct the file path to the Account_Industry.json file
  const filePath = path.join(__dirname, '../data/Account_Industry.json');
  console.log(filePath); // Log the file path for debugging purposes

  try {
    // Read the JSON file asynchronously
    const data = await fs.readFile(filePath, 'utf-8');
    
    // Parse the JSON data into an array of AccountIndustryData objects
    const parsedData: AccountIndustryData[] = JSON.parse(data);
    
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
