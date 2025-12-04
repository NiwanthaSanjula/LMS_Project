/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Loading = () => {

  const { path } = useParams()
  const navigate = useNavigate();

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`)
      },7000)
      return ()=> clearTimeout(timer)
    }
  }, [])

  return (
    <div className='min-h-[90vh] flex flex-col items-center justify-center'>
      <div className='w-16 sm:w-28 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-500 rounded-full animate-spin'/>

      <span className='mt-10 animate-ping text-lg sm:text-2xl'>Loading</span>
    </div>
  )
}

export default Loading