/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useContext, useEffect, useState } from 'react'
import { Users, BookOpen, DollarSign, TrendingUp, Award } from 'lucide-react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Loading = () => (
  <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100'>
    <div className='text-center'>
      <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
      <p className='text-slate-600 font-medium'>Loading dashboard...</p>
    </div>
  </div>
)

const Dashboard = () => {

  const { backendUrl, currency, getToken, isEducator  } = useContext(AppContext)

  const [dashboardData, setdashboardData] = useState(null)

  const fetchDashboardData = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get( backendUrl + '/api/educator/dashboard', {headers: {Authorization: `Bearer ${token}`}})

      if (data.success) {
        setdashboardData(data.dashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData()
    }
  }, [isEducator])

  return dashboardData ? (
    <div className='min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8'>
      <div className='max-w-5xl'>
        
        {/* Header Section */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-800 mb-2'>Dashboard Overview</h1>
          <p className='text-slate-600'>Welcome back! Here's what's happening with your courses today.</p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          
          {/* Total Enrollments Card */}
          <div className='bg-white rounded-xl shadow-sm border-l-6 border-blue-600 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1'>
            <div className='flex items-center justify-between mb-4'>
              <div className='p-3 bg-blue-100 rounded-lg'>
                <Users className='w-6 h-6 text-blue-600' />
              </div>
              <div className='flex items-center gap-1 text-green-600 text-sm font-medium'>
                <TrendingUp className='w-4 h-4' />
                <span>+12%</span>
              </div>
            </div>
            <div>
              <p className='text-3xl font-bold text-slate-800 mb-1'>
                {dashboardData.enrolledStudentsData.length}
              </p>
              <p className='text-sm text-slate-600 font-medium'>Total Enrollments</p>
              <p className='text-xs text-slate-500 mt-2'>Active students learning</p>
            </div>
          </div>

          {/* Total Courses Card */}
          <div className='bg-white rounded-xl shadow-sm border-l-6 border-purple-600 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1'>
            <div className='flex items-center justify-between mb-4'>
              <div className='p-3 bg-purple-100 rounded-lg'>
                <BookOpen className='w-6 h-6 text-purple-600' />
              </div>
              <div className='flex items-center gap-1 text-green-600 text-sm font-medium'>
                <TrendingUp className='w-4 h-4' />
                <span>+8%</span>
              </div>
            </div>
            <div>
              <p className='text-3xl font-bold text-slate-800 mb-1'>
                {dashboardData.totalCourses}
              </p>
              <p className='text-sm text-slate-600 font-medium'>Total Courses</p>
              <p className='text-xs text-slate-500 mt-2'>Published and active</p>
            </div>
          </div>

          {/* Total Earnings Card */}
          <div className='bg-white rounded-xl shadow-sm border-l-6 border-green-600 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1'>
            <div className='flex items-center justify-between mb-4'>
              <div className='p-3 bg-green-100 rounded-lg'>
                <DollarSign className='w-6 h-6 text-green-600' />
              </div>
              <div className='flex items-center gap-1 text-green-600 text-sm font-medium'>
                <TrendingUp className='w-4 h-4' />
                <span>+24%</span>
              </div>
            </div>
            <div>
              <p className='text-3xl font-bold text-slate-800 mb-1'>
                {currency}{dashboardData.totalEarnings.toLocaleString()}
              </p>
              <p className='text-sm text-slate-600 font-medium'>Total Earnings</p>
              <p className='text-xs text-slate-500 mt-2'>Revenue this month</p>
            </div>
          </div>
        </div>

        {/* Latest Enrollments Section */}
        <div className='bg-white rounded-xl shadow-sm border-l-6 border-blue-600 overflow-hidden'>
          <div className='p-6 border-b border-slate-200'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-semibold text-slate-800 flex items-center gap-2'>
                  <Award className='w-5 h-5 text-blue-600' />
                  Latest Enrollments
                </h2>
                <p className='text-sm text-slate-600 mt-1'>Recent students who joined your courses</p>
              </div>
              <button className='text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline transition-colors'>
                View All
              </button>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-slate-50 border-b border-slate-200'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden sm:table-cell'>
                    #
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                    Student Name
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider'>
                    Course Enrolled
                  </th>
                  <th className='px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell'>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className='divide-y divide-slate-200'>
                {dashboardData.enrolledStudentsData.map((item, index) => (
                  <tr key={index} className='hover:bg-slate-50 transition-colors'>
                    <td className='px-6 py-4 text-sm text-slate-500 font-medium hidden sm:table-cell'>
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
                          <p className='text-xs text-slate-500'>Active learner</p>
                        </div>
                      </div>
                    </td>

                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        <BookOpen className='w-4 h-4 text-slate-400' />
                        <span className='text-sm text-slate-700'>{item.courseTitle}</span>
                      </div>
                    </td>

                    <td className='px-6 py-4 text-center hidden md:table-cell'>
                      <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700'>
                        Enrolled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className='p-4 bg-slate-50 border-t border-slate-200'>
            <p className='text-sm text-slate-600 text-center'>
              Showing <span className='font-medium text-slate-800'>{dashboardData.enrolledStudentsData.length}</span> of <span className='font-medium text-slate-800'>{dashboardData.enrolledStudentsData.length}</span> enrollments
            </p>
          </div>
        </div>

      </div>
    </div>

  ) : <Loading/>
}

export default Dashboard