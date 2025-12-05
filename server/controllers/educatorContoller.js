import {clerkClient} from '@clerk/express'
import Course from '../models/course.js'
import { v2 as cloudinary} from 'cloudinary'
import { Purchase } from '../models/purchase.js'
import User from '../models/user.js'
import { CourseProgress } from '../models/courseProgress.js'



// update role to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator'
            }
        })

        res.json({success: true, message: 'You can publish a coure now'})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})

        
    }
}



//Add new course
export const addCourse = async (req, res) => {
    try {
        const {courseData} = req.body
        const imageFile = req.file
        const educatorId = req.auth.userId

        if (!imageFile) {
            return res.json({success: false, message: "Thumbnail not attached!"})
        }

        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
        const newCourse = await Course.create(parsedCourseData)

        const imageUpload =  await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url

        await newCourse.save()

        res.json({success: true, message:"Course Added"})

    } catch (error) {
        return res.json({success: false, message: error.message})
        
    }
}


//Get educator courses
export const getEducatorCourses = async(req, res) => {
    try {
        const educator = req.auth.userId
        const courses = await Course.find({educator})
        res.json({success: true, courses})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
        
    }
}



//Get educator Dashboard data ( Total Earning, Enrolled Students, No. of Courses)
export const educatorDashboard = async (req, res) => {
    try {
        const educator = req.auth.userId
        const courses = await Course.find({educator})
        const totalCourses = courses.length;

        const courseIds = courses.map((course) => course._id)

        //Calculate total earnings from purchases
        const purchases = await Purchase.find({
            courseId: {$in: courseIds},   //Give me all purchases where the courseId matches ANY ID inside this array
            status: 'completed'
        })

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)


        // --------------------- TODAY VS YESTERDAY ---------------------
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

        // Enrollments (purchases) today
        const enrollmentsToday = await Purchase.countDocuments({
            courseId: { $in: courseIds },
            status: 'completed',
            createdAt: { $gte: todayStart, $lt: tomorrowStart }
        });

        // Enrollments (purchases) yesterday
        const enrollmentsYesterday = await Purchase.countDocuments({
            courseId: { $in: courseIds },
            status: 'completed',
            createdAt: { $gte: yesterdayStart, $lt: todayStart }
        });

        // Calculate enrollments growth
        const enrollmentsGrowth = enrollmentsYesterday === 0
            ? enrollmentsToday === 0 ? 0 : 100
            : Math.round(((enrollmentsToday - enrollmentsYesterday) / enrollmentsYesterday) * 100);

        // Courses today
        const coursesToday = await Course.countDocuments({
            educator,
            createdAt: { $gte: todayStart, $lt: tomorrowStart }
        });

        // Courses yesterday
        const coursesYesterday = await Course.countDocuments({
            educator,
            createdAt: { $gte: yesterdayStart, $lt: todayStart }
        });

        // Calculate courses growth
        const coursesGrowth = coursesYesterday === 0
            ? coursesToday === 0 ? 0 : 100
            : Math.round(((coursesToday - coursesYesterday) / coursesYesterday) * 100);

        // Earnings today
        const earningsToday = await Purchase.aggregate([
            {
                $match: {
                    courseId: { $in: courseIds },
                    status: 'completed',
                    createdAt: { $gte: todayStart, $lt: tomorrowStart }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const earningsTodayAmount = earningsToday.length > 0 ? earningsToday[0].total : 0;

        // Earnings yesterday
        const earningsYesterday = await Purchase.aggregate([
            {
                $match: {
                    courseId: { $in: courseIds },
                    status: 'completed',
                    createdAt: { $gte: yesterdayStart, $lt: todayStart }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const earningsYesterdayAmount = earningsYesterday.length > 0 ? earningsYesterday[0].total : 0;

        // Calculate earnings growth
        const earningsGrowth = earningsYesterdayAmount === 0
            ? earningsTodayAmount === 0 ? 0 : 100
            : Math.round(((earningsTodayAmount - earningsYesterdayAmount) / earningsYesterdayAmount) * 100);




        // --------------------- ENROLLED STUDENTS ---------------------
        const enrolledStudentsData = [];

        for(const course of courses){
            const students = await User.find({
                _id: {$in : course.enrolledStudents}
            }, 'name imageUrl') ;//find by id and give name and image url

            students.forEach( student=> {
                enrolledStudentsData.push({
                    courseTitle : course.courseTitle,
                    student
                })
            })
        }
        
        // --------------------- RESPONSE ---------------------
        res.json({success: true, dashboardData: {
            totalEarnings,
            enrolledStudentsData,
            totalCourses,
            enrollmentsToday,
            enrollmentsYesterday,
            enrollmentsGrowth,
            coursesToday,
            coursesYesterday,
            coursesGrowth,
            earningsTodayAmount,
            earningsYesterdayAmount,
            earningsGrowth
        }})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
        
    }
}



//Get enrolled student data with purchase data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.auth.userId
        const courses = await Course.find({educator});
        const courseIds = courses.map((course) => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl email').populate('courseId', 'courseTitle')

        // Get progress for each student
        const enrolledStudents = await Promise.all(
            purchases.map(async (purchase) => {
                const progressData = await CourseProgress.findOne({
                    userId: purchase.userId._id.toString(),
                    courseId: purchase.courseId._id.toString()
                });

                // Calculate progress percentage
                const totalLectures = progressData?.lectureCompleted?.length || 0;
                const progressPercentage = totalLectures > 0 ? Math.round((totalLectures / Math.max(totalLectures, 1)) * 100) : 0;

                return {
                    student: purchase.userId,
                    courseTitle: purchase.courseId.courseTitle,
                    purchaseDate: purchase.createdAt,
                    progress: progressPercentage,
                    lecturesCompleted: totalLectures,
                    isCompleted: progressData?.completed || false
                };
            })
        );

        res.json({success: true, enrolledStudents})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}


/* BACKEND - Add this new endpoint to calculate average progress: */
export const getStudentsProgressStats = async (req, res) => {
    try {
        const educator = req.auth.userId
        const courses = await Course.find({educator});
        const courseIds = courses.map((course) => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        })

        // Get all progress data for these students and courses
        const progressRecords = await CourseProgress.find({
            courseId: { $in: courseIds }
        });

        // Calculate average progress
        let totalProgress = 0;
        let totalRecords = progressRecords.length;

        progressRecords.forEach(record => {
            const progressPercentage = record.lectureCompleted?.length || 0;
            totalProgress += progressPercentage;
        });

        const averageProgress = totalRecords > 0 
            ? Math.round((totalProgress / (totalRecords * 10)) * 100) // Assuming avg 10 lectures per course
            : 0;

        // Get enrollments from this week
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const recentEnrollments = await Purchase.countDocuments({
            courseId: { $in: courseIds },
            status: 'completed',
            createdAt: { $gte: weekAgo, $lte: now }
        });

        res.json({
            success: true,
            stats: {
                averageProgress,
                recentEnrollments,
                totalEnrollments: purchases.length,
                completedCourses: progressRecords.filter(r => r.completed).length
            }
        })

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}