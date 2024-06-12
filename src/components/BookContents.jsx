import React, { useState } from 'react'
import '../bookcontents_styles.css';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

function BookContents() {

    const { volume_id } = useParams();
    const [bookData, setBookData] = useState(null);

    const get_book_data = async() => {

        try {

            const res = await axios.get(`https://www.googleapis.com/books/v1/volumes/${volume_id}`, {withCredentials: false});
            setBookData(res.data);
            console.log(res.data);

        } catch(e) {
            console.error({error: e});
        }

    }

    useEffect(() => {

        get_book_data();

    }, [])

  return (
    <div className="book_contents_container">
        <div className="book_contents_navbar">
            
        </div>
        <div className="book_contents_subcontainer">
            <div className="book_info_container">
                <div className="info_top_container">
                    <img src={bookData?.volumeInfo?.imageLinks?.smallThumbnail} className="info_cover"/>
                    <div className="info_top_grid">
                            Test
                    </div>
                </div>
            </div>
            <div className="ai_container">

            </div>
        </div>
    </div>
  )
}

export default BookContents