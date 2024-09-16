import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function BasicTable({ customers }) {
    // Check if customers is a string and convert to an array if needed
    if (typeof customers === 'string') {
      try {
        customers = JSON.parse(customers);
      } catch (error) {
        console.error('Failed to parse customers:', error);
        return <p>Invalid data format</p>;
      }
    }
  
    // Ensure customers is an array
    if (!Array.isArray(customers) || customers.length === 0) {
      return <p>No data available</p>;
    }
  
    const keys = Object.keys(customers[0]); // Get keys from the first customer object
  
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
              {customers.map((customer) => (
                <TableRow key={customer.customer_id}>
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
                      {customer[key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }      
    
    
    