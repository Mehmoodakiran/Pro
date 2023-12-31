import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHotel } from '@fortawesome/free-solid-svg-icons';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

function HotelList() {
  const [hotelList, setHotelList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const apiUrl = 'http://localhost:8800/api/hotels/';

  useEffect(() => {
    getHotels();
  }, []);

  let getHotels = async () => {
    try {
      const hotels = await axios.get(apiUrl, { withCredentials: true });
      setHotelList(hotels.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  const getRowId = (row) => row._id;

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'type', headerName: 'Type', flex: 1 },
    { field: 'city', headerName: 'City', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'distance', headerName: 'Distance', flex: 1 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'desc', headerName: 'Description', flex: 1 },
    { field: 'cheapestPrice', headerName: 'Cheapest Price', flex: 1 },
    { field: 'featured', headerName: 'Featured', flex: 1 },
    { field: 'rooms', headerName: 'Rooms', flex: 1, renderCell: (params) => (
      <ul>
        {params.row.rooms.map((room, index) => (
          <li key={index}>{`Room ${index + 1}: ${room.title}`}</li>
        ))}
      </ul>
    )},
    {
      field: 'photos',
      headerName: 'Photos',
      flex: 1,
      renderCell: (params) => (
        <div className="photos-cell">
          {params.row.photos.map((photo, index) => (
            <img key={index} src={photo} alt={`Photo ${index}`} className="hotel-photo" />
          ))}
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div className="action-buttons">
          <Link to={`/portal/hotel-view/${params.row._id}`} className='btn btn-primary btn-sm'>View</Link>
          <Link to={`/portal/hotels-edit/${params.row._id}`} className='btn btn-info btn-sm'>Edit</Link>
          <button onClick={() => handleDelete(params.row._id)} className='btn btn-danger btn-sm'>Delete</button>
        </div>
      ),
    },
  ];

  let handleDelete = async (id) => {
    const deleteUrl = `${apiUrl}/${id}`;
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete the data?");
      if (confirmDelete) {
        await axios.delete(deleteUrl);
        getHotels();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="hotel-list-container">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h3 className="h3 mb-0 text-gray-800">Hotel</h3>
        <Link to="/portal/create-hotel" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
          <FontAwesomeIcon icon={faHotel} className="creatinguser mr-2" />
          Create Hotel
        </Link>
      </div>
      <div className="data-grid">
        <DataGrid
          rows={hotelList}
          columns={columns}
          pageSize={5}
          loading={isLoading}
          getRowId={getRowId}
        />
      </div>
    </div>
  );
}

export default HotelList;
