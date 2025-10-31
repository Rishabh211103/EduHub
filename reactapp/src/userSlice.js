import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userLogin, userSignUp } from "./apiConfig";

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('authState');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (e) {
        console.warn("Could not load state from localStorage", e);
        return undefined;
    }
};

const signUpUser = createAsyncThunk(
    'user/signup',
    async (data) => {
        const response = await userSignUp(data);
        return response;
    }
);

const loginUser = createAsyncThunk(
    'user/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await userLogin({ email, password });
            return response;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

const preloadedState = loadState();

const userSlice = createSlice({
    name: "users",
    initialState: {
        user: preloadedState?.user || { id: '', userName: '' },
        token: preloadedState?.token || {},
        role: preloadedState?.role || {},
        isAuthenticated: preloadedState?.isAuthenticated || false,
        loading: false,
        error: null,
        isStudent: preloadedState?.isStudent || false
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.role = null;
            state.isAuthenticated = false;
            state.isStudent = false;
            localStorage.removeItem('authState');
        },
    },
    extraReducers: (builder) => {
        builder
            // signUpUser
            .addCase(signUpUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUpUser.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // loginUser
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.role = action.payload.role;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
                state.user = {
                    id: action.payload.id,
                    userName: action.payload.userName
                }
                state.isStudent = action.payload.role === 'student';

                localStorage.setItem('authState', JSON.stringify({
                    isStudent: action.payload.role === 'student',
                    token: action.payload.token,
                    role: action.payload.role,
                    isAuthenticated: true,
                    user: {
                        id: action.payload.id,
                        userName: action.payload.userName
                    }
                }));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message || 'Login failed';
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
                state.role = null;
                state.isStudent = false;
                localStorage.removeItem('authState');
            });
    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;

export {
    signUpUser,
    loginUser
};