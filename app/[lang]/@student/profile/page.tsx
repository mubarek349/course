"use client";
import { User, Mail, BookOpen, GraduationCap } from "lucide-react";

export default function StudentProfilePage() {
  // Example data, replace with real user data from context or props
  const user = {
    name: "Student Name",
    email: "student@example.com",
    avatar: "/avatar.png",
    courses: 5,
    completed: 3,
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col items-center">
        <img
          src={user.avatar}
          alt="Avatar"
          className="w-24 h-24 rounded-full border-2 border-primary mb-4"
        />
        <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <User className="size-5 text-primary" />
          {user.name}
        </h2>
        <p className="text-gray-500 flex items-center gap-2 mb-4">
          <Mail className="size-4" />
          {user.email}
        </p>
        <div className="flex gap-6 mt-2">
          <div className="flex flex-col items-center">
            <BookOpen className="size-6 text-primary mb-1" />
            <span className="font-semibold">{user.courses}</span>
            <span className="text-xs text-gray-500">Courses</span>
          </div>
          <div className="flex flex-col items-center">
            <GraduationCap className="size-6 text-success mb-1" />
            <span className="font-semibold">{user.completed}</span>
            <span className="text-xs text-gray-500">Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
