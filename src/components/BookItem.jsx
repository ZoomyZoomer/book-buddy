import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import RatingStatic from './RatingStatic'
import RatingFluid from './RatingFluid'
import {ReactComponent as ThreeDots} from '../threeDots.svg'
import {ReactComponent as Checkmark} from '../checkmarkPages.svg'
import {ReactComponent as DotsGrid} from '../dotsGrid.svg'
import {ReactComponent as PlusPages} from '../plus-circle-svgrepo-com (1).svg'

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
  const [moveActive, setMoveActive] = useState(false);
  const [bannerCoverRight, setBannerCoverRight] = useState(null);
  const [bannerCoverTop, setBannerCoverTop] = useState(null);
  const [bannerPageTop, setBannerPageTop] = useState(null);
  const [bannerBookRight, setBannerBookRight] = useState(null);


  const navigate = useNavigate('/');

  const handle_dropdown = () => {

    if (activeDropdown){
      document.getElementById("dropdown_" + index).classList.add("book_options_dropdown_unactive");
      document.getElementById("dropdown_" + index).classList.remove("book_options_dropdown_active");
      document.getElementById("book_options_" + index).classList.remove("book_options_open");
      document.getElementById("book_options_" + index).classList.add("book_options_closed");
      document.getElementById("container_" + index).classList.remove("z-index");
      setActiveDropdown(false);
    } else {
      document.getElementById("dropdown_" + index).classList.add("book_options_dropdown_active");
      document.getElementById("dropdown_" + index).classList.remove("book_options_dropdown_unactive");
      document.getElementById("book_options_" + index).classList.add("book_options_open");
      document.getElementById("book_options_" + index).classList.remove("book_options_closed");
      document.getElementById("container_" + index).classList.add("z-index");
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

  function lightenColor(color, percent) {
    // Extract the RGB values
    const num = parseInt(color.slice(1), 16);
    let r = (num >> 16) + Math.round(255 * percent);
    let g = ((num >> 8) & 0x00FF) + Math.round(255 * percent);
    let b = (num & 0x0000FF) + Math.round(255 * percent);

    // Ensure values are within the 0-255 range
    r = Math.min(255, r);
    g = Math.min(255, g);
    b = Math.min(255, b);

    // Convert back to hex
    const newColor = (r << 16) | (g << 8) | b;
    return `#${newColor.toString(16).padStart(6, '0')}`;
}

  const getGenreColor = async() => {

    try {

      const res = await axios.get('http://localhost:4000/getGenreColor', {
        params: {
          username: username,
          genre: genre,
        }
      })


      const lightColor = lightenColor(res.data.color, 0.25);
      document.getElementById("genre_tag_" + index).style.backgroundColor = lightColor;
      document.getElementById("genre_text_"+index).style.color = res.data.color;
      document.getElementById("genre_circle_"+index).style.backgroundColor = res.data.color;


    } catch(e) {
      console.error({error: e});
    }

  }

  const getBanners = async() => {

    try {
      
      const res = await axios.get('http://localhost:4000/getBanners', {
        params: {
          username: username,
          tab_name: tabName,
          volume_id: volumeId
        }
      })

      setBannerCoverRight(res.data?.cover_right?.src);
      setBannerCoverTop(res.data?.cover_top?.src);
      setBannerPageTop(res.data?.pages_top?.src);
      setBannerBookRight(res.data?.book_right?.src);


    } catch(e) {
      console.error({error: e});
    }
    

  }

  useEffect(() => {

    getGenreColor();
    getBanners();

  })



  return (
    <>
      {isMounted && (

        <div id={"container_" + index} className="bookitem_container">
        <div className="book_cover">
          <img src={cover} draggable="false" />
          <div className="book_banner_right">
            <img className="book_banner_right_img" src={bannerCoverRight}/>
          </div>
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
              <div id={"genre_circle_" + index} className="genre_circle"/>
              <div id={"genre_text_" + index} className="genre_text">
                  {genre}
              </div>
            </div>


          </div>

          <div id={"book_options_" + index} className={"book_options"} onClick={() => handle_dropdown()}>

              <ThreeDots />
              
            <div id={"dropdown_" + index} className={"book_options_dropdown_unactive"}>
                <div className="option_customize_book">
                  Customize
                </div>

                <div className="option_move_book" onClick={() => setMoveActive(true)}>
                  Move / Drag
                </div>

                <div className="option_delete_book" onClick={() => handle_unmount()}>
                    Delete Book
                </div>
            </div>
          </div>

          <div className="book_page_count">

                {!isEditingPages && (<div style={{marginRight: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '2px'}} onClick={() => setIsEditingPages(true)}>
                    <PlusPages />
                  </div>{pagesRead}</div>)} 
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
                <div style={{marginLeft: '1px'}}>
                {totalPages}
                </div> 

                {moveActive && (
                  <div className="dots_grid">
                    <DotsGrid />
                </div>
                )}
              <div className="book_banner_top">
                <img className="book_banner_top_img" src={bannerPageTop}/>
              </div>
          </div>
          
        </div>

      )}
      
    </>
  )
}

export default BookItem