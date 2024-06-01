import React, { useEffect } from 'react'
import { ReactComponent as StarFull } from '../starFull.svg'
import { ReactComponent as StarEmpty } from '../starEmpty.svg'
import axios from 'axios';
import { useState } from 'react';


const RatingStatic = () => {

  const ratingValue = 0;

  return (
    <div style={{display: 'flex'}}>
        <div className="flexMiddle" >
            {ratingValue >= 1 ? <StarFull /> : <StarEmpty />}
        </div>
        <div className="flexMiddle" >
            {ratingValue >= 2 ? <StarFull /> : <StarEmpty />}
        </div>
        <div className="flexMiddle" >
            {ratingValue >= 3 ? <StarFull /> : <StarEmpty />}
        </div>
        <div className="flexMiddle" >
            {ratingValue >= 4 ? <StarFull /> : <StarEmpty />}
        </div>
        <div className="flexMiddle" >
            {ratingValue >= 5 ? <StarFull /> : <StarEmpty />}
        </div>
    </div>
  )
}

export default RatingStatic