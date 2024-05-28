import React from 'react'
import { ReactComponent as StarFull } from '../starFull.svg'
import { ReactComponent as StarEmpty } from '../starEmpty.svg'
import { ReactComponent as ThreeDots } from '../threeDots.svg'
import GenreTag from './GenreTag'

const Book_small = ({title, coverImage, author, rating}) => {

  return (
    <div className="book_small_container">

        <div style={{display: "flex", alignItems: "center", height: "100%", width: "100%"}}>
            <div className="book_small_image_container">
                <img className="image_small" src={coverImage}/>
            </div>

            <div className="book_small_grid">
                <div className="book_small_title">
                    {title}
                </div>
                <div style={{fontSize: "15px", color: 'gray', marginTop: '2px'}}>
                    {author}
                </div>
                <div style={{display: 'flex', marginTop: '6px'}}>
                    <StarEmpty />
                    <StarEmpty />
                    <StarEmpty />  
                    <StarEmpty />
                    <StarEmpty />
                </div>
                <div>
                    <GenreTag />
                </div>
            </div>

        </div>

        <div className="book_small_three_dots">
            <ThreeDots />
        </div>

    </div>
  )
}

export default Book_small