import React, { useState, useEffect } from 'react';
import { ViewState, ScenarioData } from './types';
import { generateScenario, hasApiKey } from './services/geminiService';
import ScenarioView from './components/ScenarioView';
import RolePlayView from './components/RolePlayView';
import { Moon, Sun, Search, BookOpen } from './components/Icons';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [darkMode, setDarkMode] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  const [currentScenario, setCurrentScenario] = useState<ScenarioData | null>(null);
  const [loadingText, setLoadingText] = useState('Generating Scenario...');
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const handleSearch = async (topic: string = topicInput) => {
    if (!topic.trim()) return;
    if (!hasApiKey()) {
      alert("Please set the REACT_APP_GEMINI_API_KEY in your environment.");
      return;
    }

    setView(ViewState.LOADING);
    setLoadingText(`Building "${topic}" lesson...`);

    try {
      const data = await generateScenario(topic);
      if (data) {
        setCurrentScenario(data);
        setView(ViewState.SCENARIO);
        if (!history.includes(topic)) setHistory([topic, ...history].slice(0, 5));
      } else {
        alert("Could not generate scenario. Please try again.");
        setView(ViewState.HOME);
      }
    } catch (error) {
      console.error(error);
      alert("AI Service Error. Check console.");
      setView(ViewState.HOME);
    }
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.LOADING:
        return (
          <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{loadingText}</h2>
            <p className="text-slate-500">AI is crafting dialogues and vocabulary...</p>
          </div>
        );
      
      case ViewState.SCENARIO:
        return currentScenario ? (
          <ScenarioView 
            data={currentScenario} 
            onBack={() => setView(ViewState.HOME)} 
            onRolePlay={() => setView(ViewState.ROLEPLAY)}
          />
        ) : null;

      case ViewState.ROLEPLAY:
        return currentScenario ? (
          <RolePlayView 
            scenario={currentScenario} 
            onExit={() => setView(ViewState.SCENARIO)} 
          />
        ) : null;

      case ViewState.HOME:
      default:
        return (
          <div className="min-h-screen bg-surface dark:bg-darkSurface transition-colors">
            {/* Hero Section */}
            <div className="px-6 pt-12 pb-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="bg-primary text-white px-2 py-1 rounded-lg text-lg">LF</span>
                  LingoFlow
                </h1>
                <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300">
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>

              <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-100 leading-tight">
                What scenario do you want to practice?
              </h2>
              
              <div className="relative mt-6 shadow-xl rounded-2xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g., Ordering Coffee"
                />
                <button 
                  onClick={() => handleSearch()}
                  className="absolute right-2 top-2 bottom-2 bg-primary text-white px-4 rounded-xl font-bold text-sm"
                >
                  Go
                </button>
              </div>
            </div>

            {/* Suggestions / History */}
            <div className="px-6 pb-20">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Suggested Scenarios</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Hotel Check-in', 'Business Meeting', 'Asking Directions', 'Job Interview'].map(topic => (
                   <button 
                     key={topic}
                     onClick={() => handleSearch(topic)}
                     className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-left hover:border-primary transition-colors shadow-sm"
                   >
                      <span className="text-2xl mb-2 block">
                        {topic.includes('Hotel') ? '🏨' : topic.includes('Business') ? '💼' : topic.includes('Directions') ? '🗺️' : '🤝'}
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-200 block">{topic}</span>
                      <span className="text-xs text-slate-400 mt-1 block">Intermediate</span>
                   </button>
                ))}
              </div>

              {history.length > 0 && (
                <>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-8 mb-4">Recent</h3>
                  <div className="space-y-2">
                    {history.map((h, i) => (
                       <div key={i} onClick={() => handleSearch(h)} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg cursor-pointer">
                          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-primary">
                            <BookOpen size={16}/>
                          </div>
                          <span className="text-slate-700 dark:text-slate-300">{h}</span>
                       </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto bg-surface dark:bg-darkSurface min-h-screen shadow-2xl overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default App;