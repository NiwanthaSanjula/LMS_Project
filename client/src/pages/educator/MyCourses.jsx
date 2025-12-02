/* eslint-disable react-hooks/exhaustive-deps */

import React, { useContext, useEffect, useState } from 'react'
import { BookOpen, Users, DollarSign, Calendar, TrendingUp, Eye } from 'lucide-react'

// Mock context for demonstration
const AppContext = React.createContext({ 
  currency: '$',
  allCourses: [
    {
      _id: '1',
      courseThumbnail: 'https://images.unsplash.com/photo-1516397281156-ca07cf9746fc?w=400',
      courseTitle: 'Complete Web Development Bootcamp',
      coursePrice: 99.99,
      discount: 20,
      enrolledStudents: Array(145).fill({}),
      createdAt: '2024-01-15'
    },
    {
      _id: '2',
      courseThumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      courseTitle: 'Advanced React & Redux',
      coursePrice: 79.99,
      discount: 15,
      enrolledStudents: Array(98).fill({}),
      createdAt: '2024-02-20'
    },
    {
      _id: '3',
      courseThumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400',
      courseTitle: 'Python for Data Science',
      coursePrice: 89.99,
      discount: 10,
      enrolledStudents: Array(234).fill({}),
      createdAt: '2024-03-10'
    },
    {
      _id: '4',
      courseThumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
      courseTitle: 'UI/UX Design Masterclass',
      coursePrice: 69.99,
      discount: 25,
      enrolledStudents: Array(76).fill({}),
      createdAt: '2024-04-05'
    }
  ]
})

const Loading = () => (
  <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100'>
    <div className='text-center'>
      <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
      <p className='text-slate-600 font-medium'>Loading courses...</p>
    </div>
  </div>
)

const MyCourses = () => {

  const { currency, allCourses } = useContext(AppContext)

  const [courses, setCourses] = useState(null)

  const fetchEducatorCourses = async () => {
    setCourses(allCourses)
  }

  useEffect(() => {
    fetchEducatorCourses()
  }, [])

  // Calculate total stats
  const totalEarnings = courses?.reduce((sum, course) => 
    sum + Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100)), 0
  ) || 0

  const totalStudents = courses?.reduce((sum, course) => sum + course.enrolledStudents.length, 0) || 0

  return courses ? (

    <div className='min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8'>
      <div className='max-w-5xl '>

        {/* Header Section */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-800 mb-2'>My Courses</h1>
          <p className='text-slate-600'>Manage and track the performance of your courses</p>
        </div>

        {/* Summary Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          
          {/* Total Courses */}
          <div className='bg-white rounded-xl shadow-sm border-l-6 border-blue-600 p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='p-3 bg-blue-100 rounded-lg'>
                <BookOpen className='w-6 h-6 text-blue-600' />
              </div>
            </div>
            <div>
              <p className='text-3xl font-bold text-slate-800 mb-1'>
                {courses.length}
              </p>
              <p className='text-sm text-slate-600 font-medium'>Total Courses</p>
            </div>
          </div>

          {/* Total Students */}
          <div className='bg-white rounded-xl shadow-sm border-l-6 border-purple-600 p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='p-3 bg-purple-100 rounded-lg'>
                <Users className='w-6 h-6 text-purple-600' />
              </div>
            </div>
            <div>
              <p className='text-3xl font-bold text-slate-800 mb-1'>
                {totalStudents}
              </p>
              <p className='text-sm text-slate-600 font-medium'>Total Students</p>
            </div>
          </div>

          {/* Total Revenue */}
          <div className='bg-white rounded-xl shadow-sm border-l-6 border-green-600 p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='p-3 bg-green-100 rounded-lg'>
                <DollarSign className='w-6 h-6 text-green-600' />
              </div>
            </div>
            <div>
              <p className='text-3xl font-bold text-slate-800 mb-1'>
                {currency}{totalEarnings.toLocaleString()}
              </p>
              <p className='text-sm text-slate-600 font-medium'>Total Revenue</p>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className='bg-white rounded-xl shadow-sm border-l-6 border-blue-600 overflow-hidden'>
          <div className='p-6 border-b border-slate-200'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-semibold text-slate-800 flex items-center gap-2'>
                  <BookOpen className='w-5 h-5 text-blue-600' />
                  All Courses
                </h2>
                <p className='text-sm text-slate-600 mt-1'>Overview of all your published courses</p>
              </div>
              <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2'>
                <TrendingUp className='w-4 h-4' />
                View Analytics
              </button>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-slate-50 border-b border-slate-200'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                    Course
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                    Earnings
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                    Students
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                    Published
                  </th>
                  <th className='px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className='divide-y divide-slate-200'>
                {courses.map((course) => {
                  const earnings = Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100))
                  
                  return (
                    <tr key={course._id} className='hover:bg-slate-50 transition-colors'>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-4'>
                          <img 
                            src={course.courseThumbnail} 
                            alt={course.courseTitle}
                            className='w-20 h-14 object-cover rounded-lg border border-slate-200'
                          />
                          <div className='min-w-0'>
                            <p className='text-sm font-medium text-slate-800 truncate max-w-xs'>
                              {course.courseTitle}
                            </p>
                            <p className='text-xs text-slate-500 mt-1'>
                              {course.discount > 0 && (
                                <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700'>
                                  {course.discount}% OFF
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <DollarSign className='w-4 h-4 text-green-600' />
                          <span className='text-sm font-semibold text-slate-800'>
                            {currency}{earnings.toLocaleString()}
                          </span>
                        </div>
                        <p className='text-xs text-slate-500 mt-1'>
                          {currency}{course.coursePrice} base price
                        </p>
                      </td>

                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <Users className='w-4 h-4 text-purple-600' />
                          <span className='text-sm font-semibold text-slate-800'>
                            {course.enrolledStudents.length}
                          </span>
                        </div>
                        <p className='text-xs text-slate-500 mt-1'>enrolled</p>
                      </td>

                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <Calendar className='w-4 h-4 text-slate-400' />
                          <span className='text-sm text-slate-700'>
                            {new Date(course.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      </td>

                      <td className='px-6 py-4 text-center'>
                        <button className='inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium'>
                          <Eye className='w-4 h-4' />
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className='p-4 bg-slate-50 border-t border-slate-200'>
            <p className='text-sm text-slate-600 text-center'>
              Showing <span className='font-medium text-slate-800'>{courses.length}</span> {courses.length === 1 ? 'course' : 'courses'}
            </p>
          </div>
        </div>

      </div>
    </div>

  ) : <Loading/>
} 

export default MyCourses