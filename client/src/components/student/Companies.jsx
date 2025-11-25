import React from 'react'
import { companiesIcons } from '../../assets/assets'


const Companies = () => {
  return (
    <div className='pt-8'>
      <p className='text-gray-500'>Trusted by learners from</p>

      <div className='flex flex-wrap items-center justify-center gap-6 md:gap-16 md:mt-10 mt-5 '>
        {companiesIcons.map((item, index) => (
          <img 
            src={item} 
            alt="logo" 
            key={index} 
            className='w-20 md:w-28'
          />
        ))}
      </div>
    </div>
  )
}

export default Companies
