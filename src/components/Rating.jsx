import React, { useEffect } from 'react'
import { useState } from 'react'
import { ReactComponent as StarFull } from '../starFull.svg'
import { ReactComponent as StarEmpty } from '../starEmpty.svg'
import axios from 'axios'

const Rating = () => {

    const [ratingValue, setRatingValue] = useState(0);


  return (
    <div style={{display: 'flex'}}>
        <div className="flexMiddle" onMouseOver={() => setRatingValue(1)} onMouseOut={() => setRatingValue(0)}>
            {ratingValue >= 1 ? <StarFull /> : <StarEmpty />}
        </div>
        <div className="flexMiddle" onMouseOver={() => setRatingValue(2)} onMouseOut={() => setRatingValue(0)}>
            {ratingValue >= 2 ? <StarFull /> : <StarEmpty />}
        </div>
        <div className="flexMiddle" onMouseOver={() => setRatingValue(3)} onMouseOut={() => setRatingValue(0)}>
            {ratingValue >= 3 ? <StarFull /> : <StarEmpty />}
        </div>
        <div className="flexMiddle" onMouseOver={() => setRatingValue(4)} onMouseOut={() => setRatingValue(0)}>
            {ratingValue >= 4 ? <StarFull /> : <StarEmpty />}
        </div>
        <div className="flexMiddle" onMouseOver={() => setRatingValue(5)} onMouseOut={() => setRatingValue(0)}>
            {ratingValue >= 5 ? <StarFull /> : <StarEmpty />}
        </div>
    </div>
  )
}

export default Rating