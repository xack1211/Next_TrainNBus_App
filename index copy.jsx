import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Bus, 
  Train, 
  CloudRain, 
  Sun, 
  Clock, 
  Settings, 
  Plus, 
  Trash2, 
  Folder, 
  ChevronRight, 
  MapPin, 
  Bell, 
  Search, 
  X,
  RefreshCw,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowRight,
  Moon // Added missing import
} from 'lucide-react';

// --- Constants & Dictionaries ---

// MTR Station Dictionary (Based on MTR_Dict.pdf)
const MTR_LINES = {
  'TWL': { name: 'Tsuen Wan Line', color: 'bg-red-600', stations: [
    { code: 'CEN', name: 'Central' }, { code: 'ADM', name: 'Admiralty' }, { code: 'TST', name: 'Tsim Sha Tsui' },
    { code: 'JOR', name: 'Jordan' }, { code: 'YMT', name: 'Yau Ma Tei' }, { code: 'MOK', name: 'Mong Kok' },
    { code: 'PRE', name: 'Prince Edward' }, { code: 'SSP', name: 'Sham Shui Po' }, { code: 'CSW', name: 'Cheung Sha Wan' },
    { code: 'LCK', name: 'Lai Chi Kok' }, { code: 'MEF', name: 'Mei Foo' }, { code: 'LAK', name: 'Lai King' },
    { code: 'KWF', name: 'Kwai Fong' }, { code: 'KWH', name: 'Kwai Hing' }, { code: 'TWH', name: 'Tai Wo Hau' },
    { code: 'TSW', name: 'Tsuen Wan' }
  ]},
  'ISL': { name: 'Island Line', color: 'bg-blue-600', stations: [
    { code: 'KET', name: 'Kennedy Town' }, { code: 'HKU', name: 'HKU' }, { code: 'SYP', name: 'Sai Ying Pun' },
    { code: 'SHW', name: 'Sheung Wan' }, { code: 'CEN', name: 'Central' }, { code: 'ADM', name: 'Admiralty' },
    { code: 'WAC', name: 'Wan Chai' }, { code: 'CAB', name: 'Causeway Bay' }, { code: 'TIH', name: 'Tin Hau' },
    { code: 'FOH', name: 'Fortress Hill' }, { code: 'NOP', name: 'North Point' }, { code: 'QUB', name: 'Quarry Bay' },
    { code: 'TAK', name: 'Tai Koo' }, { code: 'SWH', name: 'Sai Wan Ho' }, { code: 'SKW', name: 'Shau Kei Wan' },
    { code: 'HFC', name: 'Heng Fa Chuen' }, { code: 'CHW', name: 'Chai Wan' }
  ]},
  'KTL': { name: 'Kwun Tong Line', color: 'bg-green-500', stations: [
    { code: 'WHA', name: 'Whampoa' }, { code: 'HOM', name: 'Ho Man Tin' }, { code: 'YMT', name: 'Yau Ma Tei' },
    { code: 'MOK', name: 'Mong Kok' }, { code: 'PRE', name: 'Prince Edward' }, { code: 'SKM', name: 'Shek Kip Mei' },
    { code: 'KOT', name: 'Kowloon Tong' }, { code: 'LOF', name: 'Lok Fu' }, { code: 'WTS', name: 'Wong Tai Sin' },
    { code: 'DIH', name: 'Diamond Hill' }, { code: 'CHH', name: 'Choi Hung' }, { code: 'KOB', name: 'Kowloon Bay' },
    { code: 'NTK', name: 'Ngau Tau Kok' }, { code: 'KWT', name: 'Kwun Tong' }, { code: 'LAT', name: 'Lam Tin' },
    { code: 'YAT', name: 'Yau Tong' }, { code: 'TIK', name: 'Tiu Keng Leng' }
  ]},
  'TKL': { name: 'Tseung Kwan O Line', color: 'bg-purple-500', stations: [
    { code: 'NOP', name: 'North Point' }, { code: 'QUB', name: 'Quarry Bay' }, { code: 'YAT', name: 'Yau Tong' },
    { code: 'TIK', name: 'Tiu Keng Leng' }, { code: 'TKO', name: 'Tseung Kwan O' }, { code: 'LHP', name: 'LOHAS Park' },
    { code: 'HAH', name: 'Hang Hau' }, { code: 'POA', name: 'Po Lam' }
  ]},
  'EAL': { name: 'East Rail Line', color: 'bg-cyan-400', stations: [
    { code: 'ADM', name: 'Admiralty' }, { code: 'EXC', name: 'Exhibition Centre' }, { code: 'HUH', name: 'Hung Hom' },
    { code: 'MKK', name: 'Mong Kok East' }, { code: 'KOT', name: 'Kowloon Tong' }, { code: 'TAW', name: 'Tai Wai' },
    { code: 'SHT', name: 'Sha Tin' }, { code: 'FOT', name: 'Fo Tan' }, { code: 'RAC', name: 'Racecourse' },
    { code: 'UNI', name: 'University' }, { code: 'TAP', name: 'Tai Po Market' }, { code: 'TWO', name: 'Tai Wo' },
    { code: 'FAN', name: 'Fanling' }, { code: 'SHS', name: 'Sheung Shui' }, { code: 'LOW', name: 'Lo Wu' },
    { code: 'LMC', name: 'Lok Ma Chau' }
  ]},
  'TML': { name: 'Tuen Ma Line', color: 'bg-amber-700', stations: [
    { code: 'WKS', name: 'Wu Kai Sha' }, { code: 'MOS', name: 'Ma On Shan' }, { code: 'HEO', name: 'Heng On' },
    { code: 'TSH', name: 'Tai Shui Hang' }, { code: 'SHM', name: 'Shek Mun' }, { code: 'CIO', name: 'City One' },
    { code: 'STW', name: 'Sha Tin Wai' }, { code: 'CKT', name: 'Che Kung Temple' }, { code: 'TAW', name: 'Tai Wai' },
    { code: 'HIK', name: 'Hin Keng' }, { code: 'DIH', name: 'Diamond Hill' }, { code: 'KAT', name: 'Kai Tak' },
    { code: 'SUW', name: 'Sung Wong Toi' }, { code: 'TKW', name: 'To Kwa Wan' }, { code: 'HOM', name: 'Ho Man Tin' },
    { code: 'HUH', name: 'Hung Hom' }, { code: 'ETS', name: 'East Tsim Sha Tsui' }, { code: 'AUS', name: 'Austin' },
    { code: 'NAC', name: 'Nam Cheong' }, { code: 'MEF', name: 'Mei Foo' }, { code: 'TWW', name: 'Tsuen Wan West' },
    { code: 'KSR', name: 'Kam Sheung Road' }, { code: 'YUL', name: 'Yuen Long' }, { code: 'LOP', name: 'Long Ping' },
    { code: 'TIS', name: 'Tin Shui Wai' }, { code: 'SIH', name: 'Siu Hong' }, { code: 'TUM', name: 'Tuen Mun' }
  ]},
  'TCL': { name: 'Tung Chung Line', color: 'bg-orange-400', stations: [
     { code: 'HOK', name: 'Hong Kong' }, { code: 'KOW', name: 'Kowloon' }, { code: 'OLY', name: 'Olympic' },
     { code: 'NAC', name: 'Nam Cheong' }, { code: 'LAK', name: 'Lai King' }, { code: 'TSY', name: 'Tsing Yi' },
     { code: 'SUN', name: 'Sunny Bay' }, { code: 'TUC', name: 'Tung Chung' }
  ]},
  'AEL': { name: 'Airport Express', color: 'bg-teal-600', stations: [
     { code: 'HOK', name: 'Hong Kong' }, { code: 'KOW', name: 'Kowloon' }, { code: 'TSY', name: 'Tsing Yi' },
     { code: 'AIR', name: 'Airport' }, { code: 'AWE', name: 'AsiaWorld Expo' }
  ]},
   'SIL': { name: 'South Island Line', color: 'bg-lime-400', stations: [
     { code: 'ADM', name: 'Admiralty' }, { code: 'OCP', name: 'Ocean Park' }, { code: 'WCH', name: 'Wong Chuk Hang' },
     { code: 'LET', name: 'Lei Tung' }, { code: 'SOH', name: 'South Horizons' }
  ]},
};

