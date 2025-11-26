import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 py-4 border-t'>
      <div className='flex items-center gap-4'>
        <img src={assets.logo} alt="" className='hidden md:block w-20'/>

        <div className='hidden md:block h-7 w-px bg-gray-500/50'></div>

        <p>Copyright 2025 &copy; GreatStack.All Right Reserved.</p>
      </div>

      <div className='flex items-center gap-3 max-md:mt-4'>
        <a href="#">
          <img src={assets.facebook_icon} alt="facebook"/>
        </a>

        <a href="#">
          <img src={assets.twitter_icon} alt="facebook"/>
        </a>

        <a href="#">
          <img src={assets.instagram_icon} alt="facebook"/>
        </a>
      </div>
    </footer>
  )
}

export default Footer
