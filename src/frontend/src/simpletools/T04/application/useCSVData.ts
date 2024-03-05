import {useEffect, useState} from 'react';
import Papa from 'papaparse';

const fetchCsvData = async (resource: string) => {
  const response = await fetch(resource);
  if (!response.ok || null === response.body) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body.getReader();
  const result = await reader.read();
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(result.value);
};

const useCSVData = (resource: string) => {
  const [data, setData] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const csvData = await fetchCsvData(resource);
        Papa.parse(csvData, {
          delimiter: ',',
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true,
          complete: (parsedObject: any): void => {
            setData(parsedObject.data as []);
          },
        });
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [resource]);


  return {data, loading, error};
};

export default useCSVData;
