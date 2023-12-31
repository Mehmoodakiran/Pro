import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

function Userlist() {
  const [userList, setUserList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const apiUrl = 'http://localhost:8800/api/user/';

  useEffect(() => {
    getUsers();
    console.log("welcome to user list");
  }, []);

  const getUsers = async () => {
    try {
      const users = await axios.get(apiUrl);
      setUserList(users.data);
      setLoading(false);
      console.log(users.data);   
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete the data?");
      if (confirmDelete) {
        await axios.delete(`${apiUrl}${id}`);
        getUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRowId = (row) => row._id;

  const columns = [
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'email', headerName: 'E-Mail', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 }, // Replaced 'contactNumber' with 'phone'
    { field: 'isAdmin', headerName: 'IsAdmin', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div>
          <Link to={`/portal/user-view/${params.row._id}`} className='btn btn-primary btn-sm mr-1'>View</Link>
          <Link to={`/portal/user-edit/${params.row._id}`} className='btn btn-info btn-sm mr-1'>Edit</Link>
          <button onClick={() => handleDelete(params.row._id)} className='btn btn-danger btn-sm mr-1'>Delete</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">User-List</h1>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={userList}
          columns={columns}
          pageSize={5}
          loading={isLoading}
          getRowId={getRowId} 
        />
      </div>
    </>
  );
}

export default Userlist;
