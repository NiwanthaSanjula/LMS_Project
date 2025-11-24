/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from 'react';
import { dummyCourses } from '../assets/assets';
import { useNavigate } from 'react-router-dom';


export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()
    const [allCourses, setAllCourses] = useState([])

    //fetch all courses
    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses)
    }

    //calculate avg. rating of course
    const calculateRating = (course) => {
        if (course.courseRatings.length === 0) {
            return 0;
        }

        let totalRating = 0
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })

        return totalRating / course.courseRatings.length
    }
    
    const value = {
        currency,
        allCourses,
        navigate,
        calculateRating
    }

    useEffect(() => {
      fetchAllCourses()
    }, [])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}