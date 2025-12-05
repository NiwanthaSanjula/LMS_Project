/* eslint-disable react-hooks/exhaustive-deps */


import React, { useContext, useEffect, useState } from 'react'
import { Users, BookOpen, Calendar, TrendingUp, UserCheck, Clock, Filter } from 'lucide-react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'



const Loading = () => (
  <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100'>
    <div className='text-center'>
      <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
      <p className='text-slate-600 font-medium'>Loading enrolled students...</p>
    </div>
  </div>
)

const StudentsEnrolled = () => {

  const { backendUrl, getToken, isEducator } = useContext(AppContext)
  const [enrolledStudent, setEnrolledStudent] = useState(null)

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get( backendUrl + '/api/educator/enrolled-students', {headers: {Authorization: `Bearer ${token}`}})

      if (data.success) {
        setEnrolledStudent(data.enrolledStudents.reverse())
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents()
    }
  }, [isEducator])

  // Calculate stats
  const totalEnrollments = enrolledStudent?.length || 0

  const recentEnrollments = enrolledStudent?.filter(student => {
    const enrollDate = new Date(student.purchaseDate)
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return enrollDate >= weekAgo && enrollDate <= now
  }).length || 0

  // Calculate average progress from the progress field returned by backend
  const averageProgress = enrolledStudent && enrolledStudent.length > 0
  ? enrolledStudent.reduce((sum, student) => sum + (student.progress || 0), 0) / enrolledStudent.length
  : 0

  // Alternative: If you want to calculate from lecturesCompleted
  /* const averageProgress = enrolledStudent && enrolledStudent.length > 0
     /*? enrolledStudent.reduce((sum, student) => sum + (student.lecturesCompleted || 0), 0) / enrolledStudent.length
     : 0*/

  return enrolledStudent ? (
    <div className='min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8'>
      <div className='max-w-5xl'>

        {/* Header Section */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-800 mb-2'>Students Enrolled</h1>
          <p className='text-slate-600'>Track and manage all students enrolled in your courses</p>
        </div>

        {/* Summary Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          
          {/* Total Enrollments */}
          <div className='bg-white rounded-xl shadow-sm border-l-6 border-blue-600 p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='p-3 bg-blue-100 rounded-lg'>
                <Users className='w-6 h-6 text-blue-600' />
              </div>
            </div>
            <div>
              <p className='text-3xl font-bold text-slate-800 mb-1'>
                {totalEnrollments}
              </p>
              <p className='text-sm text-slate-600 font-medium'>Total Enrollments</p>
              <p className='text-xs text-slate-500 mt-2'>All-time students</p>
            </div>
          </div>

          {/* Recent Enrollments */}
          <div className='bg-white rounded-xl shadow-sm border-l-6 border-green-600 p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='p-3 bg-green-100 rounded-lg'>
                <TrendingUp className='w-6 h-6 text-green-600' />
              </div>
            </div>
            <div>
              <p className='text-3xl font-bold text-slate-800 mb-1'>
                {recentEnrollments}
              </p>
              <p className='text-sm text-slate-600 font-medium'>New This Week</p>
              <p className='text-xs text-slate-500 mt-2'>Last 7 days</p>
            </div>
          </div>

          {/* Average Progress */}
          <div className='bg-white rounded-xl shadow-sm border-l-6 border-purple-600 p-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='p-3 bg-purple-100 rounded-lg'>
                <UserCheck className='w-6 h-6 text-purple-600' />
              </div>
            </div>
            <div>
              <p className='text-3xl font-bold text-slate-800 mb-1'>
                {Math.round(averageProgress)}%
              </p>
              <p className='text-sm text-slate-600 font-medium'>Avg. Progress</p>
              <p className='text-xs text-slate-500 mt-2'>Course completion</p>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className='bg-white rounded-xl shadow-sm border-l-6 border-blue-600 overflow-hidden'>
          <div className='p-6 border-b border-slate-200'>
            <div className='flex items-center justify-between flex-wrap gap-4'>
              <div>
                <h2 className='text-xl font-semibold text-slate-800 flex items-center gap-2'>
                  <Users className='w-5 h-5 text-blue-600' />
                  All Enrolled Students
                </h2>
                <p className='text-sm text-slate-600 mt-1'>Complete list of students and their enrollments</p>
              </div>
              <button className='px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm flex items-center gap-2'>
                <Filter className='w-4 h-4' />
                Filter
              </button>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-slate-50 border-b border-slate-200'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell'>
                    #
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                    Student
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                    Course Enrolled
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                    Progress
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                    Enrolled Date
                  </th>
                </tr>
              </thead>

              <tbody className='divide-y divide-slate-200'>
                {enrolledStudent.map((item, index) => (
                  <tr key={index} className='hover:bg-slate-50 transition-colors'>
                    
                    <td className='px-6 py-4 text-sm text-slate-500 font-medium hidden md:table-cell'>
                      {String(index + 1).padStart(2, '0')}
                    </td>

                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='relative'>
                          <img 
                            src={item.student.imageUrl} 
                            alt={item.student.name}
                            className='w-10 h-10 rounded-full border-2 border-slate-200'
                          />
                          <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
                        </div>
                        <div>
                          <p className='text-sm font-medium text-slate-800'>{item.student.name}</p>
                          <p className='text-xs text-slate-500'>{item.student.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <BookOpen className='w-4 h-4 text-slate-400 shrink-0' />
                        <span className='text-sm text-slate-700 truncate max-w-xs'>{item.courseTitle}</span>
                      </div>
                    </td>

                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='flex-1 bg-slate-200 rounded-full h-2 max-w-[100px]'>
                          <div 
                            className='bg-linear-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300'
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                        <span className='text-sm font-medium text-slate-700 min-w-[45px]'>
                          {item.progress}%
                        </span>
                      </div>
                    </td>

                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <Calendar className='w-4 h-4 text-slate-400' />
                        <div>
                          <span className='text-sm text-slate-700 block'>
                            {new Date(item.purchaseDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                          <span className='text-xs text-slate-500 flex items-center gap-1'>
                            <Clock className='w-3 h-3' />
                            {new Date(item.purchaseDate).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className='p-4 bg-slate-50 border-t border-slate-200'>
            <p className='text-sm text-slate-600 text-center'>
              Showing <span className='font-medium text-slate-800'>{enrolledStudent.length}</span> enrolled {enrolledStudent.length === 1 ? 'student' : 'students'}
            </p>
          </div>
        </div>

      </div>
    </div>
  ) : <Loading/>
}

export default StudentsEnrolled