import { ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  icon: ReactNode;
}

interface TabLayoutProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: ReactNode;
}

export default function TabLayout({ tabs, activeTab, onTabChange, children }: TabLayoutProps) {
  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="flex gap-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
