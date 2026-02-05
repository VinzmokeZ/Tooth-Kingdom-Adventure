/**
 * Tooth Kingdom Adventure - Learning Content Data
 * 
 * USE THIS FILE TO UPDATE LINKS AND RESOURCES.
 * 
 * This file serves as the central "outlet" for all external content.
 * You can update video URLs, PDF links, and descriptions here without
 * modifying the rest of the application code.
 * 
 * INSTRUCTIONS:
 * 1. Find the resource you want to update in the arrays below.
 * 2. Update the 'url' field with your actual video or PDF link.
 * 3. Update 'thumbnail', 'title', or 'description' as needed.
 */

// ------------------------------------------------------------------
// TYPES (Do not modify these unless you are a developer)
// ------------------------------------------------------------------

export interface Resource {
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
    url: string;
}

export interface Course {
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
    url: string; // <--- UPDATE THIS LINK FOR COURSES
}

export interface PDFResource {
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
    url: string; // <--- UPDATE THIS LINK FOR PDFS
}

// ------------------------------------------------------------------
// DATA - LEARNING RESOURCES (Videos, Interactive, General PDFs)
// ------------------------------------------------------------------

export const LEARNING_RESOURCES: Resource[] = [
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
        thumbnail: 'https://images.unsplash.com/photo-1559656846-5fd2e73a0c28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b290aGJydXNoaW5nJTIwa2lkc3xlbnwxfHx8fDE3NjkxNDA3ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        aiRecommended: true,
        url: 'https://www.youtube.com/results?search_query=brushing+teeth+for+kids+cartoon'
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
        thumbnail: 'https://images.unsplash.com/photo-1626202378378-2895ea338696?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5keSUyMHN3ZWV0c3xlbnwxfHx8fDE3NjkxNDA3ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        aiRecommended: true,
        url: 'https://en.wikipedia.org/wiki/Tooth_decay',
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
        thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmluZyUyMHBlbmNpbHMlMjBhcnR8ZW58MXx8fHwxNzY5MTQwNzg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        url: 'https://www.crayola.com/free-coloring-pages/health/dental-coloring-pages/'
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
        thumbnail: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50c3RyeSUyMGZsb3NzaW5nfGVufDF8fHx8MTc2OTE0MDc4OXww&ixlib=rb-4.1.0&q=80&w=1080',
        url: 'https://www.youtube.com/results?search_query=flossing+dance+for+kids'
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
        thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm93aW5nJTIwdXAlMjBraWRzJTIwaGVhbHRofGVufDF8fHx8MTc2OTE0MDc4OXww&ixlib=rb-4.1.0&q=80&w=1080',
        aiRecommended: true,
        url: 'https://www.mouthhealthy.org/life-stages/babies-and-kids'
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
        thumbnail: 'https://images.unsplash.com/photo-1516575150278-77136aed6920?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwaGFiaXRzJTIwZmFtaWx5fGVufDF8fHx8MTc2OTE0MDc4OXww&ixlib=rb-4.1.0&q=80&w=1080',
        url: 'https://www.youtube.com/results?search_query=dental+hygiene+tips+for+parents'
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
        thumbnail: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMHBsYXRlfGVufDF8fHx8MTc2OTE0MDc4OXww&ixlib=rb-4.1.0&q=80&w=1080',
        url: 'https://www.healthline.com/nutrition/healthy-teeth-foods'
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
        thumbnail: 'https://images.unsplash.com/photo-1588776813186-6f46c4f6b520?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50aXN0JTIwY2hhaXJ8ZW58MXx8fHwxNzY5MTQwNzg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        aiRecommended: true,
        url: 'https://www.youtube.com/results?search_query=child+first+dentist+visit+prep'
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
        thumbnail: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc3Jvb20lMjB0ZWFjaGVyfGVufDF8fHx8MTc2OTE0MDc4OXww&ixlib=rb-4.1.0&q=80&w=1080',
        aiRecommended: true,
        url: 'https://www.ada.org/resources/community-initiatives/national-childrens-dental-health-month'
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
        thumbnail: 'https://images.unsplash.com/photo-1493612276216-9c5922030c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lcyUyMGtpZHN8ZW58MXx8fHwxNzY5MTQwNzg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        url: 'https://pbskids.org/games/teeth/'
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
        thumbnail: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdWRpdG9yaXVtJTIwc2Nob29sfGVufDF8fHx8MTc2OTE0MDc4OXww&ixlib=rb-4.1.0&q=80&w=1080',
        url: 'https://www.youtube.com/results?search_query=dental+health+school+assembly'
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
        thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXBlciUyMHdvcmtzaGVldHxlbnwxfHx8fDE3NjkxNDA3ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        url: 'https://www.education.com/worksheets/dental-health/'
    },
];

// ------------------------------------------------------------------
// DATA - LEARNING ACADEMY (Courses & Focused PDFs)
// ------------------------------------------------------------------

export const ACADEMY_COURSES: Course[] = [
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
        url: 'https://www.youtube.com/results?search_query=dental+hygiene+course+for+kids',
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
        url: 'https://www.youtube.com/results?search_query=parenting+guide+dental+care',
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
        url: 'https://www.youtube.com/results?search_query=teaching+dental+health+in+schools',
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
        url: 'https://www.youtube.com/results?search_query=advanced+brushing+techniques',
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
        url: 'https://www.youtube.com/results?search_query=nutrition+healthy+teeth',
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
        url: 'https://www.youtube.com/results?search_query=dental+games+activities',
    },
];

export const ACADEMY_PDFS: PDFResource[] = [
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
        url: 'https://www.colgate.com/en-us/oral-health/basics/brushing-and-flossing/how-to-brush'
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
        url: 'https://www.crayola.com/free-coloring-pages/health/dental-coloring-pages/'
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
        url: 'https://www.mouthhealthy.org/all-topics-a-z/brushing-companion'
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
        url: 'https://www.education.com/worksheets/dental-health/'
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
        url: 'https://www.mouthhealthy.org/-/media/project/ada-organization/ada/mouthhealthy/files/kids_brushing_calendar.pdf'
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
        url: 'https://www.mouthhealthy.org/dental-care-concerns/dental-emergencies'
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
        url: 'https://www.superteacherworksheets.com/dental-health.html'
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
        url: 'https://www.youtube.com/results?search_query=first+dentist+visit+story'
    }
];
