import axios from 'axios'


const API_BASE_URL = process.env.REACT_APP_API
const FRESHERMATE_BASE_URL = process.env.REACT_APP_FRESHERMATE_APP_API


const getAuthHeaders = () => {
    try {
        const authState = localStorage.getItem('authState');
        if (!authState) {
            console.warn('Auth not found.');
            return {};
        }
        const headers = JSON.parse(authState);
        if (!headers.token || !headers.role) {
            console.warn('Missing token or role in authState.');
            return {};
        }
        return {
            'Authorization': `Bearer ${headers.token}`,
            'x-role': `${headers.role}`
        };
    } catch (error) {
        console.error('Error parsing authState from localStorage:', error);
        return {};
    }
};

function getImage(imgPath) {
    return `${API_BASE_URL}${imgPath}`
}

async function userSignUp(data) {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/register`, data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

async function userLogin(data) {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/login`, data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

async function checkEmail(email) {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/checkEmail`, { email });
        return response.data
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}
async function checkMobile(mobile) {
    try {

        const response = await axios.post(`${API_BASE_URL}/users/checkMobile`, { mobile });
        return response.data
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

/////////////////////// Course ///////////////////////////

async function addCourse(data) {
    try {
        const response = await axios.post(`${API_BASE_URL}/courses`, data, { headers: getAuthHeaders() })
        return response.data;
    } catch (error) {
        console.log(error.message);
    }
}

async function getAllCourses(filters = {}) {
    try {
        const response = await axios.post(`${API_BASE_URL}/courses/all`, {
            search: filters.search || '',
            sortBy: filters.sortBy || { createdAt: -1 },
            page: filters.page || 1,
            limit: filters.limit || 10,
            filter: filters.filter || ''
        }, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function getCourseById(id) {
    try {
        const response = await axios.get(`${API_BASE_URL}/courses/${id}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        console.log(error.message);
        throw error;
    }
}

async function updateCourse(id, courseData) {
    try {
        const response = await axios.put(`${API_BASE_URL}/courses/${id}`, courseData, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        console.log(error.message);
        throw error;
    }
}

async function deleteCourse(id) {
    try {
        const response = await axios.delete(`${API_BASE_URL}/courses/${id}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        console.log(error.message);
        throw error;
    }
}

/////////////////////// Course ///////////////////////////

async function enrollInCourse(data) {
    try {
        const response = await axios.post(`${API_BASE_URL}/enrollments`, data, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

async function getUserEnrolledCourses(userId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/enrollments/user/${userId}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

async function unenrollFromCourse(enrollmentId) {
    try {
        const response = await axios.delete(`${API_BASE_URL}/enrollments/${enrollmentId}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

async function getCourseEnrollments(courseId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/enrollments/course/${courseId}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

async function getAllEnrollments() {
    try {
        const response = await axios.get(`${API_BASE_URL}/enrollments`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

async function updateEnrollmentStatus(enrollmentId, data) {
    try {
        const response = await axios.put(`${API_BASE_URL}/enrollments/${enrollmentId}`, data, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

async function getEnrollmentById(enrollmentId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/enrollments/${enrollmentId}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

async function addMaterial(data) {
    try {
        if (data.coverImage) {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('url', data.url);
            formData.append('contentType', data.contentType);
            formData.append('courseId', data.courseId);
            formData.append('coverImage', data.coverImage);

            const response = await axios.post(
                `${API_BASE_URL}/materials/add-material`,
                formData,
                {
                    headers: getAuthHeaders()
                }
            );
            return response.data.data || response.data;
        } else {
            const response = await axios.post(
                `${API_BASE_URL}/materials/add-material`,
                {
                    title: data.title,
                    description: data.description,
                    url: data.url,
                    contentType: data.contentType,
                    courseId: data.courseId
                },
                {
                    headers: getAuthHeaders()
                }
            );
            return response.data.data || response.data;
        }
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

async function updateMaterial(data) {
    try {
        if (data.coverImage) {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('url', data.url);
            formData.append('contentType', data.contentType);
            formData.append('courseId', data.courseId);
            formData.append('coverImage', data.coverImage);

            const response = await axios.put(
                `${API_BASE_URL}/materials/${data.materialId}`,
                formData,
                {
                    headers: getAuthHeaders()
                }
            );
            return response.data.data || response.data;
        } else {
            const response = await axios.put(
                `${API_BASE_URL}/materials/${data.materialId}`,
                {
                    title: data.title,
                    description: data.description,
                    url: data.url,
                    contentType: data.contentType,
                    courseId: data.courseId
                },
                {
                    headers: getAuthHeaders()
                }
            );
            return response.data.data || response.data;
        }
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

async function getMaterialByCourseId(id) {
    try {
        const resposne = await axios.get(`${API_BASE_URL}/materials/course/${id}`, {
            headers: getAuthHeaders()
        })
        return resposne.data
    } catch (error) {
        throw error.response ? error.response.data : error.message;

    }
}

async function deleteMaterial(id) {
    try {
        const resposne = await axios.delete(`${API_BASE_URL}/materials/${id}`, {
            headers: getAuthHeaders()
        })
        return resposne.data
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

async function getMaterialById(materialId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/materials/${materialId}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

// async function updateMaterial(data) {
//     console.log('materials data', data)
//     try {
//         const formData = new FormData();
//         for (const key in data) {
//             if (data[key] !== undefined) {
//                 formData.append(key, data[key]);
//             }
//         }

//         console.log('Updating material with ID:', formData);

//         const response = await axios.put(`${API_BASE_URL}/materials/${data._id}`, formData, {
//             headers: getAuthHeaders()
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Update error:', error);
//         throw error.response ? error.response.data : error.message;
//     }
// }

async function rejectEnrollmentMsg(id, body) {
    try {
        console.log(body)
        const resposne = await axios.post(`${API_BASE_URL}/enrollments/${id}`, body)
        return resposne.data
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

const ChatApi = {
    createChatSession: async (body) => {
        try {
            const url = `${FRESHERMATE_BASE_URL}/chat`;
            const { data } = await axios.post(url, body);
            return data
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    handleUserPrompt: async (sessionId, courseId, promptData) => {
        try {
            const url = `${API_BASE_URL}/courses/chat/${sessionId}/${courseId}`;
            const { data } = await axios.post(url, promptData);
            return data
        } catch (error) {
            throw error
        }

    },

    getChatSession: async (sessionId) => {
        try {
            const url = `${FRESHERMATE_BASE_URL}/chat/${sessionId}`;
            const { data } = await axios.get(url);
            return data
        } catch (error) {
            throw error
        }
    },

    getUserChatSessions: async (userId) => {
        try {
            const url = `${FRESHERMATE_BASE_URL}/chat/user/${userId}`;
            const { data } = await axios.get(url);
            return data
        } catch (error) {
            throw error
        }
    }
};

export {
    userLogin,
    userSignUp,
    addCourse,
    addMaterial,
    updateMaterial,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getUserEnrolledCourses,
    unenrollFromCourse,
    getCourseEnrollments,
    enrollInCourse,
    getAllEnrollments,
    updateEnrollmentStatus,
    getEnrollmentById,
    getMaterialByCourseId,
    getImage,
    deleteMaterial,
    rejectEnrollmentMsg,
    checkMobile,
    checkEmail,
    ChatApi
}