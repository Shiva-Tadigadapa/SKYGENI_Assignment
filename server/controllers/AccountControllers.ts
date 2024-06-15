import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';

// Define a type for the account industry data
interface AccountIndustryData {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  Acct_Industry: string;
  query_key: string;
}

export const getAccountIndustryData = async (req: Request, res: Response): Promise<void> => {
  const filePath = path.join(__dirname, '../data/Account_Industry.json');
  console.log(filePath)

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const parsedData: AccountIndustryData[] = JSON.parse(data);
    console.log(parsedData.every(isValidAccountIndustryData))
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

const isValidAccountIndustryData = (data: any): data is AccountIndustryData => {
  return (
    typeof data.count === 'number' &&
    typeof data.acv === 'number' &&
    typeof data.closed_fiscal_quarter === 'string' &&
    typeof data.Acct_Industry === 'string' &&
    typeof data.query_key === 'string'
  );
};
