import React from 'react';
import { Home, BarChart2, User, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const BottomNav: React.FC = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { path: '/', label: 'Home', icon: <Home className="w-6 h-6" /> },
        { path: '/insights', label: 'Insights', icon: <BarChart2 className="w-6 h-6" /> },
        { path: '/profile', label: 'Profile', icon: <User className="w-6 h-6" /> },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-orange-50/90 backdrop-blur-xl border-t border-orange-100 px-6 py-2 pb-safe z-40 flex justify-between items-center text-xs font-medium text-accent/60 shadow-lg shadow-orange-500/5">
            {navItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        aria-label={`Navigate to ${item.label}`}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                            "flex flex-col items-center gap-1 p-2 transition-all duration-300",
                            isActive
                                ? "text-orange-600 scale-110"
                                : "hover:text-orange-400 hover:scale-105"
                        )}
                    >
                        {item.icon}
                        <span className={cn("text-[10px]", isActive && "font-bold")}>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
};
