import React from 'react'
import { ReactComponent as StarFull } from '../starFull.svg'
import { ReactComponent as StarEmpty } from '../starEmpty.svg'

const Book_small = ({title, coverImage, author, rating}) => {
  return (
    <div className="book_small_container">

        <div style={{display: "flex", alignItems: "center"}}>
            <div className="book_small_image_container">
                <img className="image_small" src={coverImage}/>
            </div>

            <div className="book_small_grid">
                <div style={{fontFamily: "Inter", fontSize: "18px", fontWeight: '500'}}>
                    {title}
                </div>
                <div style={{fontSize: "16px", color: 'gray', marginTop: '4px'}}>
                    {author}
                </div>
                <div style={{display: 'flex', marginTop: '8px'}}>
                    <StarFull />
                    <StarFull />
                    <StarFull />    
                    <StarEmpty />
                    <StarEmpty />
                </div>
                <div>
                    
                </div>
            </div>

        </div>

    </div>
  )
}

export default Book_small