import React, { useEffect, useState } from 'react'
import BookItem from '../components/BookItem';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const AddBook = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [desiredBooks, setDesiredBooks] = useState([]);
    const navigate = useNavigate('/');
    const { tabName } = useParams();

    const handleSearch = () => {
 
          axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`, {withCredentials: false})
            .then(res => {
              setDesiredBooks(res.data.items);
              console.log(res.data.items);
            })



        setSearchQuery('');

    }

    const handleAddBook = (volumeId, pages) => {

      axios.post('http://localhost:4000/addBook', {
        volumeId: volumeId,
        pages: pages,
        tabName: tabName
      }).then( res => {
        navigate('/bookshelf');
      })
      .catch(e => {
        console.error('Error:', e);
      });

    }

  return (
    <div>
        <input 
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
        />
        <button onClick={() => handleSearch()}>Submit</button>
        
        {desiredBooks.map((book, index) => (
          <div>
            <BookItem 
              key={index} 
              title={book.volumeInfo.title} 
              author={book.volumeInfo?.authors} 
              volumeId={book.id}
              cover={book.volumeInfo.imageLinks?.smallThumbnail}
              genre={book.volumeInfo?.categories}
            />
            <button onClick={() => handleAddBook(book.id, book.volumeInfo.pageCount)}>
              Add Book
            </button>
          </div>
          
        ))}
      
    </div>
  )
}

export default AddBook