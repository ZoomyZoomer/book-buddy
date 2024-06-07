import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import RatingStatic from './RatingStatic'
import RatingFluid from './RatingFluid'
import {ReactComponent as ThreeDots} from '../threeDots.svg'
import {ReactComponent as Checkmark} from '../checkmarkPages.svg'
import {ReactComponent as DotsGrid} from '../dotsGrid.svg'

const BookItem = ({title, author, cover, volumeId, genre, index, tabName, profileFetched, username, setActiveDropdown, activeDropdown}) => {

  const [isMounted, setIsMounted] = useState(true);
  const [fluidRating, setFluidRating] = useState(false);
  const [pagesRead, setPagesRead] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditingPages, setIsEditingPages] = useState(false);
  const [isProfileFetched, setIsProfileFetched] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [updatePages, setUpdatePages] = useState(0);
  const [isUpdated, setIsUpdated] = useState(false);
  const effectRan = useRef(false);
  const ratingEffectRan = useRef(false);
  const [rating, setRating] = useState(0);
  const [change, setChange] = useState(false);
  const rerender = useRef(false);


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

  const handle_unmount = async() => {
    try {

      await axios.post('http://localhost:4000/deleteBook', {
        volume_id: volumeId,
        tab_name: tabName,
        username: username
      })

      setIsMounted(false);

    } catch (e) {
      console.error('Error deleting book:', e);
    }
  };


  const setPages = async() => {

    try {

      setPagesRead(updatePages);

      await axios.post('http://localhost:4000/setPages', {
        volume_id: volumeId,
        tab_name: tabName,
        pages_read: updatePages,
        username: username
      })

      effectRan.current = false;
      setIsUpdated(true);

    } catch(e) {
      console.error({error: e});
    }

  }



  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setIsEditingPages(false);
      setPages();
    }
  }

  const getPages = async() => {

    try {

      const response = await axios.get('http://localhost:4000/getPages', {
        params: {
          volume_id: volumeId,
          tab_name: tabName,
          username: username
        }
      });

      setPagesRead(response.data[0]);
      setTotalPages(response.data[1]);
      rerender.current = true;

    } catch(e) {
      console.error({error: e});
    }

  }

  useEffect(() => {

    if (effectRan.current === false) {
      if (profileFetched){
        getPages();
        effectRan.current = true;
        setIsUpdated(false);
      }
    }


  }, [{isUpdated, change}])


  useEffect(() => {

    if (ratingEffectRan.current === false) {
      if (fluidRating === false){
        if (profileFetched){
          getRating();
          ratingEffectRan.current = true;
        }
      }
    }

  }, [{fluidRating, change}])

  const getRating = async() => {

    const res = await axios.get('http://localhost:4000/getRating', {
      params: {
        tab_name: tabName,
        volume_id: volumeId,
        username: username
      }
    })

    setRating(res.data);

  }

  useEffect(() => {

    if (rerender){
      effectRan.current = false;
      ratingEffectRan.current = false;
      setChange(true);
    }

  }, [tabName])

  const getGenreColor = async() => {

    try {

      const res = await axios.get('http://localhost:4000/getGenreColor', {
        params: {
          username: username,
          genre: genre,
        }
      })


    } catch(e) {
      console.error({error: e});
    }

  }

  useEffect(() => {

    getGenreColor();
    

  })



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
            <div className="book_rating" onClick={() => setFluidRating(true)}>
              {!fluidRating && (
                <RatingStatic tabName={tabName} volumeId={volumeId} rating={rating}/>
              )}
              {fluidRating && (() => {
                ratingEffectRan.current = false;
                return <RatingFluid tabName={tabName} volumeId={volumeId} username={username} fluidRating={setFluidRating} rating={setRating}/>;
              })()}
              
            </div>
            <div id={"genre_tag_" + index} className="genre_tag">
              <div className="genre_circle"/>
              <div className="genre_text">
                  Fantasy
              </div>
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
                    onChange={(e) => setUpdatePages(e.target.value)}
                    onKeyDown={handleKeyPress}
                    defaultValue={pagesRead}
                  />
                </>
                
                )}
                /
                <div style={{marginLeft: '2px'}}>
                {totalPages}
                </div> 

                <div className="dots_grid">
                  <DotsGrid />
                </div>

                
          </div>
          
        </div>

      )}
      
    </>
  )
}

export default BookItem