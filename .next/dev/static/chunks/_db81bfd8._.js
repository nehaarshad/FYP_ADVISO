(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/localStorage/authLocalStorageService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LocalStorageService",
    ()=>LocalStorageService,
    "localStorageService",
    ()=>localStorageService
]);
class LocalStorageService {
    static instance;
    AuthStorageKeys = {
        USER_KEY: 'user',
        TOKEN_KEY: 'token'
    };
    constructor(){}
    static getInstance() {
        if (!LocalStorageService.instance) {
            LocalStorageService.instance = new LocalStorageService();
        }
        return LocalStorageService.instance;
    }
    isBrowser() {
        return ("TURBOPACK compile-time value", "object") !== 'undefined';
    }
    setItem(key, value) {
        if (this.isBrowser()) {
            localStorage.setItem(key, JSON.stringify(value));
            return; // Exit early on success
        }
        // Only log warning when actually on server side
        console.warn('Attempted to set item in localStorage on the server side. This operation is ignored.');
    }
    getItem(key) {
        if (this.isBrowser()) {
            const item = localStorage.getItem(key);
            console.log(`Getting item from localStorage with key: ${key}, value: ${item}`);
            return item ? JSON.parse(item) : null;
        }
        console.warn('Attempted to get item from localStorage on the server side. This operation is ignored.');
        return null;
    }
    removeItem(key) {
        if (this.isBrowser()) {
            localStorage.removeItem(key);
            return;
        }
        console.warn('Attempted to remove item from localStorage on the server side. This operation is ignored.');
    }
    // Specific methods for user
    saveUser(user) {
        this.setItem(this.AuthStorageKeys.USER_KEY, user);
    }
    getUser() {
        return this.getItem(this.AuthStorageKeys.USER_KEY);
    }
    removeUser() {
        this.removeItem(this.AuthStorageKeys.USER_KEY);
    }
    clearAuthStorage() {
        if (this.isBrowser()) {
            console.log('Clearing auth storage: Removing user and token from localStorage');
            localStorage.removeItem(this.AuthStorageKeys.USER_KEY);
            localStorage.removeItem(this.AuthStorageKeys.TOKEN_KEY);
        }
    }
    // Specific methods for token
    saveToken(token) {
        this.setItem(this.AuthStorageKeys.TOKEN_KEY, token);
    }
    getToken() {
        return this.getItem(this.AuthStorageKeys.TOKEN_KEY);
    }
    removeToken() {
        this.removeItem(this.AuthStorageKeys.TOKEN_KEY);
    }
    // Check if user is authenticated
    isAuthenticated() {
        if (!this.isBrowser()) return false;
        return !!this.getToken() && !!this.getItem(this.AuthStorageKeys.USER_KEY);
    }
}
const localStorageService = LocalStorageService.getInstance();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/sessionManagement/sessionManager.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SessionManager",
    ()=>SessionManager,
    "sessionManager",
    ()=>sessionManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$localStorage$2f$authLocalStorageService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/localStorage/authLocalStorageService.ts [app-client] (ecmascript)");
