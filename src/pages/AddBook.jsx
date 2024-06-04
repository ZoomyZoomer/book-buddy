import React, { useEffect, useState } from 'react'
import SearchBookItem from '../components/SearchBookItem';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';


const AddBook = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [desiredBooks, setDesiredBooks] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const navigate = useNavigate('/');
    const { tabName } = useParams();

    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const response = await axios.get('http://localhost:4000/profile', {
            withCredentials: true,
          });
          setUserInfo(response.data.user);
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

    console.log(userInfo.username);

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
        tabName: tabName,
        username: userInfo.username
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
            <SearchBookItem 
              title={book.volumeInfo.title} 
              author={book.volumeInfo?.authors} 
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