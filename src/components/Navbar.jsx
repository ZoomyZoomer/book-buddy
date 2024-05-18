import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { ReactComponent as MySlash } from '../slash.svg'
import { Link } from 'react-router-dom'



function Navbar() {



  return (
    <>
    <div className="navBar" style={{marginTop: '10px'}}>

      <div className="flexLeft">
        <div className="optionsGear">
          <FontAwesomeIcon icon={faGear} size="lg" color='#969696' style={{marginLeft: '40px', cursor: 'pointer'}}/>
        </div>
      </div>
     
      <div className="flexMiddle">

        <div className="unactiveBlack">
          <div>
            REWARDS
          </div>
          
        </div>

        <MySlash />

        <div className="unactiveBlack">
          <div>
            ROBOT
          </div>
        </div>

        <MySlash />

        <div className="activeGreen">
          <div>
            HOME
          </div>
        </div>

        <MySlash />

        <div className="unactiveBlack">
          <div>
            BOOKSHELF
          </div>
        </div>

        <MySlash />
        
        <div className="unactiveBlack">
          <div>
            TIMER
          </div>
        </div>

      </div>

      <div className="flexRight" style={{width: '100%'}}>

        <div className="flexRight" style={{marginRight: '40px'}}>
          <Link id="login" to="/login">
            <button className="loginButton" style={{ fontSize: '12px', fontWeight: 'bold', cursor: 'pointer'}}>
              LOGIN
            </button>
          </Link>
          <Link id="signup" to="/signup">
            <button className="loginButton" style={{ fontSize: '12px', fontWeight: 'bold', cursor: 'pointer'}}>
              SIGN UP
            </button>
          </Link>

            <FontAwesomeIcon 
                icon={faUser} size="xl" 
                style={{color: "#06ab78", marginLeft: '10px', cursor: 'pointer'}}
            />
        </div>

      </div>

        



        
    </div>
    </>
  )
}

export default Navbar