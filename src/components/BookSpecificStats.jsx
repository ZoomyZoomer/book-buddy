import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import axios from 'axios'
import '../bookspecificstats.css'
import {ReactComponent as StarIcon} from '../star_icon.svg'
import {ReactComponent as Package} from '../package.svg'
import {ReactComponent as CrateDrop} from '../crate_drop.svg'
import {ReactComponent as CrateTruck} from '../crate_truck.svg'
import {ReactComponent as BookIcon} from '../book_icon.svg'
import {ReactComponent as PlusIcon} from '../plus_icon.svg'
import {ReactComponent as MinusIcon} from '../minus_icon.svg'
import {ReactComponent as FireIcon} from '../fire_icon.svg'
import {ReactComponent as UpArrow} from '../up_arrow_icon.svg'
import {ReactComponent as CloseIcon} from '../close_icon.svg'
import {ReactComponent as ArrowLeft} from '../arrow_left_icon.svg'
import DonutChart from './DonutChart'
import BookEntryItem from './BookEntryItem'
import AIChat from './AIChat'

function BookSpecificStats({volume_id, tab_name, username, title}) {

    const [tierClaimed, setTierClaimed] = useState([false, false, false, false]);
    const [numTiersCompleted, setNumTiersCompleted] = useState(0);
    const [windowResized, setWindowResized] = useState(false);
    const [pages, setPages] = useState([]);
    const [percentage, setPercentage] = useState(0);
    const executed = useRef(false);
    const getEntries = useRef(false);
    const [pageValue, setPageValue] = useState(0);
    const [entryCount, setEntryCount] = useState(0);
    const [entries, setEntries] = useState([]);
    const [index, setIndex] = useState(0);
    const [showAIIcon, setShowAIIcon] = useState(true);
    const [showAIChat, setShowAIChat] = useState(false);
    const data= [0,1];

    const handleChange = (event) => {
        setPageValue(event.target.value);
    };

    const getPages = async() => {

        const res = await axios.get('http://localhost:4000/getPages', {
            params: {
                volume_id,
                tab_name,
                username
            }
        })

        setPages([res.data[0], res.data[1]]);
        setPageValue(res.data[0]);
        setPercentage(res.data[0] / res.data[1]);
        setNumTiersCompleted(Math.floor((res.data[0] / res.data[1]) * 4));
        fill_bar();

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

    const fill_bar = () => {
        
        if (numTiersCompleted === 1){
            document.getElementById("bar_filled").style.width = (document.getElementById("bar_unfilled").clientWidth * 0.15) + 'px';
        } else if (numTiersCompleted === 2){
            document.getElementById("bar_filled").style.width = (document.getElementById("bar_unfilled").clientWidth * 0.18 * numTiersCompleted) + 'px';
        } else if (numTiersCompleted === 3) {
            document.getElementById("bar_filled").style.width = (document.getElementById("bar_unfilled").clientWidth * 0.21 * numTiersCompleted) + 'px';
        } else if (numTiersCompleted === 4){
            document.getElementById("bar_filled").style.width = document.getElementById("bar_unfilled").clientWidth + 'px';
        } else {
            document.getElementById("bar_filled").style.width = 0;
        }

    }


    useEffect(() => {

        fill_bar();

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

    const handle_set_pages = async() => {

        await axios.post('http://localhost:4000/send-entry', {
            volume_id,
            tab_name,
            username,
            pages_added: Number(pageValue - pages[0]),
            total_pages_read: pageValue
        })

    
        await axios.post('http://localhost:4000/setPages', {
            volume_id,
            tab_name,
            username,
            pages_read: Number(pageValue)
        })

        getEntries.current = false;
        setEntryCount(prevCount => prevCount + 1);
        getPages();

    }

    const read_entry = async() => {

        const res = await axios.get('http://localhost:4000/get-entry', {
            params: {
                volume_id,
                tab_name,
                username,
                index
            }
        })

        setEntries(res.data);

    }

    useEffect(() => {

        console.log("");
        if (!getEntries.current){
            read_entry();
            getEntries.current = true;
        }

    }, [entryCount, index])

    const handle_entry_render = () => {

        getEntries.current = false;

        Array.from(document.getElementsByClassName("slideInAnimation")).forEach((item, index) => {
            item.classList.remove("slideInAnimation");
            setTimeout(() => {
                item.classList.add("slideInAnimation");
            }, 10)
            
        });

        setIndex(prevIndex => prevIndex + 1);

    }

    const handle_AI_chat = () => {

            setShowAIChat(true);
            document.getElementsByClassName("AI_icon")[0].classList.add("smallAnim");
            
            setTimeout(() => {

                setShowAIIcon(false);

            }, 994)

    }

    const handleClick = (e) => {

        if(e.target.id === "input_container"){
            document?.getElementById("shadow_container")?.classList?.add("input_boxshadow");
        } else {
            document?.getElementById("shadow_container")?.classList?.remove("input_boxshadow");
        }

    }


  return (
    <div className="book_specific_statistics_container" onClick={(e) => handleClick(e)}>

        <div className="book_specific_header">
            Reading Progress
        </div>
        <div className="book_specific_subheader" style={{marginBottom: '20px'}}>
            Page Statistics
        </div>

        <div className="book_flex">
            <div className="book_specific_pages">
                <div className="book_container_header" style={{marginBottom: '10px'}}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <BookIcon />
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        Create a new entry
                    </div>
                </div>
                <div className="add_page_contents">
                    <div className="page_counter">


                        <div className="pages_read_text">
                            {pageValue}
                        </div>

                        <div className="of_pages_text">
                            of {pages[1]} pages
                        </div>

                    </div>

                    

                    <div className="slidecontainer">
                        <div className="add_minus_icon" onClick={() => setPageValue(prevValue => prevValue > 0 ? Number(prevValue) - 1 : Number(prevValue))}>
                            <MinusIcon />
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max={pages[1]} 
                            value={pageValue} 
                            className="slider" 
                            id="myRange" 
                            onChange={handleChange}
                        />
                        <div className="add_minus_icon" onClick={() => setPageValue(prevValue => prevValue < pages[1] ? Number(prevValue) + 1 : Number(prevValue))}>
                            <PlusIcon />
                        </div>
                    </div>

                    <button className="submit_entry_button"onClick={() => handle_set_pages()}>Submit Entry</button>

                </div>
            </div>
            <div className="book_specific_circle_graph">
                <div className="completed_circle_text">
                    <div>
                        <FireIcon />
                    </div>
                    Completed
                </div>
                <DonutChart value={Math.floor(percentage * 100)} />
                <div className="today_percentage_text">
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        Today
                    </div>
                    <div style={{marginLeft: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <green>45%</green>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px'}}>
                        <UpArrow />
                    </div>
                </div>
                <div className="circle_graph_percentage_text">
                     {Math.floor(percentage * 100) + '%'}
                </div>
            </div>
        </div>

        <div className="milestone_container">

            <div className="milestone_real_container">
            
                <div className="book_container_header">
                    <StarIcon /> Rewards Milestone
                </div>
                <div className="book_specific_subheader" style={{marginLeft: '45px', marginBottom: '20px'}}>
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

        {showAIIcon && (
            <div className="AI_icon">
            <div style={{position: 'relative', display: 'block'}}>
                <img className="planet" src="/planet_icon.png" style={{height: '50px', width: '50px', display: 'block', cursor: 'pointer'}} onClick={(e) => handle_AI_chat(e.target.id)}/>
                <div className="AI_popup" style={{zIndex: '1000'}}>
                    <div style={{position: 'relative'}}>
                        Try out BookBot!
                        <div style={{position: 'relative'}}>
                            <div className="line_down" />
                            <div className="dot" />
                        </div>
                        <div id='close' className="close_icon" onClick={() => document.getElementsByClassName("AI_popup")[0].classList.add("no_opacity")}>
                            <CloseIcon />
                        </div>
                    </div>
                    
                    
                </div>
            </div>
        </div>
        )}

        {showAIChat && <div className="chat_rectangle"><AIChat setShowAIIcon={setShowAIIcon} setShowAIChat={setShowAIChat} title={title}/></div>}

        <div className="timeline_container">
                <div style={{display: 'flex', flexDirection: 'column', marginBottom: '20px'}}>
                    <div className="book_specific_header">
                        Reading Timeline
                    </div>
                    <div className="book_specific_subheader">
                        From most recent
                    </div>
                </div>

                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: "relative", boxSizing: 'border-box'}}>
                    <div className="arrow_left" onClick={() => handle_entry_render()}>
                        <ArrowLeft />
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '136px'}}>
                        {entries.map((item, index) => (
                        item.percent !== 0 ? <BookEntryItem index={index} pages={item.pages} date={item.date} percent={item.percent}/> : <div className></div>
                        ))}
                    </div>
                </div>
        </div>

    </div>
  )
}

export default BookSpecificStats