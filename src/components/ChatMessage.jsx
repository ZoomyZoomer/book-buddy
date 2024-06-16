import React from 'react'
import {ReactComponent as AiIcon} from '../ai_icon_green.svg'

const ChatMessage = ({role, content}) => {
  return (
    <div className={role === 'ai' ? "chat_message_container_ai" : "chat_message_container_user"}>
        <div className="chat_message_role">
            {role === 'ai' ? <div className="role_circle"><AiIcon /></div> : <></>}
        </div>
        <div className={role === 'ai' ? "chat_message_content_ai" : "chat_message_content_user"}>
            {content}
        </div>
    </div>
  )
}

export default ChatMessage