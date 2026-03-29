/** @jsxImportSource react */
import React, { useState } from 'react';

interface TabMetadata {
  id: string;
  label: string;
  icon: string;
  content: React.ReactNode; // Content is now back in the object but as a React node
}

export default function EnvTabs({ tabs }: { tabs: TabMetadata[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="mt-8">
      {/* Tab Navigation */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'border-indigo-500 bg-indigo-50/50 text-indigo-600'
                : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Logic - Pure React way */}
      <div className="animate-in fade-in slide-in-from-bottom-2 transition-all duration-300">
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  );
}
