import React, { useEffect, useRef, useState } from 'react'
import uniqid from 'uniqid'
import Quill from 'quill'
import { Camera, Plus, Trash2, ChevronDown, X, FileText, Clock, ExternalLink, Lock, Unlock } from 'lucide-react'

const AddCourse = () => {

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [image, setImage] = useState(null)
  const [chapters, setChapters] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [currentChapterId, setCurrentChapterId] = useState(null)
  
  const [lectureDetails, setLectureDetails] = useState(
    {
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
      
    }
  )

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name: ');
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent : [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter])
      }

    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) => chapter.chapterId === chapterId ? {...chapter, collapsed: !chapter.collapsed} : chapter)
      );
    }
  };



  const handleLectures = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    }
  };



  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
            lectureId: uniqid()
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()


  }



  useEffect(() => {

    //Initiate Quill only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',

      })
    }
  }, [])



  return (
    <div className='min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8'>
      <div className='max-w-5xl'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-800 mb-2'>Create New Course</h1>
          <p className='text-slate-600'>Fill in the details below to add a new course to the platform</p>
        </div>

        <div onSubmit={handleSubmit} className='space-y-6'>
          {/* Course Basic Info Card */}
          <div className='bg-white rounded-xl shadow-lg border-l-6 border-blue-600 p-6 md:p-8'>
            <h2 className='text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2'>
              <FileText className='w-5 h-5 text-blue-600' />
              Course Information
            </h2>

            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                  Course Title
                </label>
                <input 
                  type="text" 
                  placeholder='e.g., Complete Web Development Bootcamp'
                  onChange={(e) => setCourseTitle(e.target.value)}
                  value={courseTitle}
                  required
                  className='w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                  Course Description
                </label>
                <div ref={editorRef} className='rounded-lg border border-slate-300 bg-white min-h-[200px]'></div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Course Price ($)
                  </label>
                  <input 
                    type="number" 
                    placeholder='99.99'
                    onChange={(e) => setCoursePrice(e.target.value)}
                    value={coursePrice}
                    required
                    className='w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Discount (%)
                  </label>
                  <input 
                    type="number" 
                    placeholder='10'
                    min={0}
                    max={100}
                    onChange={(e) => setDiscount(e.target.value)}
                    value={discount}
                    required
                    className='w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-3'>
                  Course Thumbnail
                </label>
                <div className='flex items-center gap-4'>
                  <label htmlFor="thumbnailImage" className='cursor-pointer'>
                    <div className='flex items-center gap-3 px-6 py-3 bg-blue-50 text-blue-600 rounded-lg border-2 border-dashed border-blue-300 hover:bg-blue-100 transition-all'>
                      <Camera className='w-5 h-5' />
                      <span className='font-medium'>Choose Image</span>
                    </div>
                    <input 
                      type="file"
                      id='thumbnailImage'
                      onChange={(e) => setImage(e.target.files[0])}
                      accept='image/*'
                      hidden
                    />
                  </label>
                  {image && (
                    <div className='relative'>
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt="Thumbnail preview" 
                        className='h-20 w-20 object-cover rounded-lg border-2 border-slate-200'
                      />
                      <button
                        type='button'
                        onClick={() => setImage(null)}
                        className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'
                      >
                        <X className='w-3 h-3' />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Course Curriculum Card */}
          <div className='bg-white rounded-xl shadow-lg  border-l-6 border-blue-600 p-6 md:p-8'>
            <h2 className='text-xl font-semibold text-slate-800 mb-6'>Course Curriculum</h2>

            <div className='space-y-4'>
              {chapters.map((chapter, chapterIndex) => (
                <div key={chapterIndex} className='border border-slate-200 rounded-lg overflow-hidden bg-slate-50'>
                  <div className='flex justify-between items-center p-4 bg-white border-b border-slate-200'>
                    <div className='flex items-center gap-3 flex-1'>
                      <button
                        type='button'
                        onClick={() => handleChapter('toggle', chapter.chapterId)}
                        className='text-slate-600 hover:text-slate-800 transition-colors'
                      >
                        <ChevronDown 
                          className={`w-5 h-5 transition-transform duration-200 ${chapter.collapsed ? '-rotate-90' : ''}`}
                        />
                      </button>
                      <span className='font-semibold text-slate-800'>
                        Chapter {chapterIndex + 1}: {chapter.chapterTitle}
                      </span>
                    </div>

                    <div className='flex items-center gap-4'>
                      <span className='text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full'>
                        {chapter.chapterContent.length} Lectures
                      </span>
                      <button
                        type='button'
                        onClick={() => handleChapter('remove', chapter.chapterId)}
                        className='text-red-500 hover:text-red-700 transition-colors'
                      >
                        <Trash2 className='w-5 h-5' />
                      </button>
                    </div>
                  </div>

                  {!chapter.collapsed && (
                    <div className='p-4 space-y-3'>
                      {chapter.chapterContent.map((lecture, lectureIndex) => (
                        <div key={lectureIndex} className='flex justify-between items-center bg-white p-4 rounded-lg border-l-6 border-blue-600 hover:border-blue-400 transition-colors'>
                          <div className='flex items-start gap-3 flex-1'>
                            <span className='text-sm font-medium text-slate-500 mt-1'>
                              {lectureIndex + 1}.
                            </span>
                            <div className='flex-1'>
                              <h4 className='font-medium text-slate-800 mb-1'>{lecture.lectureTitle}</h4>
                              <div className='flex items-center gap-4 text-sm text-slate-600'>
                                <span className='flex items-center gap-1'>
                                  <Clock className='w-4 h-4' />
                                  {lecture.lectureDuration} mins
                                </span>
                                <a 
                                  href={lecture.lectureUrl} 
                                  target='_blank' 
                                  rel='noopener noreferrer'
                                  className='flex items-center gap-1 text-blue-600 hover:text-blue-700'
                                >
                                  <ExternalLink className='w-4 h-4' />
                                  View
                                </a>
                                <span className='flex items-center gap-1'>
                                  {lecture.isPreviewFree ? (
                                    <>
                                      <Unlock className='w-4 h-4 text-green-600' />
                                      <span className='text-green-600'>Free Preview</span>
                                    </>
                                  ) : (
                                    <>
                                      <Lock className='w-4 h-4 text-amber-600' />
                                      <span className='text-amber-600'>Paid</span>
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            type='button'
                            onClick={() => handleLectures('remove', chapter.chapterId, lectureIndex)}
                            className='text-red-500 hover:text-red-700 transition-colors ml-4'
                          >
                            <Trash2 className='w-5 h-5' />
                          </button>
                        </div>
                      ))}

                      <button
                        type='button'
                        onClick={() => handleLectures('add', chapter.chapterId)}
                        className='w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-3 rounded-lg border-2 border-dashed border-blue-300 hover:bg-blue-100 transition-all font-medium'
                      >
                        <Plus className='w-5 h-5' />
                        Add Lecture
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <button
                type='button'
                onClick={() => handleChapter('add')}
                className='w-full flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-md'
              >
                <Plus className='w-5 h-5' />
                Add New Chapter
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className='flex justify-end'>
            <button
              type='submit'
              className='bg-linear-to-r from-green-600 to-green-700 text-white px-12 py-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-md text-lg'
            >
              Create Course
            </button>
          </div>
        </div>

        {/* Lecture Popup Modal */}
        {showPopup && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50 backdrop-blur-sm'>
            <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200'>
              <div className='flex justify-between items-center p-6 border-b border-slate-200'>
                <h2 className='text-2xl font-bold text-slate-800'>Add New Lecture</h2>
                <button
                  type='button'
                  onClick={() => setShowPopup(false)}
                  className='text-slate-400 hover:text-slate-600 transition-colors'
                >
                  <X className='w-6 h-6' />
                </button>
              </div>

              <div className='p-6 space-y-5'>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Lecture Title
                  </label>
                  <input 
                    type="text" 
                    placeholder='e.g., Introduction to React Hooks'
                    onChange={(e) => setLectureDetails({...lectureDetails, lectureTitle: e.target.value })}
                    value={lectureDetails.lectureTitle}
                    required
                    className='w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Duration (minutes)
                  </label>
                  <input 
                    type="number" 
                    placeholder='30'
                    onChange={(e) => setLectureDetails({...lectureDetails, lectureDuration: e.target.value })}
                    value={lectureDetails.lectureDuration}
                    required
                    className='w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>
                    Lecture URL
                  </label>
                  <input 
                    type="text" 
                    placeholder='https://example.com/lecture'
                    onChange={(e) => setLectureDetails({...lectureDetails, lectureUrl: e.target.value })}
                    value={lectureDetails.lectureUrl}
                    required
                    className='w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none'
                  />
                </div>

                <div className='flex items-center gap-3 bg-slate-50 p-4 rounded-lg'>
                  <input 
                    type="checkbox"
                    id='isPreviewFree'
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) => setLectureDetails({...lectureDetails, isPreviewFree: e.target.checked })}
                    className='w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-200 cursor-pointer'
                  />
                  <label htmlFor='isPreviewFree' className='text-sm font-medium text-slate-700 cursor-pointer'>
                    Make this lecture available as a free preview
                  </label>
                </div>
              </div>

              <div className='p-6 border-t border-slate-200 flex gap-3'>
                <button
                  type='button'
                  onClick={() => setShowPopup(false)}
                  className='flex-1 px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-all'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  className='flex-1 bg-linear-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-md'
                  onClick={() => addLecture()}
                >
                  Add Lecture
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddCourse