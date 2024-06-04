import React from 'react'

const FolderTab = ({ text, tab_id, active }) => {

  return (
    <div class="folder-tab">
        <div className={tab_id === active ? "triangleActive" : "triangleUnactive"}></div>
        <div className={tab_id === active ? "rectangleActive" : "rectangleUnactive"}>
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