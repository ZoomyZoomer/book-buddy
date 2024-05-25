import React from 'react'

const FolderTab = ({ text, id, active }) => {
  return (
    <div class="folder-tab">
        <div class={id == active ? "triangleActive" : "triangleUnactive"}></div>
        <div class={id == active ? "rectangleActive" : "rectangleUnactive"}>
            <div className="tabLabel">
                <div className="flexMiddle">
                    {text}
                </div>
            </div>
        </div>
     </div>
  )
}

export default FolderTab