import React, { useState } from 'react';
import {
    LayoutGrid,
    FolderOpen,
    Users,
    Trash2,
    Menu,
    ChevronDown,
    Search,
    Bell
} from 'lucide-react';

interface AppLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, title = 'Mis archivos' }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { icon: LayoutGrid, label: 'Inicio', active: false },
        { icon: FolderOpen, label: 'Mis archivos', active: true },
        { icon: Users, label: 'Compartidos', active: false },
        { icon: Trash2, label: 'Papelera', active: false },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <span className="text-xl font-bold text-blue-600">IMA Cloud</span>
                </div>

                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            className={`
                w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${item.active
                                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }
              `}
                        >
                            <item.icon className={`w-5 h-5 mr-3 ${item.active ? 'text-blue-600' : 'text-gray-400'}`} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-blue-700">Almacenamiento</span>
                            <span className="text-xs text-blue-600">75%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-1.5">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-xs text-blue-600 mt-2">7.5 GB de 10 GB usados</p>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Navbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
                    <div className="flex items-center">
                        <button
                            className="lg:hidden mr-4 p-2 text-gray-500 hover:bg-gray-100 rounded-md"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
                            <Search className="w-4 h-4 text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Buscar archivos..."
                                className="bg-transparent border-none focus:outline-none text-sm text-gray-700 w-full"
                            />
                        </div>

                        <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center pl-4 border-l border-gray-200">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm mr-2">
                                YA
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};
