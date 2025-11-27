// ProtectedRoute.js
import { useGetCourseDetailsWithStatusQuery } from "@/api/purchaseApi";
// import React from "react";
import { Navigate, useParams } from "react-router-dom";


// eslint-disable-next-line react/prop-types
const PurchaseCourseProtectedRoute = ({children}) => {
  const { courseId } = useParams();
  const { data, isLoading } = useGetCourseDetailsWithStatusQuery(courseId);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return data?.purchased ? children : <Navigate to={`/course-details/${courseId}`} />;
};

export default PurchaseCourseProtectedRoute;
