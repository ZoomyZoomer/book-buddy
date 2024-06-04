import React, { useEffect } from 'react'
import { ReactComponent as StarFull } from '../starFull.svg'
import { ReactComponent as StarEmpty } from '../starEmpty.svg'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const RatingStatic = ({tabName, volumeId, ratingChanged}) => {

  const [ratingValue, setRatingValue] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const [isProfileFetched, setIsProfileFetched] = useState(false);

  const navigate = useNavigate('/');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:4000/profile', {
          withCredentials: true,
        });
        setUserInfo(response.data.user);
        setIsProfileFetched(true);
      } catch (error) {
        // Check if error response status is 401
        if (error.response && error.response.status === 401) {
          // Navigate to the sign-in page
          navigate('/signin');
        } else {
          // Handle other errors
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {

    if (isProfileFetched){

      setTimeout(() => {

        try{

            axios.get('http://localhost:4000/getRating', {
                params: {
                    tab_name: tabName,
                    volume_id: volumeId,
                    username: userInfo.username
                },
            })
                .then(res =>{
                    setRatingValue(res.data);
                })

        } catch(e) {
            console.error({error: e});
        }
      }, 30);
    }


  }, []);

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