import React from 'react'

const Bookshelf_Book = ({ title, author, publishDate, thumbnail, genres }) => {
  return (
    <div className="chooseBookContainer">

        <div className="imageFlex">
            {thumbnail && <img className="chooseBookCover" src={thumbnail} alt={`${title} cover`} />}
        </div>

        <div className="chooseBookGrid">

            <div className="bookTitle">{title}</div>
            <div className="bookAuthor">{author}</div>
            <div>
            {genres && genres.length > 0 && (
        <div className="fiction">
                <div className="fictionCircle" />
                <p className="genreFiction"> {genres.join(', ')} </p>

        </div>
      )}
            </div>
        
        </div>

    </div>
  )
}

export default Bookshelf_Book