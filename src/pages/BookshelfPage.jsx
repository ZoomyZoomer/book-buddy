import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';
import Bookshelf_Book from '../components/Bookshelf_Book';
import DoughnutChart from '../components/DoughnutChart';


function BookshelfPage() {

    const [bookName, setBookName] = useState('');
    const [bookData, setBookData] = useState(null);
  

    const handleInputChange = (event) => {
        setBookName(event.target.value);
    };

    async function submit(e){

        e.preventDefault();

        if (bookName) {
            const fetchBookData = async () => {
              try {
                const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${bookName}`, {
                    withCredentials: false,
                });
                setBookData(response.data);
              } catch (error) {
                console.error('Error fetching book data:', error);
              }
            };
      
            fetchBookData();
          }

    }


  return (
    <div className="bookshelfContainer">
        
        <div className="bookshelfGrid">

            <div className="flexRight">
              <div className="bookshelfNavbar" />
            </div>
            <div className="flexRight">
              <div className="libraryContainer" /> 
            </div>

        </div>
    </div>
  )
}

export default BookshelfPage