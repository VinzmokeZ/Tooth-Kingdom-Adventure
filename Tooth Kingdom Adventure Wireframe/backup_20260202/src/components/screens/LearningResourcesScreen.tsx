import React, { useState } from 'react';
import { ScreenProps } from './types';
import { ArrowLeft, BookOpen, Video, FileText, Download, Play, Star, Users, Baby, GraduationCap, Search, Sparkles, Bot } from 'lucide-react';
import logo from 'figma:asset/5b0695099dfd67c35f14fc4f047da4df5ed6aa0e.png';

interface Resource {
  id: number;
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'interactive';
  category: 'kids' | 'parents' | 'teachers';
  duration?: string;
  pages?: number;
  rating: number;
  views: string;
  thumbnail: string;
  aiRecommended?: boolean;
}

export function LearningResourcesScreen({ navigateTo }: ScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'kids' | 'parents' | 'teachers'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'video' | 'pdf' | 'interactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const resources: Resource[] = [
    // Kids Resources
    {
      id: 1,
      title: 'Brushing Basics for Heroes',
      description: 'Learn the proper way to brush your teeth with fun animations!',
      type: 'video',
      category: 'kids',
      duration: '5:30',
      rating: 5,
      views: '12.5K',
      thumbnail: '🦷',
      aiRecommended: true,
    },
    {
      id: 2,
      title: 'The Sugar Monster Story',
      description: 'An interactive story about how sugar affects your teeth',
      type: 'interactive',
      category: 'kids',
      duration: '10 min',
      rating: 5,
      views: '8.2K',
      thumbnail: '👾',
      aiRecommended: true,
    },
    {
      id: 3,
      title: 'Dental Heroes Coloring Book',
      description: 'Print and color your favorite tooth kingdom characters!',
      type: 'pdf',
      category: 'kids',
      pages: 15,
      rating: 4,
      views: '15.3K',
      thumbnail: '🎨',
    },
    {
      id: 4,
      title: 'Flossing Fun Challenge',
      description: 'Master the art of flossing with step-by-step videos',
      type: 'video',
      category: 'kids',
      duration: '4:15',
      rating: 5,
      views: '9.7K',
      thumbnail: '🧵',
    },

    // Parents Resources
    {
      id: 5,
      title: 'Age-Appropriate Oral Care Guide',
      description: 'Complete guide for dental care from infancy to teens',
      type: 'pdf',
      category: 'parents',
      pages: 24,
      rating: 5,
      views: '18.9K',
      thumbnail: '📚',
      aiRecommended: true,
    },
    {
      id: 6,
      title: 'Creating Healthy Habits',
      description: 'Expert tips on building lasting dental hygiene routines',
      type: 'video',
      category: 'parents',
      duration: '12:45',
      rating: 5,
      views: '14.2K',
      thumbnail: '💡',
    },
    {
      id: 7,
      title: 'Nutrition for Strong Teeth',
      description: 'Foods that promote dental health and what to avoid',
      type: 'pdf',
      category: 'parents',
      pages: 18,
      rating: 4,
      views: '11.5K',
      thumbnail: '🥗',
    },
    {
      id: 8,
      title: 'Dental Visit Preparation',
      description: 'How to prepare your child for their first dentist visit',
      type: 'video',
      category: 'parents',
      duration: '8:20',
      rating: 5,
      views: '16.8K',
      thumbnail: '🏥',
      aiRecommended: true,
    },

    // Teachers Resources
    {
      id: 9,
      title: 'Classroom Dental Curriculum',
      description: 'Complete lesson plans for teaching dental hygiene in schools',
      type: 'pdf',
      category: 'teachers',
      pages: 45,
      rating: 5,
      views: '7.3K',
      thumbnail: '📖',
      aiRecommended: true,
    },
    {
      id: 10,
      title: 'Educational Dental Games',
      description: 'Interactive activities and games for group learning',
      type: 'interactive',
      category: 'teachers',
      duration: '30 min',
      rating: 5,
      views: '6.1K',
      thumbnail: '🎮',
    },
    {
      id: 11,
      title: 'Dental Health Assembly Program',
      description: 'Ready-to-use presentation for school assemblies',
      type: 'video',
      category: 'teachers',
      duration: '25:00',
      rating: 4,
      views: '5.8K',
      thumbnail: '🎬',
    },
    {
      id: 12,
      title: 'Printable Worksheets Pack',
      description: 'Fun worksheets and activities for all grade levels',
      type: 'pdf',
      category: 'teachers',
      pages: 32,
      rating: 5,
      views: '9.2K',
      thumbnail: '📝',
    },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  const aiRecommendations = resources.filter(r => r.aiRecommended);

  return (
    <div className="h-full bg-gradient-to-br from-purple-100 via-pink-50 to-cyan-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>

        <div className="flex items-center gap-4 relative z-10">
          <button
            onClick={() => navigateTo('dashboard')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold flex items-center gap-2">
              <BookOpen className="w-7 h-7" />
              Learning Resources
            </h1>
            <p className="text-sm text-purple-100 mt-1">Educational content for everyone!</p>
          </div>
          <button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform relative"
          >
            <Bot className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* AI Assistant Panel */}
          {showAIAssistant && (
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl shadow-2xl p-1 animate-slideDown">
              <div className="bg-white rounded-[22px] p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                      AI Learning Assistant
                      <span className="px-2 py-1 bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs font-bold rounded-full">
                        ONLINE
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Hi! I'm your smart learning buddy! Ask me anything about dental health. 🤖💙
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <p className="text-sm text-gray-700 mb-3 font-medium">💡 Popular Questions:</p>
                  <div className="space-y-2">
                    {[
                      'How often should kids brush their teeth?',
                      'What age should children start flossing?',
                      'Best toothpaste for sensitive teeth?',
                      'How to make brushing fun for kids?'
                    ].map((question, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-2 bg-white rounded-xl text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all border border-gray-200"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask me anything about dental health..."
                    className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all">
                    Ask AI
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Who is learning?</h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'all', label: 'All', icon: '🌟' },
                { id: 'kids', label: 'Kids', icon: '👶' },
                { id: 'parents', label: 'Parents', icon: '👨‍👩‍👧' },
                { id: 'teachers', label: 'Teachers', icon: '👩‍🏫' },
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as any)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${selectedCategory === category.id
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-xs font-bold">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Type Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All Types', icon: Sparkles },
              { id: 'video', label: 'Videos', icon: Video },
              { id: 'pdf', label: 'PDFs', icon: FileText },
              { id: 'interactive', label: 'Interactive', icon: Play },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${selectedType === type.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200'
                  }`}
              >
                <type.icon className="w-4 h-4" />
                <span className="text-sm font-bold">{type.label}</span>
              </button>
            ))}
          </div>

          {/* AI Recommendations */}
          {selectedCategory === 'all' && selectedType === 'all' && !searchQuery && (
            <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl shadow-2xl p-1">
              <div className="bg-white rounded-[22px] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900">AI Recommendations</h3>
                  <span className="ml-auto px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                    FOR YOU
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Based on your progress and interests, our AI suggests these resources! 🤖✨
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {aiRecommendations.slice(0, 4).map((resource) => (
                    <div
                      key={resource.id}
                      className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4 hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                    >
                      <div className="text-4xl mb-2">{resource.thumbnail}</div>
                      <h4 className="font-bold text-sm text-gray-900 mb-1 line-clamp-2">
                        {resource.title}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        {resource.type === 'video' && <Video className="w-3 h-3" />}
                        {resource.type === 'pdf' && <FileText className="w-3 h-3" />}
                        {resource.type === 'interactive' && <Play className="w-3 h-3" />}
                        <span>{resource.duration || `${resource.pages} pages`}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Resources Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-gray-900">
                {filteredResources.length} Resources Found
              </h3>
            </div>

            <div className="space-y-4">
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-purple-300"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
                      {resource.thumbnail}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-extrabold text-gray-900 text-base">
                          {resource.title}
                        </h4>
                        {resource.aiRecommended && (
                          <span className="px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold rounded-full whitespace-nowrap flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {resource.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {/* Type Badge */}
                        <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
                          {resource.type === 'video' && <Video className="w-3 h-3" />}
                          {resource.type === 'pdf' && <FileText className="w-3 h-3" />}
                          {resource.type === 'interactive' && <Play className="w-3 h-3" />}
                          {resource.type === 'video' ? resource.duration : `${resource.pages} pages`}
                        </span>

                        {/* Category */}
                        <span className="flex items-center gap-1">
                          {resource.category === 'kids' && <Baby className="w-3 h-3" />}
                          {resource.category === 'parents' && <Users className="w-3 h-3" />}
                          {resource.category === 'teachers' && <GraduationCap className="w-3 h-3" />}
                          {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                        </span>

                        {/* Rating */}
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {resource.rating}.0
                        </span>

                        {/* Views */}
                        <span>{resource.views} views</span>
                      </div>
                    </div>

                    {/* Download Button */}
                    <button className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg flex-shrink-0">
                      {resource.type === 'video' || resource.type === 'interactive' ? (
                        <Play className="w-5 h-5" />
                      ) : (
                        <Download className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* No Results */}
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      ` }} />
    </div>
  );
}
