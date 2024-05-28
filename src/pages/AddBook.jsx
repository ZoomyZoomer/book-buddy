import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import Bookshelf_Book from '../components/Bookshelf_Book';

const AddBook = ({tabName}) => {

    const [bookData, setBookData] = useState(null);
    const [bookName, setBookName] = useState('');

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

    const getISBN = (identifiers) => {
        
        if (!identifiers) return 'Unknown ISBN';

        const isbn13 = identifiers.find(id => id.type === 'ISBN_13');
        if (isbn13){
            console.log(isbn13.identifier);
            return isbn13.identifier;
        } 

        const isbn10 = identifiers.find(id => id.type === 'ISBN_10');
        if (isbn10){
            console.log(isbn10.identifier);
            return isbn10.identifier;
        } 

        return 'Unknown ISBN';
    };

  return (
    <>
        <div className="flexMiddle">
            <input
                type="text"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                placeholder="Enter book name"
            />
            <button className={"submitButton"} type="submit" onClick={submit}>
              Submit
            </button>
        </div>
        <div className="flexMiddle">
            
            <div className="bookshelfContainer">
            {bookData && (
                <div>
                <h2>Book Results</h2>
                <div>
            {bookData.items.map((book) => (
              <Bookshelf_Book
                key={book.id}
                title={book.volumeInfo.title}
                author={book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author'}
                publishDate={book.volumeInfo.publishedDate ? book.volumeInfo.publishedDate : 'Unknown Date'}
                thumbnail={book.volumeInfo.imageLinks?.thumbnail}
                genres={book.volumeInfo.categories || []}
                isbn={getISBN(book.volumeInfo.industryIdentifiers)}
                tabName={tabName}
              />
            ))}
          </div>
                </div>
            )}
                
            </div>
        </div>
    </>
  )
}

export default AddBook