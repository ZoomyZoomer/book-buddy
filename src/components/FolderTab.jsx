import React from 'react'

const FolderTab = ({ text, tab_id, active }) => {

  return (
    <div class="folder-tab">
        <div className={tab_id === active ? "triangleActive" : "triangleUnactive"}></div>
        <div className={tab_id === active ? "rectangleActive" : "rectangleUnactive"}>
            <div className="tabLabel" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: "45%"}}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: "100%", fontWeight: '400'}}>
                    {text}
                </div>
            </div>
        </div>
     </div>
  )
}

export default FolderTab