import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import '../bookshelf_styles.css';
import {ReactComponent as Search} from '../search.svg'
import {ReactComponent as Sort} from '../sort.svg'
import {ReactComponent as QuestionMark} from '../questionMark.svg'
import {ReactComponent as AddBook} from '../addBook.svg'
import FolderTab from '../components/FolderTab';
import BookItem from '../components/BookItem';
import Spinner from '../components/Spinner';
import axios from 'axios';


function BookshelfPage() {

  const [activeTab, setActiveTab] = useState(0);
  const [userCollection, setUserCollection] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [isProfileFetched, setIsProfileFetched] = useState(false);
  const [tab, setTab] = useState("Favorites");
  const [dropdownID, setDropdownID] = useState('');
  const change = useRef(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [booksBySearch, setBooksBySearch] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  
  let mutex = 0;
  
  const navigate = useNavigate('/');

  const temp = "Favorites";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:4000/profile', {
          withCredentials: true,
        });
        setUserInfo(response.data.user);
        setIsProfileFetched(true); // Set the state to true after fetching the profile
      } catch (error) {
        // Check if error response status is 401
        if (error.response && error.response.status === 401) {
          // Navigate to the sign-in page
          navigate('/signin');
        } else {
          // Handle other errors
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (isProfileFetched && userInfo) { // Ensure userInfo is not null
      const fetchCollection = async () => {
        try {
          const response = await axios.get('http://localhost:4000/getCollection', {
            params: {
              tabName: tab,
              username: userInfo.username,
            },
          });
          setBooksBySearch([]);
          setIsSearching(false);
          setUserCollection([]);
          setSearchQuery('');

          if (mutex == 0) {
            mutex = 1; // Use setMutex to update state safely

            const bookPromises = response.data.map((book) =>
              axios.get(`https://www.googleapis.com/books/v1/volumes/${book.volume_id}`, { withCredentials: false })
            );

            const books = await Promise.all(bookPromises);
            const newBooks = books.map(bookResponse => bookResponse.data);
            setUserCollection([...newBooks]);
          }
        } catch (e) {
          console.error({ error: e });
        }
      };

      fetchCollection();
    }
  }, [isProfileFetched, tab]);


  const handleLeftClick = (e) => {

    if (e.button === 0){

 

        const openOptions = document.getElementsByClassName('book_options_open');
        

        if (change.current == true){
          setTimeout(() => {
            openOptions[0]?.classList?.remove('book_options_open');
            const openDropdown = document.getElementsByClassName('book_options_dropdown_active');
            openDropdown[0]?.classList?.add('book_options_dropdown_unactive');
            openDropdown[0]?.classList?.remove('book_options_dropdown_active');
            setActiveDropdown(false);
            change.current = false;
          }, 200);
        }

        if (openOptions.length != 0){
          change.current = true;
        }


    }

  }

  useEffect(() => {

    document.addEventListener('mousedown', (e) => handleLeftClick(e));

  }, [])

  const get_books_by_search = async(searchValue) => {

    setSearchQuery(searchValue);

    if (searchValue != ''){
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }

    try {

      const response = await axios.get('http://localhost:4000/getBooksBySearch', {
        params: {
          search_query: searchValue,
          tab_name: tab,
          username: userInfo.username
        }
        
      })

      setBooksBySearch(response.data);

    } catch(e) {
      console.error({error :e});
    }

  }


  return (

    
    <div className="bookshelf_container">

      <section className="stats_section">
        <div className="stats_navBar">

        </div>
      </section>


        <section className="book_section">
        <div className="tab_section">
          <div onClick={() => {mutex = 0; setActiveTab(0); setTab('Favorites')}}>
            <FolderTab text={'Favorites'} tab_id={0} active={activeTab}/>
          </div>
          <div onClick={() => {mutex = 0; setActiveTab(1); setTab('Planned')}}>
            <FolderTab text={'Planned'} tab_id={1} active={activeTab}/>
          </div>
          <div onClick={() => {mutex = 0; setActiveTab(2); setTab('Finished')}}>
            <FolderTab text={'Finished'} tab_id={2} active={activeTab}/>
          </div>
          <div onClick={() => {mutex = 0; setActiveTab(3); setTab('Others')}}>
            <FolderTab text={'Others'} tab_id={3} active={activeTab}/>
          </div>
  
        </div>
        <div className="bookshelf_navBar">

          <div style={{display: 'flex', width: '100%', justifyContent: 'center'}}>

            <button style={{zIndex: '100'}}onClick={() => navigate(`/add-book/${tab}`)}>Add Book</button>

            <div className="search_container">
              <input 
                className="searchbar" 
                type="search" 
                onChange={(e) => {get_books_by_search(e.target.value)}}
                placeholder='Search by title'
                value={searchQuery}
              />
              <div className="search_icon">
                <Search />
              </div>
            </div>
          </div>

          <div className="sort_container">
            <div style={{cursor: 'pointer'}}>
              EDIT
            </div>
            <div className="questionMark_button">
                <QuestionMark />
            </div>
            <div className="segment"/>
            <div style={{cursor: 'pointer'}}>
              SORT
            </div>
            <div className="sort_button">
              <Sort />
            </div>
          </div>

        </div>

        <div className="books_container">
            
        {isSearching && booksBySearch.length == 0 ? (<></>) : isSearching && booksBySearch.length != 0 ? booksBySearch.map((book, index) => (
          <>
            <BookItem 
            title={book.title}
            author={book.author}
            cover={book.cover}
            volumeId={book.volume_id}
            genre={book.genre}
            index={index}
            key={index}
            tabName={tab}
            profileFetched={isProfileFetched}
            username={userInfo.username}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            />

           
          </>

          )) : !isSearching && userCollection.length != 0 && userCollection.map((book, index) => (
          <>
            <BookItem 
            title={book.volumeInfo.title}
            author={book.volumeInfo.authors[0]}
            cover={book.volumeInfo.imageLinks?.smallThumbnail}
            volumeId={book.id}
            genre={book.volumeInfo?.categories}
            index={index}
            key={index}
            tabName={tab}
            profileFetched={isProfileFetched}
            username={userInfo.username}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            />
          </>
        ))}

        </div>

        </section>

      

    </div>
  )
}

export default BookshelfPage