import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';

// Define a type for the customer type data
interface CustomerTypeData {
  customerId: string;
  customerName: string;
  customerType: string;
  // Define other properties as needed
}

export const getCustomerTypeData = async (req: Request, res: Response): Promise<void> => {
  const filePath = path.join(__dirname, '../data/Customer_Type.json');

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const parsedData: CustomerTypeData[] = JSON.parse(data);
    if (Array.isArray(parsedData)) {
        res.json(parsedData);
    } else {
      res.status(500).json({ error: 'Invalid data format' });
    }
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read data' });
  }
};