;
class SessionManager {
    static instance;
    localStorageService = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$localStorage$2f$authLocalStorageService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"];
    constructor(){}
    static getInstance() {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager();
        }
        return SessionManager.instance;
    }
    // Create session after successful login/signup
    createSession(user, token) {
        this.localStorageService.saveUser(user);
        this.localStorageService.saveToken(token);
    }
    destroySession() {
        this.localStorageService.clearAuthStorage();
    }
    // Check if session exists
    hasActiveSession() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$localStorage$2f$authLocalStorageService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].isAuthenticated();
    }
    getSessionToken() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$localStorage$2f$authLocalStorageService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].getToken();
    }
    getCurrentUser() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$localStorage$2f$authLocalStorageService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].getUser();
    }
    getAuthHeaders() {
        const token = this.getSessionToken();
        if (token) {
            return {
                Authorization: `Bearer ${token}`
            };
        }
        return {};
    }
}
const sessionManager = SessionManager.getInstance();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/baseApiServices/baseNetworkService/baseNetwork.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BaseApiService",
    ()=>BaseApiService
]);
/* eslint-disable @typescript-eslint/no-explicit-any */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$sessionManagement$2f$sessionManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/sessionManagement/sessionManager.ts [app-client] (ecmascript)");
;
class BaseApiService {
    currentUser = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$sessionManagement$2f$sessionManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sessionManager"].getCurrentUser();
    token = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$sessionManagement$2f$sessionManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sessionManager"].getSessionToken() || '';
    async postApiWithJson(url, data) {
        try {
            console.log('Making POST request to:', url, 'with data:', data);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(data)
            });
            const responseData = await response.json();
            if (response.ok) {
                return {
                    success: true,
                    data: responseData,
                    status: response.status
                };
            } else {
                if (response.status === 400) {
                    throw new Error(responseData.message || 'Invalid input');
                } else if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    window.location.href = '/session-expired';
                    return {
                        success: false,
                        error: 'Session expired'
                    };
                } else if (response.status === 404) {
                    throw new Error(responseData.message || 'Resource not found');
                } else {
                    throw new Error(responseData.message || 'Request failed');
                }
            }
        } catch (error) {
            console.error('API Error:', error);
            return {
                success: false,
                error: error.message || 'An error occurred'
            };
        }
    }
    // GET request method
    async getApiResponse(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                return {
                    success: true,
                    data,
                    status: response.status
                };
            } else if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('user'); // Adjust based on your storage key
                localStorage.removeItem('token');
                window.location.href = '/session-expired';
                return {
                    success: false,
                    error: 'Session expired'
                };
            } else {
                throw new Error(data.message || 'Request failed');
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async updateApiWithJson(url, data) {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(data)
            });
            const responseData = await response.json();
            if (response.ok) {
                return {
                    success: true,
                    data: responseData,
                    status: response.status
                };
            } else if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('user'); // Adjust based on your storage key
                localStorage.removeItem('token');
                window.location.href = '/session-expired';
                return {
                    success: false,
                    error: 'Session expired'
                };
            } else {
                throw new Error(responseData.message || 'Update failed');
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    // DELETE request method
    async deleteApiResponse(url) {
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                return {
                    success: true,
                    data,
                    status: response.status
                };
            } else if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('user'); // Adjust based on your storage key
                localStorage.removeItem('token');
                window.location.href = '/session-expired';
                return {
                    success: false,
                    error: 'Session expired'
                };
            } else {
                throw new Error(data.message || 'Delete failed');
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    // post Via Excel Sheet
    async postExcelFile(url, file, fileType, additionalData, options) {
        try {
            console.log('Uploading file to:', url);
            console.log('File name:', file.name, 'Field name:', fileType);
            console.log('File size:', (file.size / (1024 * 1024)).toFixed(2), 'MB');
            console.log('File type:', file.type);
            // Get file extension
            const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
            const mimeType = file.type;
            // Define allowed types based on category
            const allowedTypesMap = {
                video: {
                    extensions: [
                        'mp4',
                        'webm',
                        'ogg',
                        'mov',
                        'avi',
                        'mkv',
                        'flv',
                        'wmv',
                        '3gp',
                        'm4v'
                    ],
                    mimeTypes: [
                        'video/mp4',
                        'video/webm',
                        'video/ogg',
                        'video/quicktime',
                        'video/x-msvideo',
                        'video/x-matroska',
                        'video/x-flv',
                        'video/x-ms-wmv',
                        'video/3gpp',
                        'video/3gpp2',
                        'video/mpeg',
                        'video/mp2t',
                        'video/x-m4v'
                    ],
                    maxSizeMB: 500,
                    errorMessage: 'Please upload a valid video file (MP4, WebM, MOV, AVI, MKV, etc.)'
                },
                image: {
                    extensions: [
                        'jpg',
                        'jpeg',
                        'png',
                        'gif',
                        'webp',
                        'svg',
                        'bmp',
                        'ico',
                        'tiff',
                        'tif'
                    ],
                    mimeTypes: [
                        'image/jpeg',
                        'image/png',
                        'image/gif',
                        'image/webp',
                        'image/svg+xml',
                        'image/bmp',
                        'image/tiff',
                        'image/x-icon'
                    ],
                    maxSizeMB: 20,
                    errorMessage: 'Please upload a valid image file (JPG, PNG, GIF, WebP, SVG, etc.)'
                },
                document: {
                    extensions: [
                        'pdf',
                        'doc',
                        'docx',
                        'txt',
                        'rtf',
                        'odt',
                        'md'
                    ],
                    mimeTypes: [
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'text/plain',
                        'application/rtf',
                        'application/vnd.oasis.opendocument.text',
                        'text/markdown'
                    ],
                    maxSizeMB: 50,
                    errorMessage: 'Please upload a valid document file (PDF, DOC, DOCX, TXT, etc.)'
                },
                excel: {
                    extensions: [
                        'xls',
                        'xlsx',
                        'csv',
                        'xlsm'
                    ],
                    mimeTypes: [
                        'application/vnd.ms-excel',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'text/csv',
                        'application/vnd.ms-excel.sheet.macroEnabled.12'
                    ],
                    maxSizeMB: 50,
                    errorMessage: 'Please upload a valid Excel file (.xls, .xlsx, or .csv)'
                },
                all: {
                    extensions: [
                        'mp4',
                        'webm',
                        'ogg',
                        'mov',
                        'avi',
                        'mkv',
                        'flv',
                        'wmv',
                        '3gp',
                        'm4v',
                        'jpg',
                        'jpeg',
                        'png',
                        'gif',
                        'webp',
                        'svg',
                        'bmp',
                        'ico',
                        'tiff',
                        'tif',
                        'pdf',
                        'doc',
                        'docx',
                        'txt',
                        'rtf',
                        'odt',
                        'md',
                        'xls',
                        'xlsx',
                        'csv',
                        'xlsm',
                        'zip',
                        'rar',
                        '7z',
                        'tar',
                        'gz'
                    ],
                    mimeTypes: [
                        'video/*',
                        'image/*',
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'text/plain',
                        'application/rtf',
                        'application/vnd.oasis.opendocument.text',
                        'text/markdown',
                        'application/vnd.ms-excel',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'text/csv',
                        'application/zip',
                        'application/x-rar-compressed',
                        'application/x-7z-compressed',
                        'application/x-tar',
                        'application/gzip'
                    ],
                    maxSizeMB: 200,
                    errorMessage: 'Please upload a valid file'
                }
            };
            // Determine which rules to use
            const category = options?.fileTypeCategory || 'all';
            const rules = allowedTypesMap[category];
            // Check if custom allowed types are provided
            const customAllowedExtensions = options?.allowedTypes;
            const customMaxSize = options?.maxSizeMB;
            // Validate file extension
            const allowedExtensions = customAllowedExtensions || rules.extensions;
            if (!allowedExtensions.includes(fileExtension)) {
                return {
                    success: false,
                    error: `Invalid file type. ${rules.errorMessage}. Allowed: ${allowedExtensions.join(', ')}`
                };
            }
            // Validate mime type (for video and image, check both extension and mime type)
            const allowedMimeTypes = rules.mimeTypes;
            const isMimeTypeValid = allowedMimeTypes.some((type)=>{
                if (type.endsWith('/*')) {
                    const prefix = type.replace('/*', '');
                    return mimeType.startsWith(prefix);
                }
                return mimeType === type;
            });
            // For strict validation, check mime type as well (skip for 'all' category with wildcards)
            if (category !== 'all' && !isMimeTypeValid) {
                return {
                    success: false,
                    error: `Invalid file format. Expected: ${allowedMimeTypes.join(', ')}`
                };
            }
            // Validate file size
            const maxSizeMB = customMaxSize || rules.maxSizeMB;
            const maxSizeBytes = maxSizeMB * 1024 * 1024;
            if (file.size > maxSizeBytes) {
                return {
                    success: false,
                    error: `File size exceeds ${maxSizeMB}MB limit. Current: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
                };
            }
            // Create form data
            const formData = new FormData();
            formData.append(fileType, file);
            // Append additional data
            if (additionalData) {
                Object.entries(additionalData).forEach(([key, value])=>{
                    formData.append(key, value);
                });
            }
            // Upload file
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            const responseData = await response.json();
            if (response.ok) {
                return {
                    success: true,
                    data: responseData,
                    status: response.status
                };
            } else if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.location.href = '/session-expired';
                return {
                    success: false,
                    error: 'Session expired'
                };
            } else {
                throw new Error(responseData.message || responseData.error || 'File upload failed');
            }
        } catch (error) {
            console.error('File upload error:', error);
            return {
                success: false,
                error: error.message || 'File upload failed'
            };
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/appApis/apiUrl.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>APIs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
class APIs {
    static BASE_URL = ("TURBOPACK compile-time value", "http://192.168.18.4:5000/auth");
    //auth Module
    static SignUpUrl = `${APIs.BASE_URL}/registeruser`;
    static LoginUrl = `${APIs.BASE_URL}/login`;
    static LogOutUrl = `${APIs.BASE_URL}/logout/:id`;
    static ForgetPasswordUrl = `${APIs.BASE_URL}/forgetpassword`;
    //register user
    static addAdvisorUrl = `${APIs.BASE_URL}/addadvisor`;
    static addNewStudentUrl = `${APIs.BASE_URL}/addnewstudent`;
    static updateAdvisorUrl = `${APIs.BASE_URL}/updateadvisor/:id`;
    static updateStudentUrl = `${APIs.BASE_URL}/updatestudent/:id`;
    static updateStudentStatusUrl = `${APIs.BASE_URL}/updatestudentstatus`;
    static bulkStudentUploadUrl = `${APIs.BASE_URL}/addviaexcelsheet`;
    //manage users APIS
    static getAllCoordinatorsUrl = `${APIs.BASE_URL}/coordinators`;
    static getUserByIdUrl = `${APIs.BASE_URL}/getUserById/:id`;
    static getAllUsersUrl = `${APIs.BASE_URL}/users`;
    static getAdvisorsUrl = `${APIs.BASE_URL}/advisors`;
    static getStudentsUrl = `${APIs.BASE_URL}/students`;
    static updateUserStatusUrl = `${APIs.BASE_URL}/updateuserstatus`;
    static updateUserRoleUrl = `${APIs.BASE_URL}/updateuserrole`;
    // program Urls 
    static getProgramsUrl = `${APIs.BASE_URL}/getPrograms`;
    static addProgram = `${APIs.BASE_URL}/addProgram`;
    // process roadmap
    static uploadRoadmapUrl = `${APIs.BASE_URL}/upload`;
    static getProgramRoadmapsUrl = `${APIs.BASE_URL}/roadmap-details/:programName`;
    static getSepecifBatchProgramRoadmapsUrl = `${APIs.BASE_URL}/batch-roadmap/:batchName/:batchYear/:programName`;
    static assignRoadmapToBatchUrl = `${APIs.BASE_URL}/assign-to-batch`;
    //process courseDetails
    static uploadCourseDetailUrl = `${APIs.BASE_URL}/uploadCourseDetail`;
    static getCourseDetailUrl = `${APIs.BASE_URL}/getCoursesDetails`;
    static updateCourseDetailUrl = `${APIs.BASE_URL}/updateCourse/:courseId`;
    //procecourseOffering
    static uploadCourseOfferingUrl = `${APIs.BASE_URL}/uploadCourseOffering`;
    static getCourseOfferingUrl = `${APIs.BASE_URL}/getCoursesOfferings`;
    //process timetable
    static uploadTimeTableUrl = `${APIs.BASE_URL}/uploadTimetable`;
    static getTimetableUrl = `${APIs.BASE_URL}/getTimetables`;
    // Chat APIs
    static chatUploadUrl = `${APIs.BASE_URL}/chat/upload`;
    static chatDeleteUrl = `${APIs.BASE_URL}/chat/delete/:filename`;
    //process results
    static uploadSessionalResultUrl = `${APIs.BASE_URL}/uploadSessionalResult`;
    // transcript
    static getStudentTranscriptSummaryUrl = `${APIs.BASE_URL}/getStudentTranscriptSummary/:id`;
    // recommendCourses
    static recommendSessionalCoursesUrl = `${APIs.BASE_URL}/suggestCourses/:id`;
    static finalizeSessionalCourseRecommendationUrl = `${APIs.BASE_URL}/finalize`;
    static getAdvisoryLogsUrl = `${APIs.BASE_URL}/advisor/:advisorId/:role`;
    static getRecommendationByIdUrl = `${APIs.BASE_URL}/getRecommendation/:id`;
    static getStudentRecommendationsUrl = `${APIs.BASE_URL}/student/:studentId`;
    //advisor Notes Module
    static createNotes = `${APIs.BASE_URL}/createNotes`;
    static updateNotes = `${APIs.BASE_URL}/updateNotes/:id`;
    static deleteNotes = `${APIs.BASE_URL}/deleteNotes/:id`;
    static getNotes = `${APIs.BASE_URL}/getNotes/:userId`;
    //supporting videos Module
    static createVideo = `${APIs.BASE_URL}/createVideo`;
    static getAllVideos = `${APIs.BASE_URL}/getAllVideos`;
    static updateVideo = `${APIs.BASE_URL}/updateVideo/:id`;
    static deleteVideo = `${APIs.BASE_URL}/deleteVideo/:id`;
    //advisor timetable apis
    static addBatchTimetable = `${APIs.BASE_URL}/addBatchTimetable`;
    static updateBatchTimetable = `${APIs.BASE_URL}/updateBatchTimetable`;
    static deleteBatchTimetable = `${APIs.BASE_URL}/deleteBatchTimetable/:id/:userId`;
    static getBatchTimetable = `${APIs.BASE_URL}/getBatchTimetable/:userId`;
    //batch timetable apis
    static addAdvisorTimetable = `${APIs.BASE_URL}/addAdvisorTimetable`;
    static updateAdvisorTimetable = `${APIs.BASE_URL}/updateAdvisorTimetable`;
    static deleteAdvisorTimetable = `${APIs.BASE_URL}/deleteAdvisorTimetable/:id/:userId`;
    static getAdvisorTimetable = `${APIs.BASE_URL}/getAdvisorTimetable/:userId`;
    // services/appApis/apiUrl.ts (add these)
    static createMeeting = `${APIs.BASE_URL}/createMeeting`;
    static getMeetingSuggestions = `${APIs.BASE_URL}/getMeetingSuggestions/:userId`;
    static getMeetingsForAdvisor = `${APIs.BASE_URL}/getMeetingsForAdvisor/:userId`;
    static updateMeeting = `${APIs.BASE_URL}/updateMeeting/:id`;
    //degreeguidlines Module
    static createGuideline = `${APIs.BASE_URL}/createGuideline`;
    static getAllGuidelines = `${APIs.BASE_URL}/getAllGuidelines`;
    static updateGuideline = `${APIs.BASE_URL}/updateGuideline/:id`;
    static deleteGuideline = `${APIs.BASE_URL}/deleteGuideline/:id`;
    // faculty recommendation
    static createRecommendationRequest = `${APIs.BASE_URL}/createRecommendationRequest/:userId`;
    static addCommentToRecommendation = `${APIs.BASE_URL}/addCommentToRecommendation/:userId`;
    static getAllRecommendations = `${APIs.BASE_URL}/getAllRecommendations`;
    static updateRecommendationStatus = `${APIs.BASE_URL}/updateRecommendationStatus/:userId`;
    static voteComment = `${APIs.BASE_URL}/voteComment/:commentId`;
    static acceptCommentAsSolution = `${APIs.BASE_URL}/acceptCommentAsSolution/:userId`;
    static deleteRecommendation = `${APIs.BASE_URL}/deleteRecommendation/:id`;
    static deleteRecommendationComment = `${APIs.BASE_URL}/deleteRecommendationComment/:id`;
    static updateCommentToRecommendation = `${APIs.BASE_URL}/updateCommentToRecommendation`;
    static updateRecommendationRequest = `${APIs.BASE_URL}/updateRecommendationRequest/:id`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/repositories/authRepository/loginRepository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoginRepository",
    ()=>LoginRepository,
    "loginRepository",
    ()=>loginRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$baseApiServices$2f$baseNetworkService$2f$baseNetwork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/baseApiServices/baseNetworkService/baseNetwork.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$appApis$2f$apiUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/appApis/apiUrl.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$sessionManagement$2f$sessionManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/sessionManagement/sessionManager.ts [app-client] (ecmascript)");
;
;
;
class LoginRepository extends __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$baseApiServices$2f$baseNetworkService$2f$baseNetwork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BaseApiService"] {
    static instance;
    constructor(){
        super();
    }
    apiUrl = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$appApis$2f$apiUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].LoginUrl;
    static MAX_LOGIN_ATTEMPTS = 5;
    static LOCKOUT_DURATION = 10 * 1000;
    static failedLoginAttempts = 0;
    static lockedUntil = null;
    static getInstance() {
        if (!LoginRepository.instance) {
            LoginRepository.instance = new LoginRepository();
        }
        return LoginRepository.instance;
    }
    async login(credentials) {
        try {
            //Check whether login is currently locked
            if (LoginRepository.lockedUntil !== null) {
                const remainingTime = LoginRepository.lockedUntil - Date.now();
                if (remainingTime > 0) {
                    const remainingSeconds = Math.ceil(remainingTime / 1000);
                    throw new Error(`Too many unsuccessful login attempts. ` + `Please wait ${remainingSeconds} seconds before trying again.`);
                }
                LoginRepository.lockedUntil = null;
                LoginRepository.failedLoginAttempts = 0;
            }
            const response = await this.postApiWithJson(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$appApis$2f$apiUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].LoginUrl, credentials);
            if (response.success && response.data) {
                LoginRepository.failedLoginAttempts = 0;
                LoginRepository.lockedUntil = null;
                if (response.data.data?.sessionToken && response.data.data?.id) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$sessionManagement$2f$sessionManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sessionManager"].createSession(response.data, response.data.data.sessionToken);
                }
                return response.data;
            }
            LoginRepository.failedLoginAttempts++;
            if (LoginRepository.failedLoginAttempts >= LoginRepository.MAX_LOGIN_ATTEMPTS) {
                LoginRepository.lockedUntil = Date.now() + LoginRepository.LOCKOUT_DURATION;
                throw new Error('Too many unsuccessful login attempts. ' + 'Please wait 10 seconds before trying again.');
            }
            const remainingAttempts = LoginRepository.MAX_LOGIN_ATTEMPTS - LoginRepository.failedLoginAttempts;
            throw new Error(`${response.error || 'Invalid login credentials.'} ` + `${remainingAttempts} attempt(s) remaining.`);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
}
const loginRepository = LoginRepository.getInstance();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/repositories/authRepository/signUpRepository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SignUpRepository",
    ()=>SignUpRepository,
    "signUpRepository",
    ()=>signUpRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$baseApiServices$2f$baseNetworkService$2f$baseNetwork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/baseApiServices/baseNetworkService/baseNetwork.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$appApis$2f$apiUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/appApis/apiUrl.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$sessionManagement$2f$sessionManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/sessionManagement/sessionManager.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$localStorage$2f$authLocalStorageService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/localStorage/authLocalStorageService.ts [app-client] (ecmascript)");
;
;
;
;
class SignUpRepository extends __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$baseApiServices$2f$baseNetworkService$2f$baseNetwork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BaseApiService"] {
    static instance;
    constructor(){
        super();
    }
    static getInstance() {
        if (!SignUpRepository.instance) {
            SignUpRepository.instance = new SignUpRepository();
        }
        return SignUpRepository.instance;
    }
    async signUp(credentials) {
        try {
            const response = await this.postApiWithJson(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$appApis$2f$apiUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].SignUpUrl, credentials);
            console.log('Sign up response:', response);
            if (response.success && response.data) {
                // Save the user data as well, not just token
                if (response.data.data?.sessionToken && response.data.data?.id) {
                    // Save both user data and token
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$sessionManagement$2f$sessionManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sessionManager"].createSession(response.data.data, response.data.data.sessionToken);
                    // Also save the user data separately if needed
                    if (response.data.data) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$localStorage$2f$authLocalStorageService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localStorageService"].saveUser(response.data.data);
                    }
                }
                return response.data;
            }
            throw new Error(response.error || 'Signup failed');
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    }
}
const signUpRepository = SignUpRepository.getInstance();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utilits/constructUrl/constructParamsUrl.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>paramsUrl
]);
function paramsUrl(url, params) {
    let constructedUrl = url;
    Object.entries(params).forEach(([key, value])=>{
        constructedUrl = constructedUrl.replace(`:${key}`, String(value));
    });
    return constructedUrl;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/repositories/authRepository/logoutRepository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LogoutRepository",
    ()=>LogoutRepository,
    "logoutRepository",
    ()=>logoutRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$baseApiServices$2f$baseNetworkService$2f$baseNetwork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/baseApiServices/baseNetworkService/baseNetwork.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$appApis$2f$apiUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/appApis/apiUrl.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$sessionManagement$2f$sessionManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/sessionManagement/sessionManager.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilits$2f$constructUrl$2f$constructParamsUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utilits/constructUrl/constructParamsUrl.ts [app-client] (ecmascript)");
;
;
;
;
class LogoutRepository extends __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$baseApiServices$2f$baseNetworkService$2f$baseNetwork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BaseApiService"] {
    static instance;
    constructor(){
        super();
    }
    static getInstance() {
        if (!LogoutRepository.instance) {
            LogoutRepository.instance = new LogoutRepository();
        }
        return LogoutRepository.instance;
    }
    async logout(userId) {
        try {
            const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilits$2f$constructUrl$2f$constructParamsUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$appApis$2f$apiUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].LogOutUrl, {
                id: userId.toString()
            });
            const response = await this.postApiWithJson(url, {});
            // Clear session on success
            if (response.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$sessionManagement$2f$sessionManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sessionManager"].destroySession();
            } else {
                throw new Error(response.error || 'Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }
    // Force logout without API call (for token expiration)
    forceLogout() {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$sessionManagement$2f$sessionManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sessionManager"].destroySession();
    }
}
const logoutRepository = LogoutRepository.getInstance();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/repositories/authRepository/forgetPasswordRepository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PasswordRepository",
    ()=>PasswordRepository,
    "passwordRepository",
    ()=>passwordRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$baseApiServices$2f$baseNetworkService$2f$baseNetwork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/baseApiServices/baseNetworkService/baseNetwork.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$appApis$2f$apiUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/appApis/apiUrl.ts [app-client] (ecmascript)");
;
;
class PasswordRepository extends __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$baseApiServices$2f$baseNetworkService$2f$baseNetwork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BaseApiService"] {
    static instance;
    constructor(){
        super();
    }
    static getInstance() {
        if (!PasswordRepository.instance) {
            PasswordRepository.instance = new PasswordRepository();
        }
        return PasswordRepository.instance;
    }
    async forgotPassword(sapid, newPassword) {
        try {
            const body = {
                "sapid": sapid,
                "password": newPassword
            };
            console.log('Forgot password request body:', body);
            const response = await this.postApiWithJson(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$appApis$2f$apiUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].ForgetPasswordUrl, body);
            console.log('Forgot password response:', response);
            if (!response.success) {
                throw new Error(response.error || 'Password reset failed');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            throw error;
        }
    }
}
const passwordRepository = PasswordRepository.getInstance();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/repositories/authRepository/authRepository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthRepository",
    ()=>AuthRepository,
    "authRepository",
    ()=>authRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$sessionManagement$2f$sessionManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/sessionManagement/sessionManager.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$repositories$2f$authRepository$2f$loginRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/repositories/authRepository/loginRepository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$repositories$2f$authRepository$2f$signUpRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/repositories/authRepository/signUpRepository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$repositories$2f$authRepository$2f$logoutRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/repositories/authRepository/logoutRepository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$repositories$2f$authRepository$2f$forgetPasswordRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/repositories/authRepository/forgetPasswordRepository.ts [app-client] (ecmascript)");
;
;
;
;
;
class AuthRepository {
    static instance;
    constructor(){}
    static getInstance() {
        if (!AuthRepository.instance) {
            AuthRepository.instance = new AuthRepository();
        }
        return AuthRepository.instance;
    }
    // Login operations
    async login(credentials) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$repositories$2f$authRepository$2f$loginRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loginRepository"].login(credentials);
    }
    // Signup operations
    async signup(credentials) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$repositories$2f$authRepository$2f$signUpRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signUpRepository"].signUp(credentials);
    }
    // Logout operations
    async logout(userId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$repositories$2f$authRepository$2f$logoutRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logoutRepository"].logout(userId);
    }
    // Password operations
    async forgotPassword(sapid, newPassword) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$repositories$2f$authRepository$2f$forgetPasswordRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["passwordRepository"].forgotPassword(sapid, newPassword);
    }
    getCurrentUser() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$sessionManagement$2f$sessionManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sessionManager"].getCurrentUser();
    }
    isAuthenticated() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$sessionManagement$2f$sessionManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sessionManager"].hasActiveSession();
    }
    getAuthHeaders() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$sessionManagement$2f$sessionManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sessionManager"].getAuthHeaders();
    }
    forceLogout() {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$repositories$2f$authRepository$2f$logoutRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logoutRepository"].forceLogout();
    }
}
const authRepository = AuthRepository.getInstance();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/repositories/userManagementRepository/userManagementRepo.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "userManagementRepository",
    ()=>userManagementRepository
]);
/* eslint-disable @typescript-eslint/no-explicit-any */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$baseApiServices$2f$baseNetworkService$2f$baseNetwork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/baseApiServices/baseNetworkService/baseNetwork.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$appApis$2f$apiUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/appApis/apiUrl.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilits$2f$constructUrl$2f$constructParamsUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utilits/constructUrl/constructParamsUrl.ts [app-client] (ecmascript)");
;
;
;
class UserManagementRepository extends __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$baseApiServices$2f$baseNetworkService$2f$baseNetwork$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BaseApiService"] {
    static instance;
    constructor(){
        super();
    }
    static getInstance() {
        if (!UserManagementRepository.instance) {
            UserManagementRepository.instance = new UserManagementRepository();
        }
        return UserManagementRepository.instance;
    }
    // Add Advisor
    async addAdvisor(data) {
        try {
            console.log("add advisor data ", data);
            const response = await this.postApiWithJson(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$appApis$2f$apiUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].addAdvisorUrl, data);
            console.log("Add advisor res ", response);
            if (response.success && response.data) {
                return response;
            }
            throw new Error(response.error || 'Failed to add new batch advisor');
        } catch (error) {
            console.error('Add advisor error:', error);
            throw error;
        }
    }
    // Update Advisor
    async updateAdvisor(id, data) {
        try {
            console.log("update advisor id ", id, " data ", data);
            const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilits$2f$constructUrl$2f$constructParamsUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$appApis$2f$apiUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].updateAdvisorUrl, {
                id: id.toString()
            });
            console.log("url ", url);
            const response = await this.updateApiWithJson(url, data);
            console.log("Update advisor res ", response);
            return response;
        } catch (error) {
            console.error('Update advisor error:', error);
            throw error;
        }
    }
    // Add Student
    async addStudent(data) {
        try {
            const response = await this.postApiWithJson(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$appApis$2f$apiUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].addNewStudentUrl, data);
            console.log("Add student response ", response);
            return response;
        } catch (error) {
            console.error('Add student error:', error);
            throw error;
        }
    }
    // Update Student
    async updateStudent(id, data) {
        try {
            const url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utilits$2f$constructUrl$2f$constructParamsUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$appApis$2f$apiUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].updateStudentUrl, {
                id: id.toString()
            });
            console.log("update student id ", id, " data ", data, " url ", url);
            const response = await this.updateApiWithJson(url, data);
            console.log("update student res ", response);
            return response;
        } catch (error) {
            console.error('Update student error:', error);
            throw error;
        }
    }
    // Update Student Status
    async updateUserStatus(data) {
        try {
            console.log("Update user status data:", data);
            const response = await this.updateApiWithJson(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$appApis$2f$apiUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].updateUserStatusUrl, data);
            console.log("Update user status response:", response);
            return response;
        } catch (error) {
            console.error('Update user status error:', error);
            throw error;
        }
    }
    async bulkUploadStudents(data) {
        try {
            const response = await this.postExcelFile(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$appApis$2f$apiUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bulkStudentUploadUrl, data.file, "studentFile", {
                programName: data.programName,
                batchName: data.batchName,
                batchYear: data.batchYear
            });
            return response;
        } catch (error) {
            console.error('Bulk upload error:', error);
            throw error;
        }
    }
}
const userManagementRepository = UserManagementRepository.getInstance();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/authHook/useAuth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuth",
    ()=>useAuth
]);
/* eslint-disable @typescript-eslint/no-explicit-any */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$repositories$2f$authRepository$2f$authRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/repositories/authRepository/authRepository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$repositories$2f$userManagementRepository$2f$userManagementRepo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/repositories/userManagementRepository/userManagementRepo.ts [app-client] (ecmascript)");
;
;
const useAuth = ()=>{
    const login = async (credentials)=>{
        try {
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$repositories$2f$authRepository$2f$authRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authRepository"].login(credentials);
            return {
                success: true,
                user
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    };
    const signup = async (credentials)=>{
        try {
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$repositories$2f$authRepository$2f$authRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authRepository"].signup(credentials);
            return {
                success: true,
                user
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    };
    const logout = async (userId)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$repositories$2f$authRepository$2f$authRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authRepository"].logout(userId);
            return {
                success: true
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    };
    const checkAuth = ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$repositories$2f$authRepository$2f$authRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authRepository"].isAuthenticated();
    };
    const getCurrentUser = ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$repositories$2f$authRepository$2f$authRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authRepository"].getCurrentUser();
    };
    const forgotPassword = async (sapid, newPassword)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$repositories$2f$authRepository$2f$authRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authRepository"].forgotPassword(sapid, newPassword);
            return {
                success: true,
                message: "Password updated successfully"
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || "Password reset failed"
            };
        }
    };
    const updateUserStatus = async (sapid, currentStatus)=>{
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$repositories$2f$userManagementRepository$2f$userManagementRepo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userManagementRepository"].updateUserStatus({
                sapid,
                currentStatus
            });
            if (result.success) {
                return {
                    success: true,
                    message: result.message || "Status updated successfully",
                    data: result.data
                };
            } else {
                throw new Error(result.error || "Failed to update status");
            }
        } catch (error) {
            return {
                success: false,
                error: error.message || "An error occurred while updating status"
            };
        }
    };
    return {
        login,
        signup,
        logout,
        forgotPassword,
        getCurrentUser,
        checkAuth,
        updateUserStatus
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/sessionalTimeoutHook/useSessionalTimeout.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSessionTimeout",
    ()=>useSessionTimeout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$sessionManagement$2f$sessionManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/sessionManagement/sessionManager.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$authHook$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/authHook/useAuth.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
/* eslint-disable @typescript-eslint/no-explicit-any */ 'use client';
;
;
;
;
const useSessionTimeout = (timeoutMinutes = 30)=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Get the current URL path to check if the user is on a public page
    const { logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$authHook$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const handleLogout = async ()=>{
        try {
            const currentUser = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$sessionManagement$2f$sessionManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sessionManager"].getCurrentUser();
            if (currentUser?.id) {
                await logout(currentUser.id);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$sessionManagement$2f$sessionManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sessionManager"].destroySession();
            }
            router.push("/views/auth/login");
        } catch (error) {
            console.error("Logout error:", error);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$sessionManagement$2f$sessionManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sessionManager"].destroySession();
            router.push("/views/auth/login");
        }
    };
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const timerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSessionTimeout.useEffect": ()=>{
            // 1. Do not start the timer if the user is on a public page (Login, Signup, Expired, Landing)
            if (pathname === '/views/auth/login' || pathname === '/views/auth/registeration/signup' || pathname === '/session-expired' || pathname === '/') {
                return;
            }
            // Ensure the code runs only on the client side
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            // Function to clear local storage and redirect when the session expires
            const logoutUser = {
                "useSessionTimeout.useEffect.logoutUser": async ()=>{
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    await handleLogout();
                    router.push('/session-expired');
                }
            }["useSessionTimeout.useEffect.logoutUser"];
            // Function to reset the timer on activity (if extended later)
            const resetTimer = {
                "useSessionTimeout.useEffect.resetTimer": ()=>{
                    if (timerRef.current) clearTimeout(timerRef.current);
                    // Set timer to logout after the specified minutes
                    timerRef.current = setTimeout(logoutUser, timeoutMinutes * 60 * 1000);
                }
            }["useSessionTimeout.useEffect.resetTimer"];
            // Initialize the timer
            resetTimer();
            // Cleanup function to clear the timer when the component unmounts
            return ({
                "useSessionTimeout.useEffect": ()=>{
                    if (timerRef.current) clearTimeout(timerRef.current);
                }
            })["useSessionTimeout.useEffect"];
        }
    }["useSessionTimeout.useEffect"], [
        router,
        timeoutMinutes,
        pathname
    ]);
};
_s(useSessionTimeout, "gYIgtPsIqlT8h/Aggvr3NQRH2cI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$authHook$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/views/auth/sessionWrapper/sessionWrapper.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SessionWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$sessionalTimeoutHook$2f$useSessionalTimeout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/sessionalTimeoutHook/useSessionalTimeout.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function SessionWrapper({ children }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$sessionalTimeoutHook$2f$useSessionalTimeout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionTimeout"])(45);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(SessionWrapper, "fIG7ISQH4J2A7jNr2IX5YhfmmZQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$sessionalTimeoutHook$2f$useSessionalTimeout$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSessionTimeout"]
    ];
});
_c = SessionWrapper;
var _c;
__turbopack_context__.k.register(_c, "SessionWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_db81bfd8._.js.map