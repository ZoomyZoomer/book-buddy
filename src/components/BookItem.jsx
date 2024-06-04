import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import RatingStatic from './RatingStatic'
import RatingFluid from './RatingFluid'
import {ReactComponent as ThreeDots} from '../threeDots.svg'
import {ReactComponent as Checkmark} from '../checkmarkPages.svg'

const BookItem = ({title, author, cover, volumeId, genre, index, tabName}) => {

  const [activeDropdown, setActiveDropdown] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [fluidRating, setFluidRating] = useState(false);
  const [pagesRead, setPagesRead] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditingPages, setIsEditingPages] = useState(false);
  const [changingPage, setChangingPage] = useState(0);
  const [isProfileFetched, setIsProfileFetched] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const navigate = useNavigate('/');

  const handle_dropdown = () => {

    if (activeDropdown){
      document.getElementById("dropdown_" + index).classList.add("book_options_dropdown_unactive");
      document.getElementById("dropdown_" + index).classList.remove("book_options_dropdown_active");
      document.getElementById("book_options_" + index).classList.remove("book_options_open");
      document.getElementById("book_options_" + index).classList.add("book_options_closed");
      setActiveDropdown(false);
    } else {
      document.getElementById("dropdown_" + index).classList.add("book_options_dropdown_active");
      document.getElementById("dropdown_" + index).classList.remove("book_options_dropdown_unactive");
      document.getElementById("book_options_" + index).classList.add("book_options_open");
      document.getElementById("book_options_" + index).classList.remove("book_options_closed");
      setActiveDropdown(true);
    }
    
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:4000/profile', {
          withCredentials: true,
        });
        setUserInfo(response.data.user);
        setIsProfileFetched(true);
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

  const handle_unmount = () => {
    setIsMounted(false);
    // Make request to database to delete book entry
    try {
      axios.post('http://localhost:4000/deleteBook', {
        volume_id: volumeId,
        tab_name: tabName,
        username: userInfo.username
      });
    } catch (e) {
      setIsMounted(true);
      console.error({ error: e });
    }
  };

  const handle_change_pages = (value) => {
    setChangingPage(value);
  };

  const submit_page_change = async () => {
    try {
      await axios.post('http://localhost:4000/setPages', {
        volume_id: volumeId,
        tab_name: tabName,
        pages_read: changingPage,
        username: userInfo.username
      });
      setIsEditingPages(false);
    } catch (e) {
      console.error({ error: e });
    }

  };

  // Get pages read
  useEffect(() => {
    if (isProfileFetched) { // Only execute this effect if the profile has been fetched
      try {
        axios.get('http://localhost:4000/getPages', {
          params: {
            volume_id: volumeId,
            tab_name: tabName,
            username: userInfo.username
          }
        })
        .then(res => {
          setPagesRead(res.data[0]);
          setTotalPages(res.data[1]);
        });
      } catch (e) {
        console.error({ error: e });
      }
    }
  }, [isProfileFetched, isEditingPages]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      submit_page_change();
  }
}
  

  return (
    <>
      {isMounted && (

        <div className="bookitem_container">

        <div className="book_cover">
          <img src={cover} draggable="false" />
        </div>
          <div className="book_contents">

            <div className="book_title">
              {title}
            </div>
            <div className="book_author">
              {author}
            </div>
            <div className="book_rating" onClick={() => setFluidRating(false)}>
              {!fluidRating && (
                <RatingStatic tabName={tabName} volumeId={volumeId} ratingChanged={fluidRating}/>
              )}
              {fluidRating && (
                <RatingFluid tabName={tabName} volumeId={volumeId}/>
              )}
              
            </div>


          </div>

          <div id={"book_options_" + index} className={"book_options"} onClick={() => handle_dropdown()}>

              <ThreeDots />

            <div id={"dropdown_" + index} className={"book_options_dropdown_unactive"}>
                <div className="option_change_pages" onClick={() => setIsEditingPages(true)}>
                  Edit Page Count
                </div>

                <div className="option_change_rating" onClick={() => setFluidRating(true)}>
                  Change Rating
                </div>

                <div className="option_delete_book" onClick={() => handle_unmount()}>
                    Delete Book
                </div>
            </div>
          </div>

          <div className="book_page_count">

                {!isEditingPages && (<div style={{marginRight: '2px'}}>{pagesRead}</div>)} 
                {isEditingPages && (
                <>
                  <input 
                    className="change_pages_input"
                    onChange={(e) => handle_change_pages(e.target.value)}
                    onKeyDown={handleKeyPress}
                    defaultValue={pagesRead}
                  />
                </>
                
                )}
                /
                <div style={{marginLeft: '2px'}}>
                {totalPages} pages read
                </div> 

                
          </div>
          
        </div>

      )}
      
    </>
  )
}

export default BookItem