/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import Footer from '../../components/student/Footer'
import YouTube from 'react-youtube'
import { toast } from 'react-toastify'
import axios from 'axios'

const CourseDetails = () => {

  const { id } = useParams()
  const { currency,
          allCourses, 
          calculateRating,
          calculateChaperTime,
          calculateCourseDuration,
          calculateNoOfLectures,
          backendUrl,
          userData,
          getToken
        } = useContext(AppContext)
        
  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const [playerData, setPlayerData] = useState(null)

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get( backendUrl +'/api/course/'+ id)

      if (data.success) {
        setCourseData(data.courseData)
      } else {
        toast.error(data.message) 
      }
      

    } catch (error) {
      toast.error(error.message) 
    }
  }

  const toggleSection = (index) => {
    setOpenSections((prev) => (
      {
        ...prev, 
        [index] : !prev[index]
      }
    ))
  }


  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.warning('Login to Enroll')
      }

      if (isAlreadyEnrolled) {
        return toast.warning('You Already Enrolled')
      }
      const token = await getToken();

      const { data } = await axios.post( 
          backendUrl + '/api/user/purchase' , 
          {courseId: courseData._id},
          {headers: {Authorization: `Bearer ${token}`}}
      )

      if (data.success) {
          const { session_url } = data
          window.location.replace(session_url)
      } else {
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message) 
    }
  }

  useEffect(() => {
    fetchCourseData()
  }, [])

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id))
    }
  }, [userData, courseData])



  return courseData ?  (

    <>
        <div className='flex md:flex-row flex-col-reverse gap-10 relative 
                        items-start justify-between md:px-36 px-8 md:pt-30 text-left '
        >

          <div className='absolute top-0 left-0 w-full h-96 -z-10
                          bg-linear-to-b from-cyan-100/70  '
          />


          {/**Left Column */}
          <div className='max-w-xl z-10 text-gray-500 '>
            <h1 className='md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-600 ' >{courseData.courseTitle}</h1>
            <p 
              dangerouslySetInnerHTML={{__html: courseData.courseDescription.slice(0,200)}}
              className='pt-4 md:text-base text-sm'
            />

            {/*review and ratings */}
            <div className='flex pt-3 pb-1 text-sm items-center space-x-2'>
              <p>{calculateRating(courseData)}</p>
              <div className='flex'>
                {[...Array(5)].map((_, i) => ( 
                  <img 
                    src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} 
                    key={i} 
                    alt="star" 
                    className='w-3.5 h-3.5'
                  />
                ))}
              </div>
              
              <p className='text-blue-600'>({courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? 'ratings' : 'rating'})</p>

              <p>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? 'students' : 'student'}</p>
            </div>

            <p className='text-sm'>Course by <span className='text-blue-600 underline '>{courseData.educator.name}</span></p>

            <div className='pt-8 text-gray-600' >
                <h2 className='text-xl font-semibold'>Course Structure</h2>

                <div className='pt-5'>
                  {courseData.courseContent.map((chapter, index) => (
                    <div key={index} className='shadow-(--shadow-right) bg-white mb-2 rounded-lg border-l-4 border-blue-600'>

                      <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none' onClick={() => toggleSection(index)}>
                        <div className='flex items-center gap-2'>
                          <img 
                            src={assets.down_arrow_icon} 
                            alt="arrow-icon" 
                            className={`transform transition-transform ${openSections[index] ? "rotate-180" : ""} `}
                          />

                          <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                        </div>

                        <p className='text-sm md:text-default'>{chapter.chapterContent.length} lectures- {calculateChaperTime(chapter)} </p>
                      </div>

                      <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' :'max-h-0' }`}>
                        <ul className='kist-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300 bg-gray-200 '>
                          { chapter.chapterContent.map((lecture, i) => (
                            <li key={i} className='flex items-start gap-2 py-1'>
                              <img 
                                src={assets.play_icon} 
                                alt="play-icon" 
                                className='w-4 h-4 mt-1'
                              />

                              <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default '>
                                <p>{lecture.lectureTitle}</p>

                                <div className='flex gap-2'>
                                  {lecture.isPreviewFree && 
                                    <p 
                                      className='text-blue-500 font-medium cursor-pointer' 
                                      onClick={() => setPlayerData({
                                        videoId: lecture.lectureUrl.split('/').pop()
                                      })}
                                    >
                                      Preview
                                    </p>}
                                  <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, {units:['h', 'm']})}</p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>            
                      </div>

                    </div>
                  ))}
                </div>
            </div>
            
            <div className='py-20 text-sm md:text-default'>
              <h3 className='text-xl font-semibold text-gray-600 '>About Course</h3>
              <p 
                dangerouslySetInnerHTML={{__html: courseData.courseDescription}}
                className='pt-3 rich-text '
              />
            </div>
  
          </div>



          {/**Right Column */}
          <div className=' max-w-course-card z-10 shadow-(--shadow-right) md:rounded-lg overflow-hidden bg-white min-w-[300px] sm:min-w-[420px] '>
            
            {
              playerData ? 
                <YouTube videoId={playerData.videoId} options={{playerVars: {autoplay: 1}}} iframeClassName='w-full aspect-video' />

              : <img src={courseData.courseThumbnail} alt="" className='rounded-lg md:rounded-none'/>
            }

            <div className='p-5'>
                  <div className='flex items-center gap-2'>
                    <img src={assets.time_left_clock_icon} alt="time-left-clock" className='w-4'/>
                    <p className='text-red-500'><span className='font-medium'>5 days </span>left at this price</p>
                  </div>

                  <div className='flex items-center gap-3 pt-2'>
                    <p className='text-gray-600 md:text-32xl text-2xl font-semibold'>{currency} {(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}</p>
                    <p className='text-lg text-gray-500 line-through'>{currency} {courseData.coursePrice}</p>
                    <p className='text-lg text-gray-500'>{courseData.discount} % off</p>
                  </div>

                  <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>
                    <div className='flex items-center gap-1'>
                      <img src={assets.star} alt="star-icon"/>
                      <p>{calculateRating(courseData)}</p>
                    </div>

                    <div className='h-4 w-px bg-gray-500/40'/>

                    <div className='flex items-center gap-1'>
                      <img src={assets.time_clock_icon} alt="clock-icon"/>
                      <p>{calculateCourseDuration(courseData)}</p>
                    </div>

                    <div className='h-4 w-px bg-gray-500/40'/>

                    <div className='flex items-center gap-1'>
                      <img src={assets.lesson_icon} alt="clock-icon"/>
                      <p>{calculateNoOfLectures(courseData)} lessons</p>
                    </div>
                  </div>

                  <button 
                    className={` text-white md:mt-6 mt-4 w-full py-3 
                               rounded-lg font-medium transition-all duration-300 
                               ${isAlreadyEnrolled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 cursor-pointer'}`}
                    onClick={enrollCourse}
                  >
                    {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
                  </button>

                  <div className='pt-6'>
                    <p className='md:text-xl text-lg font-medium text-gray-600'>Whats in the course</p>
                    <ul className='ml-4 pt-2 text-sm md:text-default list-disc text-gray-600'>
                      <li>Lifetime access with free updates.</li>
                      <li>Step-by-step, hands-on project guidance.</li>
                      <li>Downloadable resources and source code.</li>
                      <li>Quizzes to test your knowledge.</li>
                      <li>Certificate of completion.</li>
                    </ul>
                  </div>
            </div>
          </div>
        </div>

        <Footer/>
    </>
    
  ) : <Loading/>
}

export default CourseDetails
