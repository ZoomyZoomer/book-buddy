import React, { useEffect } from 'react'
import { useState } from 'react'
import { ReactComponent as StarFull } from '../starFull.svg'
import { ReactComponent as StarEmpty } from '../starEmpty.svg'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const RatingFluid = ({ tabName, volumeId }) => {

    const [ratingValue, setRatingValue] = useState(0);
    const [userInfo, setUserInfo] = useState({});

    const navigate = useNavigate('/');

    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const response = await axios.get('http://localhost:4000/profile', {
              withCredentials: true,
            });
            setUserInfo(response.data.user);
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

    const handle_change = () => {

        try {

            axios.post('http://localhost:4000/updateRating', {
                tab_name: tabName,
                rating: ratingValue,
                volume_id: volumeId,
                username: userInfo.username
            })

        } catch(e) {
            console.error({error: e});
        }

    }


  return (
    <div style={{display: 'flex'}}>
        <div className="flexMiddle" onMouseOver={() => setRatingValue(1)} onMouseOut={() => setRatingValue(0)} onClick={() => handle_change()}>
            {ratingValue >= 1 ? <StarFull /> : <StarEmpty />}
        </div>
        <div className="flexMiddle" onMouseOver={() => setRatingValue(2)} onMouseOut={() => setRatingValue(0)} onClick={() => handle_change()}>
            {ratingValue >= 2 ? <StarFull /> : <StarEmpty />}
        </div>
        <div className="flexMiddle" onMouseOver={() => setRatingValue(3)} onMouseOut={() => setRatingValue(0)} onClick={() => handle_change()}>
            {ratingValue >= 3 ? <StarFull /> : <StarEmpty />}
        </div>
        <div className="flexMiddle" onMouseOver={() => setRatingValue(4)} onMouseOut={() => setRatingValue(0)} onClick={() => handle_change()}>
            {ratingValue >= 4 ? <StarFull /> : <StarEmpty />}
        </div>
        <div className="flexMiddle" onMouseOver={() => setRatingValue(5)} onMouseOut={() => setRatingValue(0)} onClick={() => handle_change()}>
            {ratingValue >= 5 ? <StarFull /> : <StarEmpty />}
        </div>
    </div>
  )
}

export default RatingFluid