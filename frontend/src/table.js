import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function BasicTable({ data }) {
    // Check if data is a string and convert to an array if needed
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (error) {
        console.error('Failed to parse data:', error);
        return <p>Invalid data format</p>;
      }
    }
  
    // Ensure data is an array
    if (!Array.isArray(data) || data.length === 0) {
      return <p>No data available</p>;
    }
  
    const keys = Object.keys(data[0]); // Get keys from the first item object
  
    return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {keys.map((key) => (
                  <TableCell 
                    key={key} 
                    sx={{ 
                      fontWeight: 'bold', 
                      backgroundColor: '#007bff', 
                      color: '#fff', 
                      padding: '10px', 
                      textAlign: 'left',
                      border: '1px solid #ccc' 
                    }}
                  >
                    {key.replace('_', ' ').toUpperCase()}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.customer_id}>
                  {keys.map((key) => (
                    <TableCell 
                      key={key} 
                      sx={{ 
                        padding: '10px', 
                        border: '1px solid #ccc', 
                        textAlign: 'left',
                        backgroundColor: '#f9f9f9', 
                        color: '#000'
                      }}
                    >
                      {item[key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }      
    
    
    