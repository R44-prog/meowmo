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
        <nav className="fixed bottom-6 left-6 right-6 glass rounded-2xl px-6 py-3 pb-safe z-40 flex justify-between items-center text-xs font-medium text-accent/60 shadow-2xl">
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
                                ? "text-amber scale-110"
                                : "hover:text-accent hover:scale-105"
                        )}
                    >
                        {item.icon}
                        <span className={cn("text-[10px]", isActive && "font-bold text-amber")}>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
};
