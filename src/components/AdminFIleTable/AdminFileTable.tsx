'use client'
import { Files } from '@/interfaces';
import React, { useEffect, useState } from 'react';
import { Loading } from '../Loading';
import { Badge } from '../Badge';

export default function DataTable() {
  const [data, setData] = useState<Files[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/asignedme');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className='w-full h-[450px] flex justify-center items-center'><Loading/></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Departamento</th>
            <th>Fecha</th>
            <th>Subido por</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <th>{index + 1}</th>
              <td>{item.name}</td>
              <td>{item.depar}</td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              <td>{item.uploadedBy.name}</td>
              <td><Badge content={item.status.toLocaleUpperCase()}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
