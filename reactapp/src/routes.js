// router.jsx - FIXED
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./Components/PrivateRoute";
import EducatorCourseManager from "./EducatorComponents/EducatorCourseManager";
import CourseForm from "./EducatorComponents/CourseForm";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import EducatorNavbar from "./EducatorComponents/EducatorNavbar";
import HomePage from "./Components/HomePage";
import ViewCourse from "./EducatorComponents/ViewCourse";
import EducatorMaterialsManager from "./EducatorComponents/EducatorMaterialsManager";
import ViewMaterial from "./EducatorComponents/ViewMaterial";
import MaterialForm from "./EducatorComponents/MaterialForm";
import StudentNavbar from "./StudentComponents/StudentNavbar";
import EnrollRequests from "./EducatorComponents/EnrollRequests";
import StudentViewCourse from "./StudentComponents/StudentViewCourse";
import ErrorPage from "./Components/ErrorPage";
import EnrolledCourses from "./StudentComponents/EnrolledCourse";
import Chat from "./FreshersMateComponents/Chat";

const router = createBrowserRouter([
    {
        path: '/login',
        Component: Login
    },
    {
        path: '/signup',
        Component: Signup
    },
    {
        path: '/',
        element: <PrivateRoute />
    },
    {
        path: '/educator',
        element: <PrivateRoute allowedRole={'educator'} />,
        children: [
            {
                element: <EducatorNavbar />,
                children: [
                    {
                        index: true,
                        Component: HomePage
                    },
                    {
                        path: 'courses',
                        element: <EducatorCourseManager />,
                        children: [
                            {
                                index: true,
                                Component: ViewCourse
                            },
                            {
                                path: 'add',
                                Component: CourseForm
                            },
                            {
                                path: 'edit/:id',
                                Component: CourseForm
                            }
                        ]
                    },
                    {
                        path: 'materials',
                        element: <EducatorMaterialsManager />,
                        children: [
                            // More specific routes MUST come before generic ones
                            {
                                path: 'edit/:id',
                                Component: MaterialForm
                            },
                            {
                                path: 'add/:id',
                                Component: MaterialForm
                            },
                            {
                                path: ':id',
                                Component: ViewMaterial
                            },
                            {
                                path: 'edit/:id/:materialId',
                                Component: MaterialForm
                            }
                        ]
                    },
                    {
                        path: 'enrollments',
                        Component: EnrollRequests
                    }
                ]
            }
        ]
    },
    {
        path: '/student',
        element: <PrivateRoute allowedRole={'student'} />,
        children: [
            {
                element: <StudentNavbar />,
                children: [
                    {
                        index: true,
                        Component: HomePage
                    },
                    {
                        path: 'courses',
                        Component: StudentViewCourse
                    },
                    {
                        path: 'enrolled-courses',
                        Component: EnrolledCourses
                    },
                    {
                        path: 'materials/:id',
                        Component: ViewMaterial
                    },
                    {
                        path: 'chat',
                        Component: Chat
                    },
                    {
                        path: 'chat/:sessionId',
                        Component: Chat
                    },
                    {
                        path: 'chat/:sessionId/:courseId',
                        Component: Chat
                    }
                ]
            }
        ]
    },
    {
        path: '*',
        Component: ErrorPage
    }
]);

export default router;