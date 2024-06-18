import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import axios from 'axios'
import '../bookspecificstats.css'
import {ReactComponent as StarIcon} from '../star_icon.svg'
import {ReactComponent as Package} from '../package.svg'
import {ReactComponent as CrateDrop} from '../crate_drop.svg'
import {ReactComponent as CrateTruck} from '../crate_truck.svg'

function BookSpecificStats({volume_id, tab_name, username}) {

    const [tierClaimed, setTierClaimed] = useState([false, false, false, false]);
    const [numTiersCompleted, setNumTiersCompleted] = useState(0);
    const [windowResized, setWindowResized] = useState(false);
    const [pages, setPages] = useState([]);
    const [percentage, setPercentage] = useState(0);
    const executed = useRef(false);

    const getPages = async() => {

        const res = await axios.get('http://localhost:4000/getPages', {
            params: {
                volume_id,
                tab_name,
                username
            }
        })

        setPages([res.data[0], res.data[1]]);
        setPercentage(res.data[0] / res.data[1]);
        setNumTiersCompleted(Math.floor((res.data[0] / res.data[1]) * 4));

    }

    const getTiers = async() => {

        const res = await axios.get('http://localhost:4000/fetch-tiers', {
            params: {
                volume_id,
                tab_name,
                username
            }
        })

        setTierClaimed(res.data);
        console.log(res.data);

    }

    useEffect(() => {

        if (executed.current === false){
            getPages();
            getTiers();
            executed.current = true;
        }
        

    }, [])


    useEffect(() => {

        console.log('ok')

        if (numTiersCompleted === 1){
            document.getElementById("bar_filled").style.width = (document.getElementById("bar_unfilled").clientWidth * 0.15) + 'px';
        } else if (numTiersCompleted === 2){
            document.getElementById("bar_filled").style.width = (document.getElementById("bar_unfilled").clientWidth * 0.18 * numTiersCompleted) + 'px';
        } else if (numTiersCompleted === 3) {
            document.getElementById("bar_filled").style.width = (document.getElementById("bar_unfilled").clientWidth * 0.21 * numTiersCompleted) + 'px';
        } else if (numTiersCompleted === 4){
            document.getElementById("bar_filled").style.width = document.getElementById("bar_unfilled").clientWidth + 'px';
        } 


    }, [numTiersCompleted, windowResized])


    useEffect(() => {
        window.addEventListener('resize', function() {
            console.log('Window resized');
            setWindowResized(prevState => !prevState);
        });
    },[])

    const handle_claim = async(id) => {

        await axios.post('http://localhost:4000/process-claim', {
            volume_id: volume_id,
            tab_name: tab_name,
            username: username,
            tier: id.charAt(id.length - 1)
        })

        setTierClaimed(prevState => {
            const newTierClaimed = [...prevState];
            newTierClaimed[id.charAt(id.length - 1)] = true;
            return newTierClaimed;
        });

        getTiers();

    }


  return (
    <div className="book_specific_statistics_container">

        <div className="book_specific_header">
            Reading Progress
        </div>
        <div className="book_specific_subheader">
            Statistics
        </div>

        <div className="book_flex">
            <div className="book_specific_graph">

            </div>
            <div className="book_specific_circle_graph">

            </div>
        </div>

        <div className="milestone_container">

            <div className="milestone_real_container">
            
                <div className="book_specific_header">
                    <StarIcon /> Rewards Milestone
                </div>
                <div className="book_specific_subheader" style={{marginLeft: '45px', marginBottom: '16px'}}>
                    {numTiersCompleted} out of 4 rewards
                </div>

                <div className="progress_bar_container">

                    <div id="bar_unfilled" className="progress_bar">

                        <div id="bar_filled" className="progress_bar_filled" />

                        <div className="rewards_container">
                            <div className="icon_holder">
                                <img id="t1" src="/mail_icon.png" onClick={(e) => handle_claim(e.target.id)} className={`mail ${percentage < 0.25 ? "unavail_tier" : ""} ${percentage >= 0.25 && tierClaimed[0] === false ? "unclaimed_tier" : ""}`}/>
                                <div className="tier_object">
                                    <div className="percentage_read_text">
                                        {percentage >= 0.25 ? <green>25% Read</green>: "25% Read"}
                                    </div>
                                    <div className="tier_text">
                                    {percentage >= 0.25 ? <green>Tier I</green>: "Tier I"}
                                    </div>
                                </div>
                            </div>
                            <div className="icon_holder">
                                <img id="t2" src="/package_icon.png" onClick={(e) => handle_claim(e.target.id)} className={`package ${percentage < 0.5 ? "unavail_tier" : ""} ${percentage >= 0.50 && tierClaimed[1] === false ? "unclaimed_tier" : ""}`}/>
                                <div className="tier_object">
                                    <div className="percentage_read_text">
                                    {percentage >= 0.50 ? <green>50% Read</green>: "50% Read"}
                                    </div>
                                    <div className="tier_text">
                                    {percentage >= 0.50 ? <green>Tier II</green>: "Tier II"}
                                    </div>
                                </div>
                            </div>
                            <div className="icon_holder">
                                <img id="t3" src="/crate_drop.png" onClick={(e) => handle_claim(e.target.id)} className={`suitcase ${percentage < 0.75 ? "unavail_tier" : ""} ${percentage >= 0.75 && tierClaimed[2] === false ? "unclaimed_tier" : ""}`}/>
                                <div className="tier_object">
                                    <div className="percentage_read_text">
                                    {percentage >= 0.75 ? <green>75% Read</green>: "75% Read"}
                                    </div>
                                    <div className="tier_text">
                                    {percentage >= 0.75 ? <green>Tier III</green>: "Tier III"}
                                    </div>
                                </div>
                            </div>
                            <div className="icon_holder">
                                <img id="t4" src="/present_icon.png" onClick={(e) => handle_claim(e.target.id)} className={`present ${percentage < 1 ? "unavail_tier" : ""} ${percentage === 1 && tierClaimed[3] === false ? "unclaimed_tier" : ""}`}/>
                                <div className="tier_object">
                                    <div className="percentage_read_text">
                                    {percentage === 1 ? <green>100% Read</green>: "100% Read"}
                                    </div>
                                    <div className="tier_text">
                                    {percentage === 1 ? <green>Tier IV</green>: "Tier IV"}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>

            </div>

            <div className="note_text">
            Note: The final tier has a chance to contain rare banner decorations 0_o
            </div>

        </div>

    </div>
  )
}

export default BookSpecificStats