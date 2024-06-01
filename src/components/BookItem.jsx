import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import RatingStatic from './RatingStatic'
import {ReactComponent as ThreeDots} from '../threeDots.svg'

const BookItem = ({title, author, cover, volumeId, genre, key}) => {

  

  return (
    <div className="bookitem_container">

      <div className="book_cover">
        <img src={cover} />
      </div>
        <div className="book_contents">

          <div className="book_title">
            {title}
          </div>
          <div className="book_author">
            {author}
          </div>
          <div className="book_rating">
            <RatingStatic />
          </div>


        </div>

        <div className="book_options">
          <ThreeDots />
        </div>
        
    </div>
  )
}

export default BookItem