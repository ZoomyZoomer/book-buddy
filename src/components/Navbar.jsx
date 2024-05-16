import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'



function Navbar() {
  return (
    <div className="navBar">

        <p style={{ fontSize: '16px', color: '#06ab78'}}>
            Ivstitia
        </p>

        <FontAwesomeIcon 
            icon={faUser} size="xl" 
            style={{color: "#06ab78", marginLeft: '10px', cursor: 'pointer'}}
        />
        


        
    </div>
  )
}

export default Navbar