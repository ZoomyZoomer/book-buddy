import React from 'react'
import {ReactComponent as RobotIcon} from '../robot_icon.svg'
import {ReactComponent as CloseIcon} from '../x_icon.svg'
import {ReactComponent as MinimizeIcon} from '../underscore_icon.svg'
import {ReactComponent as SendIcon} from '../send_icon.svg'
import { useState } from 'react'
import axios from 'axios'
import ChatMessage from './ChatMessage'
import { Chat } from 'openai/resources/index.mjs'

function AIChat({setShowAIIcon, setShowAIChat, title}) {

    const [inputValue, setInputValue] = useState('');
    const [isClosing, setIsClosing] = useState(false);
    const [chatLog, setChatLog] = useState([{role: 'ai', chat: `Hello! 👋 How can I assist you today?`, endingResponse: true, time: new Date()}])
    const endingResponses = ["Is there anything else I can help with?", "Do you have any other questions?", "What else would you like to know?"]

    const handle_send = async(question) => {

        setInputValue('');

        const send = document.getElementById('sendIt');
        send.classList.add("scale");

        setTimeout(() => {
            send.classList.remove("scale");
        }, 500)

        setChatLog(prevChat => [...prevChat, {role: 'user', chat: question, endingResponse: true, time: new Date()}]);

        const res = await axios.post('http://localhost:4000/openai-request', {
            question: question,
            title
        })

        setChatLog(prevChat => [...prevChat, {role: 'ai', chat: res.data, endingResponse: false, time: new Date()}, {role: 'ai', chat: endingResponses[Math.floor(Math.random() * 3)], endingResponse: true, time: new Date()}]);


    }


  return (
    <div className="AI_chat_container">
        <div className="AI_chat_navbar">
            <div style={{marginLeft:'20px', marginRight: '-10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <RobotIcon />
            </div>
            <div className="AI_chat_navbar_text">
                <div>
                    BookBot
                </div>
                <div style={{fontSize: '13px'}}>
                    Currently Active
                </div>
            </div>
            <div className="chat_options">
                <div className="options_button" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <MinimizeIcon />
                </div>
                <div className="options_button" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => setIsClosing(true)}>
                    <CloseIcon />
                </div>
            </div>
        </div>
        {!isClosing && (
            <>
            <div className="AI_chat_content">
                {chatLog.map((item, index) => (
                    <ChatMessage role={item.role} content={item.chat} isEndingResponse={item.endingResponse} timestamp={item.time} index={index} maxIndex={chatLog.length - 1}/>
                ))}
                </div>
                <div id="shadow_container" className={"AI_chat_enter_message"}>
                    <div className="AI_input_container">
                    <input 
                        id="input_container"
                        className="AI_chat_input"
                        placeholder='Send a message to AI...'
                        onChange={(e) => setInputValue(e.target.value)}
                        value={inputValue}
                    />
                    <div id="sendIt" className="AI_chat_send_icon" onClick={() => handle_send(inputValue)}>
                        <SendIcon />
                    </div>

                </div>
            </div>
            </>

        )}
        {isClosing && (
        <>
            <div className="end_chat_container">
                <div className="end_chat_heading">
                    End chat?
                </div>
                <div className="end_chat_subheading">
                    Note: Chat logs are not retained for future chats.
                </div>
            </div>
            <div>
                
            </div>
        </>
        )}
        
    </div>
  )
}

export default AIChat