const WEATHER_CODES = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Fog',
  48: 'Depositing rime fog', 51: 'Drizzle: Light', 53: 'Drizzle: Moderate', 55: 'Drizzle: Dense',
  61: 'Rain: Slight', 63: 'Rain: Moderate', 65: 'Rain: Heavy', 80: 'Rain showers: Slight',
  81: 'Rain showers: Moderate', 82: 'Rain showers: Violent', 95: 'Thunderstorm: Slight',
  96: 'Thunderstorm: Slight hail', 99: 'Thunderstorm: Heavy hail',
};

// --- API Helpers ---

const fetchKMBRoutes = async () => {
  try {
    const response = await fetch('https://data.etabus.gov.hk/v1/transport/kmb/route/');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch KMB routes", error);
    return [];
  }
};

const fetchKMBRouteStops = async (route, direction, serviceType = 1) => {
  try {
    // 1. Get Stop IDs for the route
    const res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-stop/${route}/${direction}/${serviceType}`);
    const data = await res.json();
    const stops = data.data;

    // 2. We need names for these stops. This is N+1 but necessary if we don't have a huge cache.
    // Optimization: Fetch details only for the displayed list.
    const enrichedStops = await Promise.all(stops.map(async (s) => {
      try {
        const stopRes = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/stop/${s.stop}`);
        const stopData = await stopRes.json();
        return { ...s, name_en: stopData.data.name_en, name_tc: stopData.data.name_tc };
      } catch (e) {
        return { ...s, name_en: 'Unknown Stop', name_tc: '未知' };
      }
    }));
    return enrichedStops;
  } catch (error) {
    console.error("Failed to fetch stops", error);
    return [];
  }
};

