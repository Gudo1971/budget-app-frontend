import Papa from "papaparse";

export type CsvRow = {
  date: string;
  description: string;
  amount: number;
};

export function parseCsv(file: File): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as any[];

        const transactions = rows.map((row) => ({
          date: row.date || row.Date || "",
          description: row.description || row.Description || "",
          amount: Number(row.amount || row.Amount || 0),
        }));

        resolve(transactions);
      },
      error: reject,
    });
  });
}
