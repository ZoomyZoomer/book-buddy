import React from 'react'
import axios from 'axios';


const Bookshelf_Book = ({ title, author, publishDate, thumbnail, genres, isbn }) => {

  const tabName = "Favorites"

  async function handleAddBook() {

    try {

      console.log(tabName);
      const response = await axios.post('http://localhost:4000/addISBN', {tabName, isbn});
      
      
      if (response.status == 200 || response.status == 201){
        console.log("Book successfully added");
      }

    } catch (e){
      console.log("Could not add book");
    }

  }

  return (
    <div className="chooseBookContainer">

      <button onClick={() => handleAddBook()}>Add Book</button>

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