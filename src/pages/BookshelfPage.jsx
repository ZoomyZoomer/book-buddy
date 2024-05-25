import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';
import Bookshelf_Book from '../components/Bookshelf_Book';
import DoughnutChart from '../components/DoughnutChart';
import SearchBar from '../components/SearchBar';
import BookshelfSearch from '../components/BookshelfSearch';
import {ReactComponent as Sort } from '../sort.svg';
import FolderTab from '../components/FolderTab';


function BookshelfPage() {

    const [bookName, setBookName] = useState('');
    const [bookData, setBookData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeId, setActiveId] = useState(0);
    const [searchValue, setSearchValue] = useState('');

  

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

    const handleSearch = () => {

      setSearchValue('');

    }


    const temp = "Favorites"
    const temp2 = "Recommended"
    const temp3 = "Collection"
    const temp4 = "Others"

    const handleTabSwitch = (id) => {

      setActiveId(id);

    }



  return (
    <div className="bookshelfContainer">
        
        <div className="bookshelfGrid">

            <div className="folderFlex">
              <div onClick={() => handleTabSwitch(0)}>
                <FolderTab  id={0} active={activeId} text={temp}/>
              </div>
              <div onClick={() => handleTabSwitch(1)}>
                <FolderTab  id={1} active={activeId} text={temp2}/>
              </div>
              <div onClick={() => handleTabSwitch(2)}>
                <FolderTab  id={2} active={activeId} text={temp3}/>
              </div>
              <div onClick={() => handleTabSwitch(3)}>
                <FolderTab  id={3} active={activeId} text={temp4}/>
              </div>
            </div>

            <div className="flexRight">
              <div className="bookshelfNavbar">

              <div className="flexMiddle">
                <BookshelfSearch value={searchValue} onChange={(e) => setSearchValue(e.target.value)} handleSearch={handleSearch}/>
              </div>

              <div className="sortContainer">
                <div className="flexMiddle">
                  <h3>SORT</h3>
                  
                </div>
                <div className="sortIcon">
                  <Sort />
                </div>
              </div>
  
              </div>
            </div>

            <div className="flexRight">
              <div className="libraryContainer" /> 
            </div>

        </div>
    </div>
  )
}

export default BookshelfPage