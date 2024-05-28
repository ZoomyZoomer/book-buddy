import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';
import Bookshelf_Book from '../components/Bookshelf_Book';
import DoughnutChart from '../components/DoughnutChart';
import SearchBar from '../components/SearchBar';
import BookshelfSearch from '../components/BookshelfSearch';
import {ReactComponent as Sort } from '../sort.svg';
import {ReactComponent as AddBook } from '../addBook.svg'
import FolderTab from '../components/FolderTab';
import { useNavigate } from 'react-router-dom';
import Book_small from '../components/Book_small';


function BookshelfPage() {

    const temp = "Favorites"
    const temp2 = "Recommended"
    const temp3 = "Collection"
    const temp4 = "Others"

    const [searchQuery, setSearchQuery] = useState('');
    const [activeId, setActiveId] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [bookshelfData, setBookshelfData] = useState({});
    const [tabName, setTabName] = useState("Favorites");
    const [bookDetailsArray, setBookDetailsArray] = useState([]);

    const navigate = useNavigate();


    const loadBooks = async () => {

      axios.get('http://localhost:4000/getBooks')
        .then(response => {

       const isbnArray = response.data;

    // Map over the ISBN array to create an array of promises
    const bookDetailsPromises = isbnArray.map(async isbn => {
      try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn.isbn}`, {
          withCredentials: false,
        });
        return response.data;
      } catch (error) {
        console.error(`Error fetching details for ISBN ${isbn}:`, error.message);
        return null;
      }
    });

    // Resolve all promises and store the results in a separate array
    return Promise.all(bookDetailsPromises);
  })
  .then(details => {
    // Do something with the book details array
    console.log(details);
    setBookDetailsArray(details);
  })
  .catch(error => {
    console.error('Error fetching book details:', error.message);
  });
        

    }


    
    

    const handleSearch = () => {

      setSearchValue('');

    }


    

    const handleTabSwitch = (id) => {

      setActiveId(id);

    }



  return (
    <div className="bookshelfContainer">
      <button onClick={() => loadBooks()}>CLICK</button>
      
        
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
              <div className="libraryContainer"> 

                <div className="addBookContainer" onClick={() => navigate('/add')}>

                  <div className="flexMiddle">
                    <AddBook tabName={tabName}/>
                  </div>
                  <div className="addBookText">
                    Add Book
                  </div>

                </div>

                <div>
                  {bookDetailsArray.map((book, index) => (
                    <Book_small
                      key={index}
                      title={book.items[0].volumeInfo.title}
                      coverImage={book.items[0].volumeInfo.imageLinks?.smallThumbnail}
                      author = {book.items[0].volumeInfo.authors}
                    />
                  ))}
                </div>


              </div> 
            </div>

        </div>
    </div>
  )
}

export default BookshelfPage