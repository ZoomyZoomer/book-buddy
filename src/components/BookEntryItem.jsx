import React, { useState } from 'react'
import {ReactComponent as BookIcon} from '../book_icon2.svg'
import {ReactComponent as FireIcon} from '../fire_icon_white.svg'
import '../bookspecificstats.css'

function BookEntryItem({index}) {

    const [showFire, setShowFire] = useState(false);
    const [showPercentage, setShowPercentage] = useState(false);

    const handleHover = () => {

        setTimeout(() => {
            setShowFire(true);
            document?.getElementById('fire' + `${index}`)?.classList?.remove('no_opacity');
        }, 500)
        

        setTimeout(() => {

            document?.getElementById('fire' + `${index}`)?.classList?.add('no_opacity');

            setTimeout(() => {
                setShowFire(false);
                setShowPercentage(true);
            }, 300)

        }, 1200)
        
    }

  return (
    <>
        <div class="container" onMouseEnter={() => handleHover()} onMouseLeave={() => {setShowPercentage(false); setTimeout(() => {setShowFire(false)}, 300); document?.getElementById('fire' + `${index}`)?.classList?.add('no_opacity')}}>
            <div class="main-box">
                <div class="box-content">
                <div class="svg">
                    <BookIcon />
                </div>
                <div class="text">
                    <div class="title">Pages 137 - 187 </div>
                    <div style={{display: 'flex', alignItems: 'left', justifyContent: 'left', fontWeight: '600', color: '#454B54'}}>May 6, 2024</div>
                </div>
                <div class="dots">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                </div>

            </div>

            <div className={"fire_percent"}>
                {showFire ? (<div id={"fire" + `${index}`} style={{display: 'grid', justifyContent: 'center', alignItems: 'center', bottom: '40px', color: 'white', fontFamily: "Inter"}}><FireIcon /><div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Streak!!!</div></div>) : ''}
                {showPercentage ? (<div id={"percent" + `${index}`} style={{fontSize: '36px', fontWeight: '600', marginTop: '20px', marginLeft: '10px', color: 'white', fontFamily: "Inter"}}>7%</div>): ''}
            </div>

        </div>
    </>
  )
}

export default BookEntryItem