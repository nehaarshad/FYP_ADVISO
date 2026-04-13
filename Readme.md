###### PROGRAM COURSE DETAILS SHEET PROCESSING STEPS ######

// Although some course code remains same but their credit or name vary by roadmap version

1. find similar (course code) OR (course name AND credits) 
            -> if not found, add new course in db 
            -> if found, chech with attribute need to update as coursecode,course name or just course credit
                  -> if course code or course credit differ, then create new course with similar course id otherwise just update course code if needed
2. Store all courses with complete details in MAP variable and access them via course name
3. list of courses to highlights that which course have a preReq or have not (this preReq course also fetch from sheet)
                  -> If preReq course name is given in sheet, then this course details are comes from the MAP variable access via this courseName
4. In last step, in CoursePreReqModel, find or create a new instance by providing a courseId and PreReqCourseId(that might be a null)

###### PROGRAM BATCH ROADMAP PROCESSING STEPS ######

find or create a new batch and assign a specific required program as CS, or SE

1. Extract the roadmap version name from worksheet name and verify that this similar roadmap of SE or CS program already exists or not.
                  |-> then assign this roadmapid to the upcoming new program batch 

2. Detect bottom summary 2nd last row, read cells filled color and category name -> store them in MAP vaiable (key is color)
            |-> add this category name in category model.
            |-> from the next bottom row of a sheet->  extract required credits per course category of a roadmap, accesses via color code
                  |-> add this details to roadmapCourseCategoryModel (include color code, req credits and category id)

3. Then, process the semester rows (2 & 3), to identify how many semesters are present in this roadmap and credits offer per semester |
            -> save this info in roadmapSemesterModel
4. Then, iterate from row 4 till 6 consective columns cell are empty, bcz below this, the category summary row is started

5. process courses row wise, based on column-> accessed semesteer no., and cell fill coloe identify the course category,
            |-> normalized the course text as to split the  
                course name and course credits seperately
                  |-> find the course in db via course name and credits -> if not found and create a new one
            |-> then CourseCategory model is populated with
                this course id, category id
6. In SemesterCourseModel, this coursecategory id and roadmap id is save that provide this roadmap has this semester in which this course is offered whose category is this !

###### SESSIONAL COURSE OFFERING & TIMETABLE SHEET PROCESSING STEPS ######



1. find similar (course code) OR (course name AND credits) 
            -> if not found, add new course in db 
            -> if found, chech with attribute need to update as coursecode,course name or just course credit
                  -> if course code or course credit differ, then create new course with similar course id otherwise just update course code if needed
2. Store all courses with complete details in MAP variable and access them via course name
3. list of courses to highlights that which course have a preReq or have not (this preReq course also fetch from sheet)
                  -> If preReq course name is given in sheet, then this course details are comes from the MAP variable access via this courseName
4. In last step, in CoursePreReqModel, find or create a new instance by providing a courseId and PreReqCourseId(that might be a null)














      | node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

      //plural->sigular difference  not found->timetableCourseOfferingMapping