const fetchKMBETA = async (stopId, route, serviceType = 1) => {
  try {
    const res = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/eta/${stopId}/${route}/${serviceType}`);
    const data = await res.json();
    // Filter for the correct route in case multiple exist, and sort by time
    const etas = data.data
      .filter(item => item.route === route && item.dir && item.eta)
      .map(item => {
        const diff = (new Date(item.eta) - new Date()) / 60000;
        return Math.max(0, Math.floor(diff));
      })
      .slice(0, 3); // Take next 3
    return etas;
  } catch (error) {
    console.error("KMB ETA Error", error);
    return [];
  }
};

const fetchMTRETA = async (line, station) => {
  try {
    const res = await fetch(`https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${line}&sta=${station}`);
    const data = await res.json();
    if (data.status === 0) return { up: [], down: [] };
    
    const key = `${line}-${station}`;
    if (!data.data[key]) return { up: [], down: [] };

    const process = (arr) => arr ? arr.map(t => {
      const diff = (new Date(t.time) - new Date()) / 60000;
      return { time: Math.max(0, Math.floor(diff)), dest: t.dest };
    }) : [];

    return {
      up: process(data.data[key].UP),
      down: process(data.data[key].DOWN)
    };
  } catch (error) {
    console.error("MTR ETA Error", error);
    return { up: [], down: [] };
  }
};

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-500/20',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 active:scale-95',
    danger: 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 active:scale-95',
    ghost: 'hover:bg-gray-100 text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800',
    icon: 'p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
  };

  return (
    <button 
      onClick={onClick} 
      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.99]' : ''} ${className}`}
  >
    {children}
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-950 w-full max-w-md rounded-3xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 transition-colors">
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <div className="overflow-y-auto custom-scrollbar flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [allKmbRoutes, setAllKmbRoutes] = useState([]);
  
  // Data State
  const [folders, setFolders] = useState([
    { id: 1, name: 'Work Commute', icon: 'briefcase' },
    { id: 2, name: 'Weekend Hangout', icon: 'coffee' }
  ]);
  
  // Load initial stops from local storage if available, else mock empty
  const [savedStops, setSavedStops] = useState(() => {
    const saved = localStorage.getItem('hk_commute_stops');
    return saved ? JSON.parse(saved) : [];
  });

  const [reminders, setReminders] = useState([
    { id: 1, text: 'Top up Octopus card', completed: false },
    { id: 2, text: 'Bring umbrella', completed: true },
  ]);

  // UI State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // --- Effects ---

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
    fetchWeather();
    
    // Load KMB Route list on mount (cached in memory)
    fetchKMBRoutes().then(routes => {
       // Filter distinct routes to avoid dupes in list
       const uniqueRoutes = [...new Map(routes.map(item => [item.route, item])).values()];
       setAllKmbRoutes(uniqueRoutes);
    });

    // Auto-refresh ETAs every 60s
    const interval = setInterval(() => {
      setRefreshTrigger(p => p + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('hk_commute_stops', JSON.stringify(savedStops));
  }, [savedStops]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // --- Actions ---

  const fetchWeather = async () => {
    setLoadingWeather(true);
    try {
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=22.3193&longitude=114.1694&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia%2FHong_Kong');
      const data = await res.json();
      setWeather(data.current);
    } catch (e) {
      console.error("Weather fetch failed", e);
    } finally {
      setLoadingWeather(false);
    }
  };

  const addFolder = (name) => {
    setFolders([...folders, { id: Date.now(), name, icon: 'folder' }]);
    setIsFolderModalOpen(false);
  };

  const addStop = (stopData) => {
    const newStop = {
      id: Date.now(),
      folderId: selectedFolderId || folders[0].id,
      eta: [], // Will be fetched
      lastUpdated: null,
      ...stopData
    };
    setSavedStops(prev => [...prev, newStop]);
    setIsAddModalOpen(false);
    setSearchQuery('');
    setRefreshTrigger(prev => prev + 1); // Trigger fetch immediately
  };

  const deleteStop = (id) => {
    setSavedStops(savedStops.filter(s => s.id !== id));
  };

  const toggleReminder = (id) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const addReminder = (text) => {
    if (!text.trim()) return;
    setReminders([...reminders, { id: Date.now(), text, completed: false }]);
  };

  // --- Live Data Hook ---

  // Fetches ETA for all visible stops when refreshTrigger changes
  const [etas, setEtas] = useState({}); // { stopId: [1, 5, 9] }

  useEffect(() => {
    const updateEtas = async () => {
      const newEtas = { ...etas };
      
      await Promise.all(savedStops.map(async (stop) => {
        if (stop.type === 'bus') {
          const times = await fetchKMBETA(stop.stopId, stop.route);
          newEtas[stop.id] = times.length > 0 ? times : ['-'];
        } else if (stop.type === 'mtr') {
          const data = await fetchMTRETA(stop.line, stop.station);
          // MTR API gives UP and DOWN. We need to decide which one to show? 
          // For simplicity in this dashboard, we show both or just the next closest trains regardless of direction if user didn't specify (simpler for MTR)
          // Ideally user selects direction. 
          // Let's combine and sort.
          const allTrains = [...data.up.map(t=>({...t, dir:'UP'})), ...data.down.map(t=>({...t, dir:'DOWN'}))]
            .sort((a,b) => a.time - b.time);
          
          if (allTrains.length > 0) {
             newEtas[stop.id] = allTrains.slice(0, 3).map(t => ({ time: t.time, dest: t.dest }));
          } else {
             newEtas[stop.id] = [];
          }
        }
      }));
      setEtas(newEtas);
    };
    if (savedStops.length > 0) updateEtas();
  }, [savedStops, refreshTrigger]);

  // --- Views ---

  const HomeView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Weather Widget */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-900 dark:to-purple-900 rounded-3xl p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <CloudRain size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-1">Hello</h1>
              <p className="text-indigo-100">HK Commuter</p>
            </div>
            <button onClick={fetchWeather} className={`p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all ${loadingWeather ? 'animate-spin' : ''}`}>
              <RefreshCw size={18} />
            </button>
          </div>
          
          <div className="mt-8 flex items-end gap-4">
            <div>
              <span className="text-5xl font-bold tracking-tighter">
                {weather ? `${Math.round(weather.temperature_2m)}°` : '--'}
              </span>
              <span className="text-xl opacity-80">HKT</span>
            </div>
            <div className="mb-2 opacity-90 text-sm font-medium">
              {weather ? WEATHER_CODES[weather.weather_code] || 'Unknown' : 'Loading...'}
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                Humidity: {weather ? `${weather.relative_humidity_2m}%` : '--'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View (Top stop) */}
      <div>
        <div className="flex justify-between items-center mb-3 px-1">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Next Up</h2>
        </div>
        {savedStops.length > 0 ? (
          <StopCard stop={savedStops[0]} etaData={etas[savedStops[0].id]} minimal />
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm">No stops saved yet.</p>
            <Button variant="ghost" onClick={() => setActiveTab('transport')} className="mt-2 text-indigo-600">
              Add a trip
            </Button>
          </div>
        )}
      </div>
      
      {/* Reminders */}
      <div>
         <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3 px-1">Reminders</h2>
         <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            {reminders.slice(0,3).map(r => (
               <div key={r.id} className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <div className={`w-2 h-2 rounded-full ${r.completed ? 'bg-green-400' : 'bg-orange-400'}`} />
                  <span className={`text-sm ${r.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>{r.text}</span>
               </div>
            ))}
            {reminders.length === 0 && <span className="text-sm text-gray-400">No tasks.</span>}
         </div>
      </div>
    </div>
  );

  const TransportView = () => {
    const filteredStops = selectedFolderId 
      ? savedStops.filter(s => s.folderId === selectedFolderId)
      : savedStops;

    const activeFolder = folders.find(f => f.id === selectedFolderId);

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between sticky top-0 bg-gray-50/90 dark:bg-black/90 backdrop-blur-md py-2 z-20">
          <div className="flex items-center gap-2">
            {selectedFolderId && (
              <button onClick={() => setSelectedFolderId(null)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full">
                <X size={18} className="text-gray-500" />
              </button>
            )}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedFolderId ? activeFolder.name : 'My Routes'}
            </h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setRefreshTrigger(p=>p+1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
              <RefreshCw size={20} />
            </button>
            <Button variant="secondary" className="!p-2 rounded-full" onClick={() => setIsFolderModalOpen(true)}>
              <Folder size={20} />
            </Button>
            <Button variant="primary" className="!p-2 rounded-full shadow-lg shadow-indigo-500/30" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={20} />
            </Button>
          </div>
        </div>

        {/* Folder Grid */}
        {!selectedFolderId && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {folders.map(folder => {
              const count = savedStops.filter(s => s.folderId === folder.id).length;
              return (
                <button 
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all text-left group"
                >
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 w-10 h-10 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
                    {folder.id === 1 ? <Bus size={20} /> : <MapPin size={20} />}
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">{folder.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{count} stops saved</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Stops List */}
        <div className="space-y-3 pb-24">
          {filteredStops.length > 0 ? (
            filteredStops.map(stop => (
              <StopCard 
                key={stop.id} 
                stop={stop} 
                etaData={etas[stop.id]} 
                onDelete={() => deleteStop(stop.id)} 
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Search size={24} />
              </div>
              <p className="text-gray-500">No stops in this view.</p>
              <Button variant="ghost" onClick={() => setIsAddModalOpen(true)} className="mt-2 text-indigo-600">
                Add your first stop
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const StopCard = ({ stop, onDelete, etaData, minimal = false }) => {
    const isBus = stop.type === 'bus';
    const primaryColor = isBus ? 'bg-amber-400' : MTR_LINES[stop.line]?.color || 'bg-gray-500';
    
    // Formatting ETA
    let displayEta = '--';
    let secondaryEta = null;
    let destName = stop.dest;

    if (etaData) {
       if (isBus) {
          if (Array.isArray(etaData) && etaData.length > 0) {
            displayEta = etaData[0];
            if (etaData[1]) secondaryEta = etaData[1];
          }
       } else {
          // MTR Logic: etaData is array of {time, dest}
          if (Array.isArray(etaData) && etaData.length > 0) {
            displayEta = etaData[0].time;
            destName = etaData[0].dest; // Update destination based on next train
            if (etaData[1]) secondaryEta = etaData[1].time;
          }
       }
    }

    return (
      <div className="group relative bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-4">
          {/* Icon / Route Badge */}
          <div className={`flex-shrink-0 w-14 h-14 ${isBus ? 'bg-gray-100 dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-800'} rounded-2xl flex flex-col items-center justify-center border border-gray-100 dark:border-gray-700 overflow-hidden`}>
            {isBus ? (
              <>
                <div className="w-full h-1/3 bg-amber-400 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-amber-900 uppercase">KMB</span>
                </div>
                <div className="flex-1 flex items-center justify-center font-bold text-xl text-gray-800 dark:text-white">
                  {stop.route}
                </div>
              </>
            ) : (
              <div className={`w-full h-full ${primaryColor} flex items-center justify-center text-white font-bold text-center leading-none p-1`}>
                <span className="text-xs">{stop.line}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-grow min-w-0">
            <div className="flex items-baseline justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg">
                To {destName}
              </h3>
              {/* ETA Display */}
              <div className="flex items-end gap-1 flex-shrink-0">
                <span className={`text-2xl font-bold tabular-nums ${displayEta === 0 ? 'text-green-500 animate-pulse' : 'text-indigo-600 dark:text-indigo-400'}`}>
                  {displayEta === 0 ? 'Now' : displayEta}
                </span>
                {displayEta !== 'Now' && displayEta !== '--' && <span className="text-xs font-medium text-gray-500 mb-1.5">min</span>}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {stop.stopName || stop.stationName}
              </p>
              {!minimal && secondaryEta !== null && (
                <span className="text-xs text-gray-400 font-medium">
                  Next: {secondaryEta} min
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Delete Action */}
        {!minimal && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    );
  };

  const SettingsView = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
      <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Appearance</h3>
                <p className="text-sm text-gray-500">Toggle dark mode</p>
              </div>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${darkMode ? 'translate-x-6' : ''}`} />
            </button>
          </div>
      </Card>
      <div className="px-2 text-xs text-gray-400">
        Data Sources:<br/>
        • KMB API (data.etabus.gov.hk)<br/>
        • MTR Open Data (rt.data.gov.hk)<br/>
        • Open-Meteo Weather
      </div>
    </div>
  );

  // --- Modals ---

  const AddStopModal = () => {
    const [step, setStep] = useState(1);
    const [searchType, setSearchType] = useState('bus');
    
    // KMB State
    const [filteredRoutes, setFilteredRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [selectedDirection, setSelectedDirection] = useState(null); // 'inbound' or 'outbound'
    const [routeStops, setRouteStops] = useState([]);
    const [loadingStops, setLoadingStops] = useState(false);

    // MTR State
    const [selectedLine, setSelectedLine] = useState(null);

    // Reset when modal opens/closes logic handled by parent effect mostly, but good to reset step
    useEffect(() => {
        if(!isAddModalOpen) {
            setStep(1);
            setSearchQuery('');
        }
    }, [isAddModalOpen]);

    // KMB Search Logic
    useEffect(() => {
      if (searchType === 'bus' && searchQuery) {
        setFilteredRoutes(
          allKmbRoutes
            .filter(r => r.route.startsWith(searchQuery.toUpperCase()))
            .slice(0, 20)
        );
      } else {
        setFilteredRoutes([]);
      }
    }, [searchQuery, searchType, allKmbRoutes]);

    const handleRouteClick = (route) => {
      setSelectedRoute(route);
      setStep(2); // Choose direction
    };

    const handleDirectionSelect = async (dir) => {
        setSelectedDirection(dir);
        setLoadingStops(true);
        setStep(3); // Choose stop
        const stops = await fetchKMBRouteStops(selectedRoute.route, dir);
        setRouteStops(stops);
        setLoadingStops(false);
    };

    const handleMtrLineSelect = (lineKey) => {
        setSelectedLine(lineKey);
        setStep(2); // Choose station
    };

    const finalizeBusStop = (stop) => {
        addStop({
            type: 'bus',
            route: selectedRoute.route,
            stopId: stop.stop, // KMB API uses 'stop' as ID
            stopName: stop.name_en,
            dest: selectedDirection === 'outbound' ? selectedRoute.dest_en : selectedRoute.orig_en
        });
    };

    const finalizeMtrStation = (station) => {
        addStop({
            type: 'mtr',
            line: selectedLine,
            station: station.code,
            stationName: station.name,
            dest: 'Platform' // Generic dest until loaded
        });
    };

    return (
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Transport">
        {/* Toggle Type */}
        {step === 1 && (
            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-4">
              <button 
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${searchType === 'bus' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}`}
                onClick={() => setSearchType('bus')}
              >
                Bus (KMB)
              </button>
              <button 
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${searchType === 'mtr' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}`}
                onClick={() => setSearchType('mtr')}
              >
                MTR
              </button>
            </div>
        )}

        {/* --- BUS FLOW --- */}
        {searchType === 'bus' && step === 1 && (
          <div className="space-y-4">
             <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Route number (e.g. 104)"
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredRoutes.map((r, i) => (
                    <button key={i} onClick={() => handleRouteClick(r)} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl">
                        <span className="font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">{r.route}</span>
                        <span className="text-xs text-gray-500 truncate ml-2">to {r.dest_en}</span>
                    </button>
                ))}
                {searchQuery && filteredRoutes.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No routes found.</p>}
            </div>
          </div>
        )}

        {searchType === 'bus' && step === 2 && selectedRoute && (
             <div className="space-y-3">
                 <p className="text-sm text-gray-500">Select Direction</p>
                 <button onClick={() => handleDirectionSelect('outbound')} className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl text-left hover:border-indigo-500 transition-colors">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Outbound</div>
                    <div className="font-bold text-lg dark:text-white">To {selectedRoute.dest_en}</div>
                 </button>
                 <button onClick={() => handleDirectionSelect('inbound')} className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl text-left hover:border-indigo-500 transition-colors">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Inbound</div>
                    <div className="font-bold text-lg dark:text-white">To {selectedRoute.orig_en}</div>
                 </button>
                 <Button variant="ghost" onClick={() => setStep(1)} className="w-full">Back</Button>
             </div>
        )}

        {searchType === 'bus' && step === 3 && (
            <div className="space-y-4">
                 <p className="text-sm text-gray-500">Select Stop</p>
                 {loadingStops ? (
                     <div className="flex justify-center py-8"><RefreshCw className="animate-spin text-indigo-500"/></div>
                 ) : (
                     <div className="space-y-2 max-h-64 overflow-y-auto">
                         {routeStops.map((stop, i) => (
                             <button key={i} onClick={() => finalizeBusStop(stop)} className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl border-b border-gray-100 dark:border-gray-800 last:border-0">
                                 <div className="flex items-start gap-3">
                                     <div className="text-xs font-mono text-gray-400 mt-1">{i+1}</div>
                                     <div>
                                         <div className="font-medium dark:text-white">{stop.name_en}</div>
                                         <div className="text-xs text-gray-500">{stop.name_tc}</div>
                                     </div>
                                 </div>
                             </button>
                         ))}
                     </div>
                 )}
                 <Button variant="ghost" onClick={() => setStep(2)} className="w-full">Back</Button>
            </div>
        )}

        {/* --- MTR FLOW --- */}
        {searchType === 'mtr' && step === 1 && (
            <div className="grid grid-cols-2 gap-2">
                {Object.entries(MTR_LINES).map(([code, line]) => (
                    <button key={code} onClick={() => handleMtrLineSelect(code)} className={`p-3 rounded-xl text-white font-medium text-sm text-left ${line.color} shadow-sm hover:opacity-90`}>
                        {line.name}
                    </button>
                ))}
            </div>
        )}

        {searchType === 'mtr' && step === 2 && selectedLine && (
            <div className="space-y-4">
                <div className={`p-3 rounded-xl text-white font-bold ${MTR_LINES[selectedLine].color}`}>
                    {MTR_LINES[selectedLine].name}
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {MTR_LINES[selectedLine].stations.map(station => (
                        <button key={station.code} onClick={() => finalizeMtrStation(station)} className="w-full p-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                             <span className="dark:text-white font-medium">{station.name}</span>
                             <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">{station.code}</span>
                        </button>
                    ))}
                </div>
                 <Button variant="ghost" onClick={() => setStep(1)} className="w-full">Back</Button>
            </div>
        )}

      </Modal>
    );
  };

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'dark bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-md mx-auto min-h-screen relative shadow-2xl overflow-hidden bg-white dark:bg-black">
        
        {/* Top Content Area */}
        <div className="h-full overflow-y-auto pb-24 custom-scrollbar">
          <div className="p-5 pt-8">
            {activeTab === 'home' && <HomeView />}
            {activeTab === 'transport' && <TransportView />}
            {activeTab === 'settings' && <SettingsView />}
            
            {activeTab === 'reminders' && (
              <div className="space-y-4 animate-in fade-in">
                <h2 className="text-2xl font-bold mb-4">Reminders</h2>
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    id="newReminder"
                    placeholder="Add new task..." 
                    className="flex-1 bg-gray-100 dark:bg-gray-900 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 border-none"
                    onKeyDown={(e) => {
                      if(e.key === 'Enter') {
                        addReminder(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <Button variant="primary" onClick={() => {
                    const el = document.getElementById('newReminder');
                    addReminder(el.value);
                    el.value = '';
                  }}>Add</Button>
                </div>
                <div className="space-y-2">
                  {reminders.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3">
                         <button onClick={() => toggleReminder(r.id)} className={r.completed ? 'text-green-500' : 'text-gray-300'}>
                           {r.completed ? <CheckCircle2 /> : <Circle />}
                         </button>
                         <span className={r.completed ? 'line-through text-gray-400' : ''}>{r.text}</span>
                      </div>
                      <button onClick={() => deleteReminder(r.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-between items-center z-40">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Sun size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />x
            <span className="text-[10px] font-medium">Home</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('transport')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'transport' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Bus size={24} strokeWidth={activeTab === 'transport' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Trips</span>
          </button>

          <div className="w-12 h-12 -mt-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-500/40 cursor-pointer hover:scale-105 transition-transform"
             onClick={() => setIsAddModalOpen(true)}
          >
             <Plus size={28} />
          </div>

          <button 
            onClick={() => setActiveTab('reminders')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'reminders' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <CheckCircle2 size={24} strokeWidth={activeTab === 'reminders' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Tasks</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Settings size={24} strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Setup</span>
          </button>
        </div>

        {/* Modals */}
        <AddStopModal />
        
        <Modal isOpen={isFolderModalOpen} onClose={() => setIsFolderModalOpen(false)} title="New Folder">
           <div className="space-y-4">
              <input type="text" id="folderName" placeholder="e.g. Gym Routes" className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-indigo-500" />
              <Button className="w-full" onClick={() => addFolder(document.getElementById('folderName').value)}>Create Folder</Button>
           </div>
        </Modal>

      </div>
    </div>
  );
}