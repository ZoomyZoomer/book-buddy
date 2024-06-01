import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../bookshelf_styles.css';
import {ReactComponent as Search} from '../search.svg'
import {ReactComponent as Sort} from '../sort.svg'
import {ReactComponent as QuestionMark} from '../questionMark.svg'
import {ReactComponent as AddBook} from '../addBook.svg'
import FolderTab from '../components/FolderTab';
import BookItem from '../components/BookItem';
import axios from 'axios';


function BookshelfPage() {

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [userCollection, setUserCollection] = useState([]);
  
  const navigate = useNavigate('/');

  const temp = "Favorites";
  let mutex = 0;

  useEffect(() => {

      try {
        axios.get('http://localhost:4000/getCollection', {
          params: {
            tabName: temp,
          },
        })
          .then(res => {
            if (mutex == 0){
              mutex = 1;

              const bookPromises = res.data.map((book) =>
                axios.get(`https://www.googleapis.com/books/v1/volumes/${book.volume_id}`, { withCredentials: false })
              );
      
              Promise.all(bookPromises)
                .then(response => {
                  const newBooks = response.map(responseAgain => responseAgain.data);
                  setUserCollection((prevCollection) => [...prevCollection, ...newBooks]);
                })
            }
          })

        
      } catch (e) {
        console.error({ error: e });
      }
    

  
  }, []); 




  return (
    
    <div className="bookshelf_container">
      <button onClick={() => console.log(userCollection)}></button>
      
      <section className="stats_section">
        <div className="stats_navBar">

        </div>
      </section>

      <section className="book_section">
        <div className="tab_section">
          <FolderTab text={temp} id={0} active={activeTab}/>
          <FolderTab text={temp} id={1} active={activeTab}/>
          <FolderTab text={temp} id={2} active={activeTab}/>
          <FolderTab text={temp} id={3} active={activeTab}/>
        </div>
        <div className="bookshelf_navBar">

          <div style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
            <div className="search_container">
              <input 
                className="searchbar" 
                type="search" 
                onChange={(e) => setSearchQuery(e.target.value)}>
              </input>
              <div className="search_icon">
                <Search />
              </div>
              <div className="questionMark_button">
                <QuestionMark />
              </div>
            </div>
          </div>

          <div className="sort_container">
            <div>
              SORT
            </div>
            <div className="sort_button">
              <Sort />
            </div>
          </div>

        </div>

        <div className="books_container">
            
        {userCollection.map((book, index) => (
          <BookItem 
          title={book.volumeInfo.title}
          author={book.volumeInfo.authors}
          cover={book.volumeInfo.imageLinks?.smallThumbnail}
          volumeId={book.id}
          genre={book.volumeInfo?.categories[0]}
          key={index}
          />
        ))}
    
            <div className="add_book" onClick={() => navigate(`/add-book/${temp}`)}>
              <div className="flexMiddle">
                <AddBook />
              </div>
              <div className="add_book_text">
                Add Book
              </div>
            </div>
        </div>

      </section>

    </div>
  )
}

export default BookshelfPage