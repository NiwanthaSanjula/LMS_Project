import React from 'react'

const Loading = () => {
  return (
    <div className='min-h-[90vh] flex flex-col items-center justify-center'>
      <div className='w-16 sm:w-28 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-500 rounded-full animate-spin'/>

      <span className='mt-10 animate-ping text-lg sm:text-2xl'>Loading</span>
    </div>
  )
}

export default Loading