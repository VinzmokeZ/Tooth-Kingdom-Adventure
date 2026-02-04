import React, { useState } from 'react';
import { ScreenProps } from './types';
import { ArrowLeft, BookOpen, Video, FileText, Download, Play, Star, Users, Baby, GraduationCap, Search, Sparkles, Bot, Award, Clock, CheckCircle, Lock, Bookmark, TrendingUp, Brain, Zap, Globe, X } from 'lucide-react';
import logo from 'figma:asset/5b0695099dfd67c35f14fc4f047da4df5ed6aa0e.png';

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  lessons: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'kids' | 'parents' | 'teachers';
  thumbnail: string;
  progress?: number;
  rating: number;
  students: string;
  isDownloaded?: boolean;
  isFeatured?: boolean;
  aiRecommended?: boolean;
}

interface PDFResource {
  id: number;
  title: string;
  description: string;
  pages: number;
  size: string;
  category: 'guide' | 'worksheet' | 'reference' | 'activity';
  targetAudience: 'kids' | 'parents' | 'teachers';
  thumbnail: string;
  isDownloaded: boolean;
  downloadProgress?: number;
  aiRecommended?: boolean;
}

export function LearningAcademyScreen({ navigateTo, userData }: ScreenProps) {
  const [activeTab, setActiveTab] = useState<'courses' | 'pdfs' | 'mylearning' | 'ai-tutor'>('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'kids' | 'parents' | 'teachers'>('all');
  const [showAITutor, setShowAITutor] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Course | null>(null);
  const [aiMessage, setAIMessage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleAskAI = () => {
    setIsTyping(true);
    setAIMessage(null);
    setTimeout(() => {
      setIsTyping(false);
      setAIMessage("Excellent question! To master the 'Circle' technique, angle your brush at 45 degrees towards the gums. Kids love this because it feels like a massage for their teeth! 🦷💆‍♂️");
    }, 1500);
  };

  const courses: Course[] = [
    {
      id: 1,
      title: 'Complete Dental Hygiene for Kids',
      description: 'Master brushing, flossing, and healthy habits through fun interactive lessons',
      instructor: 'Dr. Sarah Smile',
      duration: '2h 30m',
      lessons: 12,
      level: 'beginner',
      category: 'kids',
      thumbnail: 'https://images.unsplash.com/photo-1584516151140-f79fde30d55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBjYXJlJTIwY2hpbGRyZW4lMjBicnVzaGluZ3xlbnwxfHx8fDE3NjkxNTM0ODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      progress: 45,
      rating: 5,
      students: '15.2K',
      isDownloaded: true,
      isFeatured: true,
      aiRecommended: true,
    },
    {
      id: 2,
      title: 'Parenting Guide: Dental Care 0-12',
      description: 'Complete roadmap for your child\'s dental health from infancy to pre-teens',
      instructor: 'Dr. Mike Tooth',
      duration: '3h 15m',
      lessons: 18,
      level: 'beginner',
      category: 'parents',
      thumbnail: 'https://images.unsplash.com/photo-1758653500342-5476c8ec3da6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50aXN0JTIwcHJvZmVzc2lvbmFsJTIwbWVkaWNhbHxlbnwxfHx8fDE3NjkxNTM0ODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      progress: 0,
      rating: 5,
      students: '22.8K',
      isFeatured: true,
      aiRecommended: true,
    },
    {
      id: 3,
      title: 'Teaching Dental Health in Schools',
      description: 'Professional curriculum for educators with lesson plans and activities',
      instructor: 'Prof. Lisa Care',
      duration: '4h 00m',
      lessons: 24,
      level: 'intermediate',
      category: 'teachers',
      thumbnail: 'https://images.unsplash.com/photo-1542725752-e9f7259b3881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBib29rcyUyMGxlYXJuaW5nfGVufDF8fHx8MTc2OTEzODc4OHww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      students: '8.5K',
    },
    {
      id: 4,
      title: 'Advanced Brushing Techniques',
      description: 'Level up your brushing skills with professional techniques',
      instructor: 'Dr. Emma Clean',
      duration: '1h 45m',
      lessons: 8,
      level: 'advanced',
      category: 'kids',
      thumbnail: 'https://images.unsplash.com/photo-1764874299025-d8b2251f307d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2hpZXZlbWVudCUyMHRyb3BoeSUyMGF3YXJkfGVufDF8fHx8MTc2OTE1MzQ4NXww&ixlib=rb-4.1.0&q=80&w=1080',
      progress: 100,
      rating: 5,
      students: '12.1K',
      isDownloaded: true,
    },
    {
      id: 5,
      title: 'Nutrition for Healthy Teeth',
      description: 'Learn which foods strengthen teeth and which to avoid',
      instructor: 'Dr. Carlos Nutri',
      duration: '2h 00m',
      lessons: 10,
      level: 'beginner',
      category: 'parents',
      thumbnail: 'https://images.unsplash.com/photo-1645220559451-aaacbbd7bcc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMHZlZ2V0YWJsZXMlMjBudXRyaXRpb258ZW58MXx8fHwxNzY5MTUzNDg2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4,
      students: '18.3K',
      aiRecommended: true,
    },
    {
      id: 6,
      title: 'Fun Dental Games & Activities',
      description: 'Interactive games to make dental learning exciting for classrooms',
      instructor: 'Teacher Joy',
      duration: '1h 30m',
      lessons: 6,
      level: 'beginner',
      category: 'teachers',
      thumbnail: 'https://images.unsplash.com/photo-1571593992702-27f222d4059a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHBsYXlpbmclMjBnYW1lc3xlbnwxfHx8fDE3NjkxNTM0ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      students: '6.7K',
    },
  ];

  const pdfResources: PDFResource[] = [
    {
      id: 1,
      title: 'Brushing Basics Illustrated Guide',
      description: 'Step-by-step visual guide for proper brushing technique',
      pages: 24,
      size: '4.2 MB',
      category: 'guide',
      targetAudience: 'kids',
      thumbnail: 'https://images.unsplash.com/photo-1584516151140-f79fde30d55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBjYXJlJTIwY2hpbGRyZW4lMjBicnVzaGluZ3xlbnwxfHx8fDE3NjkxNTM0ODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      isDownloaded: true,
      aiRecommended: true,
    },
    {
      id: 2,
      title: 'Dental Heroes Coloring Book',
      description: 'Fun coloring pages featuring all Tooth Kingdom characters',
      pages: 32,
      size: '8.5 MB',
      category: 'activity',
      targetAudience: 'kids',
      thumbnail: 'https://images.unsplash.com/photo-1649750291589-8812197b698c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmluZyUyMGJvb2slMjBhcnQlMjBjaGlsZHJlbnxlbnwxfHx8fDE3NjkxNTM0ODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      isDownloaded: true,
    },
    {
      id: 3,
      title: 'Parent\'s Complete Dental Handbook',
      description: 'Comprehensive guide covering all aspects of children\'s dental care',
      pages: 68,
      size: '12.3 MB',
      category: 'reference',
      targetAudience: 'parents',
      thumbnail: 'https://images.unsplash.com/photo-1542725752-e9f7259b3881?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBib29rcyUyMGxlYXJuaW5nfGVufDF8fHx8MTc2OTEzODc4OHww&ixlib=rb-4.1.0&q=80&w=1080',
      isDownloaded: false,
      aiRecommended: true,
    },
    {
      id: 4,
      title: 'Classroom Worksheets Pack',
      description: '50+ printable worksheets for different grade levels',
      pages: 52,
      size: '15.7 MB',
      category: 'worksheet',
      targetAudience: 'teachers',
      thumbnail: 'https://images.unsplash.com/photo-1588561181397-fed38f837e17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3RlYm9vayUyMHdyaXRpbmclMjB3b3Jrc2hlZXR8ZW58MXx8fHwxNzY5MTUzNDg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      isDownloaded: false,
    },
    {
      id: 5,
      title: 'Tooth Anatomy for Kids',
      description: 'Educational poster and guide explaining tooth structure',
      pages: 8,
      size: '2.1 MB',
      category: 'guide',
      targetAudience: 'kids',
      thumbnail: 'https://images.unsplash.com/photo-1614308457932-e16d85c5d053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwbWljcm9zY29wZSUyMGxhYm9yYXRvcnl8ZW58MXx8fHwxNzY5MTUzNDg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      isDownloaded: true,
      downloadProgress: 100,
    },
    {
      id: 6,
      title: 'Dental Emergency Response Guide',
      description: 'Quick reference for handling common dental emergencies',
      pages: 16,
      size: '3.4 MB',
      category: 'reference',
      targetAudience: 'parents',
      thumbnail: 'https://images.unsplash.com/photo-1760783544473-33be6396eb5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWVyZ2VuY3klMjBtZWRpY2FsJTIwZmlyc3QlMjBhaWR8ZW58MXx8fHwxNzY5MTUzNDg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      isDownloaded: false,
      aiRecommended: true,
    },
    {
      id: 7,
      title: 'Weekly Dental Activity Planner',
      description: 'Structured activity plans for consistent dental education',
      pages: 28,
      size: '5.8 MB',
      category: 'worksheet',
      targetAudience: 'teachers',
      thumbnail: 'https://images.unsplash.com/photo-1588453251771-cd919b362ed4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxlbmRhciUyMHBsYW5uZXIlMjBzY2hlZHVsZXxlbnwxfHx8fDE3NjkxNDA3ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      isDownloaded: true,
    },
    {
      id: 8,
      title: 'Healthy Snacks Recipe Book',
      description: 'Tooth-friendly recipes that kids will love',
      pages: 40,
      size: '9.2 MB',
      category: 'guide',
      targetAudience: 'parents',
      thumbnail: 'https://images.unsplash.com/photo-1630700499299-9ba22882142d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwYXBwbGUlMjBoZWFsdGh5fGVufDF8fHx8MTc2OTE1MzQ4OXww&ixlib=rb-4.1.0&q=80&w=1080',
      isDownloaded: false,
    },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesFilter = selectedFilter === 'all' || course.category === selectedFilter;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredPDFs = pdfResources.filter(pdf => {
    const matchesFilter = selectedFilter === 'all' || pdf.targetAudience === selectedFilter;
    const matchesSearch = pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pdf.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const myLearningCourses = courses.filter(c => c.progress && c.progress > 0);
  const downloadedPDFs = pdfResources.filter(p => p.isDownloaded);

  return (
    <div className="h-full bg-gradient-to-br from-purple-100 via-pink-50 to-cyan-50 flex flex-col overflow-hidden">
      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b flex justify-between items-center text-gray-900 font-bold">
              <h3>{activeVideo.title}</h3>
              <button onClick={() => setActiveVideo(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/u_FvI2Qj_-Y?autoplay=1"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-sm">{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 text-white p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>

        <div className="flex items-center gap-4 relative z-10 mb-6">
          <button
            onClick={() => navigateTo('dashboard')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold flex items-center gap-2">
              <GraduationCap className="w-7 h-7" />
              Learning Academy
            </h1>
            <p className="text-sm text-purple-100 mt-1">Your dental education hub 🎓</p>
          </div>
          <button
            onClick={() => setActiveTab('ai-tutor')}
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform relative ${activeTab === 'ai-tutor' ? 'ring-4 ring-white' : ''}`}
          >
            <Bot className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2 relative z-10">
          {[
            { id: 'courses', label: 'Courses', icon: Video },
            { id: 'pdfs', label: 'PDFs', icon: FileText },
            { id: 'mylearning', label: 'My Learning', icon: BookOpen },
            { id: 'ai-tutor', label: 'AI Tutor', icon: Bot },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${activeTab === tab.id
                ? 'bg-white text-purple-600 shadow-lg scale-105'
                : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-bold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Search Bar */}
          {(activeTab === 'courses' || activeTab === 'pdfs') && (
            <>
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab === 'courses' ? 'courses' : 'PDFs'}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                  { id: 'all', label: 'All', icon: '🌟' },
                  { id: 'kids', label: 'Kids', icon: '👶' },
                  { id: 'parents', label: 'Parents', icon: '👨‍👩‍👧' },
                  { id: 'teachers', label: 'Teachers', icon: '👩‍🏫' },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${selectedFilter === filter.id
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 border-2 border-gray-200'
                      }`}
                  >
                    <span className="text-lg">{filter.icon}</span>
                    <span className="text-sm font-bold">{filter.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              {/* Featured Courses */}
              {selectedFilter === 'all' && !searchQuery && (
                <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl shadow-2xl p-1">
                  <div className="bg-white rounded-[22px] p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center">
                        <Star className="w-5 h-5 text-white fill-white" />
                      </div>
                      <h3 className="text-xl font-extrabold text-gray-900">Featured Courses</h3>
                      <span className="ml-auto px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                        POPULAR
                      </span>
                    </div>
                    <div className="space-y-3">
                      {courses.filter(c => c.isFeatured).map((course) => (
                        <div
                          key={course.id}
                          onClick={() => setActiveVideo(course)}
                          className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4 hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                        >
                          <div className="flex gap-3">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl overflow-hidden flex-shrink-0">
                              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm text-gray-900 mb-1">{course.title}</h4>
                              <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {course.duration}
                                </span>
                                <span>•</span>
                                <span>{course.lessons} lessons</span>
                              </div>
                              {course.progress !== undefined && course.progress > 0 && (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-gray-600">Progress</span>
                                    <span className="font-bold text-purple-600">{course.progress}%</span>
                                  </div>
                                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                      style={{ width: `${course.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* AI Recommended */}
              {selectedFilter === 'all' && !searchQuery && (
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl shadow-2xl p-1">
                  <div className="bg-white rounded-[22px] p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-extrabold text-gray-900">AI Recommended for You</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Based on your progress and learning style 🤖✨
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {courses.filter(c => c.aiRecommended).slice(0, 4).map((course) => (
                        <div
                          key={course.id}
                          onClick={() => setActiveVideo(course)}
                          className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-3 hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                        >
                          <div className="w-full h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl overflow-hidden mb-2">
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                          </div>
                          <h4 className="font-bold text-xs text-gray-900 mb-1 line-clamp-2">
                            {course.title}
                          </h4>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Video className="w-3 h-3" />
                            <span>{course.lessons} lessons</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* All Courses */}
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                  All Courses
                  <span className="text-sm font-normal text-gray-500">({filteredCourses.length})</span>
                </h3>
                <div className="space-y-4">
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-purple-300"
                    >
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl overflow-hidden flex-shrink-0 relative">
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                          {course.isDownloaded && (
                            <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-extrabold text-gray-900 text-base">
                              {course.title}
                            </h4>
                            {course.aiRecommended && (
                              <span className="px-2 py-1 bg-gradient-to-r from-cyan-400 to-blue-400 text-white text-xs font-bold rounded-full whitespace-nowrap flex items-center gap-1 flex-shrink-0">
                                <Sparkles className="w-3 h-3" />
                                AI
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {course.description}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {course.students}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {course.duration}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {course.rating}.0
                            </span>
                          </div>

                          {course.progress !== undefined && course.progress > 0 && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-600">Your Progress</span>
                                <span className="font-bold text-purple-600">{course.progress}%</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={() => setActiveVideo(course)}
                              className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm flex items-center justify-center gap-2"
                            >
                              <Play className="w-4 h-4" />
                              {course.progress ? 'Continue' : 'Start Course'}
                            </button>
                            {!course.isDownloaded && (
                              <button className="w-12 h-full bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center">
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PDFs Tab */}
          {activeTab === 'pdfs' && (
            <div className="space-y-6">
              {/* Downloaded PDFs */}
              {selectedFilter === 'all' && !searchQuery && downloadedPDFs.length > 0 && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl shadow-2xl p-1">
                  <div className="bg-white rounded-[22px] p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-extrabold text-gray-900">Downloaded for Offline</h3>
                      <span className="ml-auto px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {downloadedPDFs.length} FILES
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {downloadedPDFs.map((pdf) => (
                        <div
                          key={pdf.id}
                          onClick={() => window.open('https://www.mouthhealthy.org/en/az-topics/b/brushing-your-teeth', '_blank')}
                          className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-3 hover:shadow-lg hover:scale-105 transition-all cursor-pointer overflow-hidden"
                        >
                          <div className="text-3xl mb-2">{pdf.thumbnail}</div>
                          <h4 className="font-bold text-xs text-gray-900 mb-1 line-clamp-1">
                            {pdf.title}
                          </h4>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <FileText className="w-3 h-3" />
                            <span>{pdf.pages} pages</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* AI Recommended PDFs */}
              {selectedFilter === 'all' && !searchQuery && (
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl shadow-2xl p-1">
                  <div className="bg-white rounded-[22px] p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-extrabold text-gray-900">AI Recommended PDFs</h3>
                    </div>
                    <div className="space-y-2">
                      {pdfResources.filter(p => p.aiRecommended).map((pdf) => (
                        <div
                          key={pdf.id}
                          onClick={() => window.open('https://www.colgate.com/en-us/oral-health/kids-oral-care', '_blank')}
                          className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-3 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{pdf.thumbnail}</div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm text-gray-900">{pdf.title}</h4>
                              <p className="text-xs text-gray-600">{pdf.pages} pages • {pdf.size}</p>
                            </div>
                            <button className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                              <Download className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* All PDFs */}
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                  All PDF Resources
                  <span className="text-sm font-normal text-gray-500">({filteredPDFs.length})</span>
                </h3>
                <div className="space-y-4">
                  {filteredPDFs.map((pdf) => (
                    <div
                      key={pdf.id}
                      className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-purple-300"
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 relative">
                          {pdf.thumbnail}
                          {pdf.isDownloaded && (
                            <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-extrabold text-gray-900 text-base line-clamp-1">
                              {pdf.title}
                            </h4>
                            {pdf.aiRecommended && (
                              <span className="px-2 py-1 bg-gradient-to-r from-cyan-400 to-blue-400 text-white text-xs font-bold rounded-full whitespace-nowrap flex items-center gap-1 flex-shrink-0">
                                <Sparkles className="w-3 h-3" />
                                AI
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {pdf.description}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg font-medium">
                              {pdf.category.toUpperCase()}
                            </span>
                            <span>{pdf.pages} pages</span>
                            <span>•</span>
                            <span>{pdf.size}</span>
                          </div>

                          {pdf.downloadProgress !== undefined && pdf.downloadProgress < 100 && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-600">Downloading...</span>
                                <span className="font-bold text-green-600">{pdf.downloadProgress}%</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                                  style={{ width: `${pdf.downloadProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2">
                            {pdf.isDownloaded ? (
                              <>
                                <button
                                  onClick={() => window.open('https://www.ada.org/resources/public-programs/national-childrens-dental-health-month', '_blank')}
                                  className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm flex items-center justify-center gap-2"
                                >
                                  <FileText className="w-4 h-4" />
                                  Open Resource
                                </button>
                                <button
                                  onClick={() => alert('Bookmarked!')}
                                  className="w-12 h-full bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center"
                                >
                                  <Bookmark className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => alert(`Starting download for ${pdf.title}... (${pdf.size})`)}
                                className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm flex items-center justify-center gap-2"
                              >
                                <Download className="w-4 h-4" />
                                Download ({pdf.size})
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* My Learning Tab */}
          {activeTab === 'mylearning' && (
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl mb-2 mx-auto">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-extrabold text-center">{myLearningCourses.length}</div>
                  <div className="text-xs text-center text-purple-100">In Progress</div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl mb-2 mx-auto">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-extrabold text-center">{downloadedPDFs.length}</div>
                  <div className="text-xs text-center text-green-100">Downloaded</div>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white shadow-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl mb-2 mx-auto">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-extrabold text-center">2</div>
                  <div className="text-xs text-center text-amber-100">Completed</div>
                </div>
              </div>

              {/* Continue Learning */}
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-4">Continue Learning</h3>
                <div className="space-y-3">
                  {myLearningCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all cursor-pointer"
                    >
                      <div className="flex gap-3 mb-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl overflow-hidden flex-shrink-0">
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 mb-1">{course.title}</h4>
                          <p className="text-xs text-gray-600">{course.instructor}</p>
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-bold text-purple-600">{course.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />
                        Continue Learning
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Downloaded Resources */}
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-500" />
                  Offline Available
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {downloadedPDFs.map((pdf) => (
                    <div
                      key={pdf.id}
                      className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all cursor-pointer"
                    >
                      <div className="text-4xl mb-2">{pdf.thumbnail}</div>
                      <h4 className="font-bold text-sm text-gray-900 mb-1 line-clamp-2">
                        {pdf.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-3">{pdf.pages} pages</p>
                      <button
                        onClick={() => window.open('https://www.mouthhealthy.org/en/az-topics/b/brushing-your-teeth', '_blank')}
                        className="w-full py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all text-xs"
                      >
                        Read Online
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Tutor Tab */}
          {activeTab === 'ai-tutor' && (
            <div className="space-y-6">
              {/* AI Tutor Header */}
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl shadow-2xl p-1">
                <div className="bg-white rounded-[22px] p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Bot className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                        AI Learning Tutor
                        <span className="px-2 py-1 bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs font-bold rounded-full">
                          ONLINE 24/7
                        </span>
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Your personal AI assistant for dental education 🤖💙
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4 mb-4">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-500" />
                      What I Can Do:
                    </h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <span>Answer any dental health questions instantly</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <span>Create personalized learning paths based on your goals</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <span>Recommend the best courses and resources for you</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <span>Quiz you on what you've learned to reinforce knowledge</span>
                      </div>
                    </div>
                  </div>

                  {/* Message Area */}
                  <div className="space-y-4 mb-6">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white border-2 border-cyan-100 rounded-2xl rounded-tl-none p-4 shadow-sm max-w-[85%]">
                        <p className="text-sm text-gray-700 font-medium">
                          Hello! I'm your AI Tutor. What would you like to learn about dental health today? 🤖✨
                        </p>
                      </div>
                    </div>

                    {isTyping && (
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-2">
                          <Bot className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 animate-pulse">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {aiMessage && (
                      <div className="flex gap-3 animate-fadeIn">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-100 rounded-2xl rounded-tl-none p-4 shadow-md max-w-[85%]">
                          <p className="text-sm text-gray-800 leading-relaxed italic font-medium">
                            "{aiMessage}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input area */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="ai-tutor-input"
                      placeholder="Ask me anything..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAskAI();
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                      className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-all font-medium"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('ai-tutor-input') as HTMLInputElement;
                        if (input) {
                          handleAskAI();
                          input.value = '';
                        }
                      }}
                      disabled={isTyping}
                      className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all flex items-center justify-center disabled:opacity-50"
                    >
                      <Bot className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Popular Questions */}
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-4">💡 Popular Questions</h3>
                <div className="space-y-2">
                  {[
                    'How often should kids brush their teeth?',
                    "What's the best technique for flossing?",
                    'Which foods are best for dental health?',
                    'How do I prepare my child for dentist visits?',
                    'What age should kids start using mouthwash?',
                    'How to deal with tooth sensitivity?',
                  ].map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const input = document.getElementById('ai-tutor-input') as HTMLInputElement;
                        if (input) {
                          input.value = question;
                          handleAskAI();
                        }
                      }}
                      className="w-full text-left px-4 py-3 bg-white rounded-xl text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:shadow-lg transition-all border-2 border-gray-200 hover:border-purple-300"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Learning Insights */}
              <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl shadow-2xl p-1">
                <div className="bg-white rounded-[22px] p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-6 h-6 text-amber-500" />
                    <h3 className="text-xl font-extrabold text-gray-900">Your Learning Insights</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl">
                      <div className="text-2xl">🎯</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-gray-900 mb-1">Learning Style</h4>
                        <p className="text-xs text-gray-700">
                          You learn best through visual content. AI recommends video courses!
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl">
                      <div className="text-2xl">⏰</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-gray-900 mb-1">Best Learning Time</h4>
                        <p className="text-xs text-gray-700">
                          You're most active in the morning. Schedule lessons for 9-11 AM!
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                      <div className="text-2xl">📈</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-gray-900 mb-1">Progress Prediction</h4>
                        <p className="text-xs text-gray-700">
                          At your current pace, you'll complete 3 more courses this month!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      ` }} />
    </div>
  );
}