//for fetching data by using API we use RTK query and also create this folder and file
import { userLoggedIn, userLoggedOut } from "@/features/authSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const USER_API = "https://lms-xrs4.onrender.com/api/v1/user";
const USER_API = "https://lms-1-server.onrender.com/api/v1/user";

export const authApi = createApi({
  //reducerPath: ANY_NAME
  reducerPath: "authApi",
  tagTypes: ["LoadUser"],
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    //in time of "register" we send data so we use "mutation"
    registerUser: builder.mutation({ //"registerUser" is a function
      query: (formData) => ({ //here recive data EX: (formData)
        url: "/register", //url creation: https://lms-xrs4.onrender.com/api/v1/user/register
        method: "POST",
        body: formData,
      }),
    }),
    //in time of "login" we send data so we use "mutation"
    loginUser: builder.mutation({
      query: (formData) => ({
        url: "/login",
        method: "POST",
        body: formData,
      }),
      providesTags: ["LoadUser"],
      //"onQueryStarted" function execute when "loginUser" endpoint hit.
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
          // Dispatch the loadUser query immediately after login
          dispatch(authApi.endpoints.loadUser.initiate());
        } catch (error) {
          console.log(error);
        }
      },
    }),
    loadUser: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["LoadUser"],
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch }) {
        try {
          dispatch(userLoggedOut());
        } catch (error) {
          console.log(error);
        }
      },
    }),
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/profile/update",
        method: "PUT",
        body: formData,
        credentials: "include",
      }),
    }),
    checkAuth: builder.query({
      query: () => ({
        url: "/check-auth",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});
export const {
  //these all hooks and also generate RTK query
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useUpdateProfileMutation,
  useCheckAuthQuery,
  useLoadUserQuery,
} = authApi;
