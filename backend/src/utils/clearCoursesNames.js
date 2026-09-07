const getCompletedCourseNames = (roadmapCourses) =>{
  return  new Set(
        (roadmapCourses || [])
            .filter(c => c.isCompleted)
            .map(c => c.courseName.toLowerCase())
    );
}

export default getCompletedCourseNames