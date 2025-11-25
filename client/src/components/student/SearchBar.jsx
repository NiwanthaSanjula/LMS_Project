import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({data}) => {

  const navigate = useNavigate()
  const [input, setInput] = useState(data ? data : "")

  const onSearchHandler = (e) => {
    e.preventDefault()

    navigate('/course-list/'+ input)
  }

  return (
    <form onSubmit={onSearchHandler} className='max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/50 rounded mb-4'>
        <img 
          src={assets.search_icon} 
          alt="search-icon" 
          className='md:w-auto w-10 px-3'
        />

        <input 
          type="text" 
          placeholder='Search courses' 
          className=' w-full h-full outline-none text-gray-500/80' 
          onChange={(e) => {
            setInput(e.target.value)
            navigate('/course-list/' + e.target.value); //live search route
          }}
          value={input}
        />

        <button type='submit' className='bg-blue-600 text-white md:px-10 px-7 md:py-3  py-2 mx-1 rounded cursor-pointer hover:bg-blue-500 transition-all '>
          Search
        </button>
    </form>
  )
}

export default SearchBar
