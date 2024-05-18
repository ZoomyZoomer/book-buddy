import React from 'react'
import Navbar from '../components/Navbar'
import MainContextHeader from '../components/MainContextHeader'
import DailyQuests from '../components/DailyQuests'


function HomePage() {



  return (
    <>
        <Navbar />
        <MainContextHeader />
        <DailyQuests />
    </>
  )
}

export default HomePage