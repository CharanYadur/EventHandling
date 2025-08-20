import React from 'react'
import NewlyAdded from './NewlyAdded'
import FeatureSection from './FeatureSection'
import Locations from './Locations'

const Home = () => {
  return (
    <div style={{backgroundColor:"#f3ece5ff"}}>
      <NewlyAdded />
      <FeatureSection />
      <Locations />
      
    </div>
  )
}

export default Home
