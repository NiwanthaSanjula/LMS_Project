/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from 'react';
import humanizeDuration from 'humanize-duration'
import { dummyCourses } from '../assets/assets';
import { useNavigate } from 'react-router-dom';


export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()
    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(false)

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
    

    //calculate course chapter time
    const calculateChaperTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)

        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})
    }


    //calculate course duration
    const calculateCourseDuration = (course) => {
        let time = 0;

        course.courseContent.map(
            (chapter) => chapter.chapterContent.map(
                (lecture) => time +=  lecture.lectureDuration )
        )

        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})
    }


    //calculate total number of lectures in each course
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;

        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length
            }
        });

        return totalLectures;
    }


    
    const value = {
        currency,
        allCourses,
        navigate,
        calculateRating,
        isEducator, setIsEducator,
        calculateChaperTime,
        calculateCourseDuration,
        calculateNoOfLectures
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