import React, { useState } from 'react';
import { ScreenProps } from './types';
import { GraduationCap, Bell, Settings, LogOut, Flame, Star, TrendingUp, Sparkles, Bot, Wand2, Home, BarChart2, Users, ClipboardList, Trophy, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar } from '../common/UserAvatar';
import { motion } from 'framer-motion';

// ─── HOME TAB ──────────────────────────────────────────────────────
function TeacherHomeTab({ userData }: any) {
    const [currentTip, setCurrentTip] = useState("Your class averaged a 92% Enamel Health score this week — phenomenal! Consider adding a 'Class Shield' reward next Monday.");
    const [isAnimatingTip, setIsAnimatingTip] = useState(false);

    const TEACHER_TIPS = [
        "Your class averaged a 92% Enamel Health score this week — phenomenal! Consider adding a 'Class Shield' reward next Monday.",
        "Tip: Group brushing challenges are proven to increase motivation. Try assigning a 'Class Streak' goal!",
        "Students with higher in-game levels tend to brush more consistently. Use the leaderboard to encourage peers.",
        "Reminder: Send a brushing reminder notification to students who have not logged their AM session today.",
        "Data insight: Your class brushing consistency improved 18% after last week's 'Sugar Bug' campaign!",
    ];

    const mockStudents = [
        { id: 1, name: userData.name || 'Hero', level: userData.level, stars: userData.totalStars, character: userData.selectedCharacter, status: 'Online', health: userData.enamelHealth },
        { id: 2, name: 'Alex Archer', level: 12, stars: 1450, character: '2', status: 'Brushing', health: 88 },
        { id: 3, name: 'Luna Light', level: 8, stars: 890, character: '3', status: 'Offline', health: 62 },
        { id: 4, name: 'Leo Lion', level: 15, stars: 2100, character: '1', status: 'Online', health: 95 },
    ];

    const getNewTip = () => {
        setIsAnimatingTip(true);
        setTimeout(() => {
            const available = TEACHER_TIPS.filter(t => t !== currentTip);
            setCurrentTip(available[Math.floor(Math.random() * available.length)]);
            setIsAnimatingTip(false);
        }, 500);
    };

    return (
        <div className="space-y-6">
            {/* Class Overview Stats */}
            <div>
                <h3 className="font-black text-gray-400 tracking-widest uppercase text-[10px] mb-4 px-1">Class Overview</h3>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { icon: Users, color: 'bg-blue-100', textColor: 'text-blue-600', label: 'Students', value: '24' },
                        { icon: Trophy, color: 'bg-amber-100', textColor: 'text-amber-600', label: 'Class Stars', value: '12k' },
                        { icon: Flame, color: 'bg-emerald-100', textColor: 'text-emerald-600', label: 'Avg Health', value: '86%' },
                    ].map(({ icon: Icon, color, textColor, label, value }) => (
                        <div key={label} className="bg-white rounded-[2rem] p-4 shadow-xl border border-gray-100 text-center relative overflow-hidden">
                            <div className={`absolute -right-2 -top-2 w-10 h-10 ${color} rounded-full opacity-60`} />
                            <div className={`w-10 h-10 ${color} rounded-2xl flex items-center justify-center mx-auto mb-2`}>
                                <Icon className={`w-5 h-5 ${textColor}`} />
                            </div>
                            <p className={`text-xl font-black text-gray-900`}>{value}</p>
                            <p className={`text-[8px] font-black ${textColor} uppercase tracking-widest`}>{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Student Roster */}
            <div>
                <h3 className="font-black text-gray-400 tracking-widest uppercase text-[10px] mb-4 px-1">Kingdom Heroes</h3>
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                    {mockStudents.map((student) => (
                        <div key={student.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="relative flex-shrink-0">
                                <UserAvatar characterId={student.character} showBackground={false} className="w-12 h-12 bg-blue-50 rounded-2xl border-2 border-gray-100" />
                                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${student.status === 'Online' ? 'bg-green-500' : student.status === 'Brushing' ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-black text-gray-900 text-sm truncate">{student.name}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[9px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">Lvl {student.level}</span>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                                        <span className="text-[9px] font-black text-gray-400">{student.stars}</span>
                                    </div>
                                    <span className={`text-[9px] font-black uppercase ${student.health >= 80 ? 'text-emerald-500' : student.health >= 50 ? 'text-orange-500' : 'text-red-500'}`}>{student.health}% HP</span>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-200 flex-shrink-0" />
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Teacher Tip */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] shadow-2xl">
                <div className="rounded-[calc(2.5rem-2px)] bg-white/10 backdrop-blur-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/20 flex items-center justify-between bg-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                                <Bot className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h4 className="text-white font-black text-sm uppercase tracking-wider">AI Class Guidance</h4>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-white/60 text-[10px] font-bold uppercase tracking-tight">Active Analysis</span>
                                </div>
                            </div>
                        </div>
                        <Sparkles className="w-5 h-5 text-blue-200 animate-pulse" />
                    </div>
                    <div className="p-5">
                        <div className="bg-white/10 rounded-2xl border border-white/10 p-4 shadow-inner mb-4">
                            <p className={`text-sm text-white font-medium leading-relaxed transition-opacity duration-300 ${isAnimatingTip ? 'opacity-0' : 'opacity-100'}`}>{currentTip}</p>
                        </div>
                        <button onClick={getNewTip} disabled={isAnimatingTip} className="w-full py-2.5 bg-white/20 hover:bg-white/30 text-white font-black rounded-xl text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                            <Wand2 className="w-3.5 h-3.5" /> Next Insight
                        </button>
                    </div>
                </div>
            </div>

            {/* Academy Tools */}
            <div>
                <h3 className="font-black text-gray-400 tracking-widest uppercase text-[10px] mb-4 px-1">Academy Tools</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-[2rem] p-5 shadow-xl border border-gray-100 flex flex-col items-center gap-2 cursor-pointer hover:shadow-2xl transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                            <ClipboardList className="w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest text-center">Brush Check</p>
                    </div>
                    <div className="bg-white rounded-[2rem] p-5 shadow-xl border border-gray-100 flex flex-col items-center gap-2 cursor-pointer hover:shadow-2xl transition-shadow">
                        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-amber-600" />
                        </div>
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest text-center">Leaderboard</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── ANALYTICS TAB ─────────────────────────────────────────────────
function TeacherAnalyticsTab({ userData }: any) {
    const avgHealth = 86;
    const weekData = [72, 80, 75, 88, 91, 84, avgHealth];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-black text-gray-400 tracking-widest uppercase text-[10px] mb-4 px-1">Class Health Trend</h3>
                <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-gray-100">
                    <div className="flex items-end justify-around h-40 gap-2 mb-3">
                        {weekData.map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(h / 100) * 100}%` }}
                                    transition={{ delay: i * 0.1, duration: 0.6 }}
                                    className={`w-full rounded-xl ${i === weekData.length - 1 ? 'bg-gradient-to-t from-blue-600 to-blue-400' : 'bg-gradient-to-t from-blue-200 to-blue-100'}`}
                                />
                                <span className="text-[8px] font-bold text-gray-400">W{i + 1}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-[10px] font-black text-blue-600 uppercase tracking-widest">7-Week Class Average</p>
                </div>
            </div>

            <div>
                <h3 className="font-black text-gray-400 tracking-widest uppercase text-[10px] mb-4 px-1">Class Achievements</h3>
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                    {[
                        { icon: '🦷', title: '154 Sugar Bugs defeated this week', done: true },
                        { icon: '🔥', title: 'Class streak: 5 days running', done: true },
                        { icon: '⭐', title: '12,000 collective stars earned', done: true },
                        { icon: '🏆', title: '90% class brushing compliance', done: avgHealth >= 90 },
                    ].map((a) => (
                        <div key={a.title} className="p-4 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${a.done ? 'bg-blue-100' : 'bg-gray-100 grayscale opacity-50'}`}>{a.icon}</div>
                            <p className="flex-1 font-bold text-gray-900 text-sm">{a.title}</p>
                            {a.done && <Check className="w-5 h-5 text-emerald-500" strokeWidth={3} />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── STUDENTS TAB ──────────────────────────────────────────────────
function TeacherStudentsTab({ userData }: any) {
    const mockStudents = [
        { id: 1, name: userData.name || 'Hero', level: userData.level, stars: userData.totalStars, character: userData.selectedCharacter, status: 'Online', health: userData.enamelHealth },
        { id: 2, name: 'Alex Archer', level: 12, stars: 1450, character: '2', status: 'Brushing', health: 88 },
        { id: 3, name: 'Luna Light', level: 8, stars: 890, character: '3', status: 'Offline', health: 62 },
        { id: 4, name: 'Leo Lion', level: 15, stars: 2100, character: '1', status: 'Online', health: 95 },
        { id: 5, name: 'Mia Storm', level: 6, stars: 540, character: '2', status: 'Online', health: 71 },
        { id: 6, name: 'Kai Blaze', level: 11, stars: 1320, character: '3', status: 'Offline', health: 58 },
    ];

    return (
        <div className="space-y-6">
            <h3 className="font-black text-gray-400 tracking-widest uppercase text-[10px] px-1">All Heroes — Class Alpha</h3>
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                {mockStudents.map((student) => (
                    <div key={student.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="relative flex-shrink-0">
                            <UserAvatar characterId={student.character} showBackground={false} className="w-14 h-14 bg-blue-50 rounded-2xl border-2 border-gray-100" />
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${student.status === 'Online' ? 'bg-green-500' : student.status === 'Brushing' ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-black text-gray-900 text-sm">{student.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">Lvl {student.level}</span>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                                    <span className="text-[9px] font-black text-gray-400">{student.stars}</span>
                                </div>
                            </div>
                            {/* Mini health bar */}
                            <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden w-full">
                                <div className={`h-full rounded-full transition-all ${student.health >= 80 ? 'bg-emerald-500' : student.health >= 50 ? 'bg-orange-400' : 'bg-red-500'}`} style={{ width: `${student.health}%` }} />
                            </div>
                            <p className={`text-[8px] font-black uppercase tracking-widest mt-0.5 ${student.health >= 80 ? 'text-emerald-500' : student.health >= 50 ? 'text-orange-500' : 'text-red-500'}`}>{student.health}% Enamel Health</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-200 flex-shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────
export function TeacherDashboardScreen({ navigateTo, userData }: ScreenProps) {
    const { signOut } = useAuth();
    const [activeTab, setActiveTab] = useState<'home' | 'students' | 'analytics' | 'settings'>('home');

    const handleSignOut = async () => { await signOut(); navigateTo('signin'); };
    const handleSettings = () => navigateTo('settings');

    const avgHealth = 86;

    return (
        <div className="h-full bg-gradient-to-b from-blue-50 to-white flex flex-col overflow-hidden relative">

            {/* ── HEADER ── */}
            <div className="flex-none bg-gradient-to-br from-blue-500 to-blue-700 text-white px-5 pt-5 pb-6 z-50 shadow-xl border-b border-blue-400/30">
                <div className="flex justify-between items-center mb-5">
                    <button onClick={handleSignOut} className="p-2 -ml-2 rounded-xl hover:bg-white/20 transition-all">
                        <LogOut className="w-6 h-6" />
                    </button>
                    <h1 className="font-extrabold text-xl">Teacher Academy</h1>
                    <button onClick={handleSettings} className="relative p-2 -mr-2 hover:bg-white/20 rounded-xl transition-all">
                        <Settings className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Hero stat card */}
                <div className="bg-white rounded-[2rem] p-5 shadow-lg mb-2 relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                        {[...Array(3)].map((_, i) => (
                            <motion.div key={`bubble-t-${i}`} className="absolute rounded-full blur-3xl mix-blend-multiply"
                                style={{ background: ['#8BE9FD', '#A78BFA', '#60A5FA'][i % 3], opacity: 0.4, width: 160 + i * 30, height: 160 + i * 30, left: i === 0 ? '-10%' : i === 1 ? '40%' : '80%', top: i === 0 ? '-20%' : i === 1 ? '50%' : '-10%' }}
                                animate={{ x: [0, 60, 0, -60, 0], y: [0, -60, 0, 60, 0], scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                                transition={{ duration: 15 + i * 5, repeat: Infinity, ease: 'linear' }} />
                        ))}
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                        <motion.div
                            animate={{ rotate: [-3, -1, -3], boxShadow: ['0 8px 16px rgba(96,165,250,0.3)', '0 8px 24px rgba(96,165,250,0.6)', '0 8px 16px rgba(96,165,250,0.3)'] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 border-white"
                            style={{ background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)' }}>
                            <GraduationCap className="w-10 h-10 text-white drop-shadow-2xl" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between mb-2">
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5" style={{ color: '#1D4ED8' }}>Class King</p>
                                    <p className="text-4xl font-black leading-none tracking-tighter" style={{ color: '#1E293B' }}>Alpha</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5" style={{ color: '#1D4ED8' }}>Students</p>
                                    <p className="text-lg font-black" style={{ color: '#1D4ED8' }}>24</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 h-3.5 mb-1">
                                {Array.from({ length: 25 }).map((_, i) => {
                                    const isActive = i < Math.floor((avgHealth / 100) * 25);
                                    const colors = ['#60A5FA', '#22D3EE', '#A78BFA', '#F472B6', '#4ADE80'];
                                    const color = colors[Math.floor(i / 5)];
                                    return <motion.div key={i} initial={{ scaleY: 0 }} animate={{ scaleY: isActive ? 1 : 0.4, boxShadow: isActive ? `0 0 12px ${color}` : 'none', opacity: isActive ? 1 : 0.2 }} transition={{ delay: i * 0.005 }} className="flex-1 rounded-full h-full" style={{ backgroundColor: isActive ? color : 'rgba(10,31,31,0.4)' }} />;
                                })}
                            </div>
                            <p className="text-[10px] font-black mt-2 text-right uppercase tracking-widest" style={{ color: '#64748B' }}>Class Avg Health: {avgHealth}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── SCROLLABLE CONTENT ── */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-6">
                {activeTab === 'home' && <TeacherHomeTab userData={userData} />}
                {activeTab === 'students' && <TeacherStudentsTab userData={userData} />}
                {activeTab === 'analytics' && <TeacherAnalyticsTab userData={userData} />}
                <div className="pb-24" />
            </div>

            {/* ── BOTTOM NAV ── */}
            <div className="fixed bottom-0 left-0 right-0 p-4 z-20 pointer-events-none">
                <div className="max-w-md mx-auto pointer-events-auto">
                    <div className="glass-card border-t border-white/20 px-5 py-4 flex justify-around items-center rounded-[2.5rem] shadow-[0_-8px_32px_rgba(0,0,0,0.1)]">
                        {[
                            { id: 'home', icon: Home, label: 'Home' },
                            { id: 'students', icon: Users, label: 'Students' },
                            { id: 'analytics', icon: BarChart2, label: 'Analytics' },
                        ].map(({ id, icon: Icon, label }) => (
                            <button key={id} onClick={() => setActiveTab(id as any)} className="flex flex-col items-center gap-1 group">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === id ? 'bg-blue-600 shadow-lg' : 'hover:bg-blue-50'}`}>
                                    <Icon className={`w-6 h-6 transition-colors ${activeTab === id ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'}`} />
                                </div>
                                <span className={`text-xs font-bold tracking-tight ${activeTab === id ? 'text-blue-600' : 'text-gray-400'}`}>{label}</span>
                            </button>
                        ))}
                        <button onClick={handleSettings} className="flex flex-col items-center gap-1 group">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-blue-50 transition-all">
                                <Settings className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                            </div>
                            <span className="text-xs font-bold text-gray-400 tracking-tight">Settings</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
