import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <div className='flex min-h-[70vh] flex-col items-center justify-center w-full md:pt-36 pt-20 px-7  
                    md:px-0 space-y-7 text-center bg-top bg-cover bg-fixed '
          style={{
            backgroundImage : `url(${assets.hero_bg})`
          }}
    >
      <h1 className='md:text-home-heading-large text-home-heading-small relative font-bold max-w-3xl mx-auto text-white'>
          Empower your future with the courses designed to  
          <span className='text-blue-400'> 
            <img src={assets.sketch} alt="sketch" className='hidden md:block absolute -bottom-7 right-0'/>
            {" "}fit your choice.
          </span>
      </h1>

      <p className='hidden md:block text-gray-200 max-w-2xl max-auto'>
          We bring together world-class instructors, interactive content, and a supportive community
           to help you achieve your personal and professional goals.
      </p>

      <p className='md:hidden text-gray-200 max-w-sm max-auto'>
        We bring together world-class instructors, interactive content, and a supportive community to help 
        you achieve your personal and professional goals.
      </p>

      <SearchBar/>

    </div>
  )
}

export default Hero
