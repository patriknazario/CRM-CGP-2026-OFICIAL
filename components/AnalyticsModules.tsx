
import React, { useState, useMemo } from 'react';
import { VENDEDORAS_MOCK, CURSOS_MOCK, ESTADOS_BRASIL } from '../constants';
import { Trophy, TrendingUp, Download, MapPin, Award, BarChart, ChevronDown, Percent, DollarSign, Tag, ArrowUpRight, ArrowDownRight, ZoomIn, ZoomOut, Maximize, X, Layers, Activity } from 'lucide-react';

// --- TEAM PERFORMANCE ---
export const TeamPerformanceView: React.FC = () => {
  // Sort by sales - Memorized to prevent re-sorting on every render
  const sortedSellers = useMemo(() => [...VENDEDORAS_MOCK].sort((a, b) => b.vendasTotais - a.vendasTotais), []);
  const topSeller = sortedSellers[0];

  // Simulating advanced metrics deterministically (Stable Data)
  // We use useMemo so this only runs once, preventing React render loops caused by Math.random()
  const enhancedSellers = useMemo(() => {
    return sortedSellers.map(seller => {
        // Create a fake "seed" from the ID characters to act as a random number that doesn't change
        const seed = seller.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        // Use the seed to generate consistent metrics
        const baseConv = 12 + (seller.performance / 8); 
        const conversion = Math.min(baseConv + (seed % 15), 45); // 15-45%
        
        const ticket = 2500 + (seller.vendasTotais / 100) + (seed * 2); // R$ 3k-5k
        
        // Higher performance usually means better negotiation (lower discount), but we add variance
        const discount = Math.max(2, 15 - (seller.performance / 15) + (seed % 4)); 

        return {
            ...seller,
            conversionRate: conversion,
            avgTicket: ticket,
            avgDiscount: discount
        };
    });
  }, [sortedSellers]);

  // Find Highlights
  const bestConverter = useMemo(() => enhancedSellers.reduce((prev, curr) => prev.conversionRate > curr.conversionRate ? prev : curr), [enhancedSellers]);
  const bestTicket = useMemo(() => enhancedSellers.reduce((prev, curr) => prev.avgTicket > curr.avgTicket ? prev : curr), [enhancedSellers]);
  const bestNegotiator = useMemo(() => enhancedSellers.reduce((prev, curr) => prev.avgDiscount < curr.avgDiscount ? prev : curr), [enhancedSellers]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            Performance do Time 
            <span className="ml-3 px-2 py-0.5 bg-pink-100 text-pink-700 text-xs font-bold rounded-full uppercase tracking-wider">
              Live Metrics
            </span>
          </h2>
          <p className="text-slate-500">Diagnóstico tático e estratégico das 9 consultoras.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Meta Global Mensal</p>
          <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">R$ 960.000,00</p>
        </div>
      </div>

      {/* Podium Area */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full border-4 border-yellow-400 p-1">
                <img src={topSeller.avatar} alt={topSeller.nome} className="w-full h-full rounded-full bg-slate-700" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-slate-900 p-2 rounded-full shadow-lg">
                <Trophy className="w-5 h-5 fill-current" />
            </div>
            </div>
            <div className="text-center md:text-left">
            <div className="inline-block px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-bold mb-2">TOP PERFORMER</div>
            <h3 className="text-3xl font-bold">{topSeller.nome}</h3>
            <p className="text-slate-300">Superou a meta em <span className="text-green-400 font-bold">{(topSeller.performance - 100).toFixed(1)}%</span></p>
            </div>
            
            <div className="h-px w-full md:w-px md:h-16 bg-white/10 my-4 md:my-0"></div>

            <div className="flex gap-8 justify-center md:justify-start flex-1">
                <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Vendas Totais</p>
                <p className="text-2xl font-bold">R$ {topSeller.vendasTotais.toLocaleString()}</p>
                </div>
                <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Comissão Est.</p>
                <p className="text-2xl font-bold">R$ {(topSeller.vendasTotais * 0.02).toLocaleString()}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Strategic Highlights Cards */}
      <h3 className="text-lg font-bold text-slate-800 flex items-center">
         <Award className="w-5 h-5 mr-2 text-pink-500" /> Destaques do Mês
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Efficiency Card */}
         <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
               <TrendingUp className="w-6 h-6" />
            </div>
            <div className="flex-1">
               <p className="text-xs font-bold text-slate-400 uppercase">Maior Conversão</p>
               <p className="text-xl font-black text-slate-800">{bestConverter.conversionRate.toFixed(1)}%</p>
               <div className="flex items-center mt-1">
                  <img src={bestConverter.avatar} className="w-5 h-5 rounded-full mr-2" alt="" />
                  <span className="text-xs text-slate-600 font-medium">{bestConverter.nome}</span>
               </div>
            </div>
         </div>

         {/* Quality Card */}
         <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
               <DollarSign className="w-6 h-6" />
            </div>
            <div className="flex-1">
               <p className="text-xs font-bold text-slate-400 uppercase">Maior Ticket Médio</p>
               <p className="text-xl font-black text-slate-800">R$ {bestTicket.avgTicket.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
               <div className="flex items-center mt-1">
                  <img src={bestTicket.avatar} className="w-5 h-5 rounded-full mr-2" alt="" />
                  <span className="text-xs text-slate-600 font-medium">{bestTicket.nome}</span>
               </div>
            </div>
         </div>

         {/* Margin Card */}
         <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
               <Tag className="w-6 h-6" />
            </div>
            <div className="flex-1">
               <p className="text-xs font-bold text-slate-400 uppercase">Melhor Negociadora</p>
               <p className="text-xl font-black text-slate-800">{bestNegotiator.avgDiscount.toFixed(1)}% <span className="text-xs font-normal text-slate-400">(Desc. Médio)</span></p>
               <div className="flex items-center mt-1">
                  <img src={bestNegotiator.avatar} className="w-5 h-5 rounded-full mr-2" alt="" />
                  <span className="text-xs text-slate-600 font-medium">{bestNegotiator.nome}</span>
               </div>
            </div>
         </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-lg">Detalhamento Tático</h3>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                     <th className="px-6 py-4">Ranking</th>
                     <th className="px-6 py-4">Vendedora</th>
                     <th className="px-6 py-4">Faturamento</th>
                     <th className="px-6 py-4">Meta vs Real</th>
                     <th className="px-6 py-4">Conversão</th>
                     <th className="px-6 py-4">Ticket Médio</th>
                     <th className="px-6 py-4 text-right">Desc. Médio</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {enhancedSellers.map((seller, idx) => (
                     <tr key={seller.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                           <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx < 3 ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'}`}>
                              {idx + 1}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center">
                              <img src={seller.avatar} alt="" className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" />
                              <div className="ml-3">
                                 <p className="font-bold text-slate-800">{seller.nome}</p>
                                 <p className="text-xs text-slate-500">ID: {seller.id}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="font-bold text-slate-800 block">R$ {seller.vendasTotais.toLocaleString()}</span>
                           <span className="text-xs text-slate-400">Total Vendas</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-bold ${seller.performance >= 100 ? 'text-emerald-600' : 'text-amber-600'}`}>{seller.performance}%</span>
                              <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                 <div className={`h-full rounded-full ${seller.performance >= 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(seller.performance, 100)}%` }}></div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
                              <Percent className="w-3 h-3 text-slate-400" />
                              {seller.conversionRate.toFixed(1)}%
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="text-sm font-medium text-slate-700">
                              R$ {seller.avgTicket.toLocaleString(undefined, {maximumFractionDigits:0})}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${seller.avgDiscount > 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                              {seller.avgDiscount > 10 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                              {seller.avgDiscount.toFixed(1)}%
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

// --- KPI & COURSES ANALYSIS ---
export const KPIView: React.FC = () => {
  const sortedCourses = [...CURSOS_MOCK].sort((a, b) => b.faturamentoAtual - a.faturamentoAtual);
  const top5 = sortedCourses.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
       <h2 className="text-2xl font-bold text-slate-800">KPIs & Análise de Cursos</h2>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top 5 Courses Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Trophy className="w-32 h-32 text-yellow-500" />
             </div>
             <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                <span className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center mr-3">
                   <Award className="w-5 h-5" />
                </span>
                Top 5 Cursos (Faturamento)
             </h3>
             
             <div className="space-y-5">
                {top5.map((curso, idx) => (
                   <div key={curso.id} className="relative">
                      <div className="flex justify-between items-end mb-1 relative z-10">
                         <span className="font-medium text-slate-700 flex items-center">
                            <span className="text-xs font-bold text-slate-400 mr-2 w-4">0{idx + 1}</span>
                            {curso.tema}
                         </span>
                         <span className="font-bold text-slate-900">R$ {curso.faturamentoAtual.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                         <div 
                            className="bg-gradient-to-r from-pink-500 to-purple-600 h-2.5 rounded-full shadow-sm" 
                            style={{ width: `${(curso.faturamentoAtual / top5[0].faturamentoAtual) * 100}%` }}
                         ></div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Goal vs Reality */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                <span className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3">
                   <BarChart className="w-5 h-5" />
                </span>
                Meta vs Realizado (Por Curso)
             </h3>
             
             <div className="h-80 flex items-end justify-around gap-2 pb-4 border-b border-slate-200">
                {top5.slice(0,6).map((curso) => {
                   const percent = Math.min((curso.faturamentoAtual / curso.metaFaturamento) * 100, 100);
                   return (
                      <div key={curso.id} className="flex flex-col items-center w-1/6 group h-full justify-end">
                         <div className="text-xs font-bold text-slate-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {Math.round(percent)}%
                         </div>
                         <div className="w-full max-w-[40px] bg-slate-100 rounded-t-lg relative h-full flex items-end overflow-hidden">
                            <div className="w-full bg-indigo-500 transition-all duration-1000 ease-out hover:bg-pink-500" style={{ height: `${percent}%` }}></div>
                         </div>
                         <div className="mt-2 text-[10px] text-slate-500 font-medium truncate w-full text-center" title={curso.cidade}>
                            {curso.cidade}
                         </div>
                      </div>
                   );
                })}
             </div>
          </div>
       </div>
    </div>
  );
};

// --- MAP ANALYSIS ---
interface MapStateData {
  uf: string;
  region: string;
  x: number;
  y: number;
  count: number;
  value: number;
}

export const MapView: React.FC = () => {
  // Configurações do Mapa (Bubble Map)
  // Coordenadas aproximadas em uma escala 0-100
  const BRAZIL_COORDS: Record<string, {x: number, y: number, region: string}> = {
    "RR": {x: 35, y: 5, region: 'Norte'}, "AP": {x: 55, y: 7, region: 'Norte'}, "AM": {x: 20, y: 15, region: 'Norte'}, "PA": {x: 50, y: 15, region: 'Norte'}, 
    "MA": {x: 65, y: 15, region: 'Nordeste'}, "CE": {x: 80, y: 15, region: 'Nordeste'}, "RN": {x: 88, y: 18, region: 'Nordeste'}, "PB": {x: 90, y: 22, region: 'Nordeste'}, 
    "PE": {x: 88, y: 25, region: 'Nordeste'}, "AL": {x: 85, y: 28, region: 'Nordeste'}, "SE": {x: 82, y: 30, region: 'Nordeste'}, "AC": {x: 10, y: 30, region: 'Norte'}, 
    "RO": {x: 25, y: 35, region: 'Norte'}, "MT": {x: 35, y: 40, region: 'Centro-Oeste'}, "TO": {x: 55, y: 30, region: 'Norte'}, "PI": {x: 70, y: 22, region: 'Nordeste'}, 
    "BA": {x: 75, y: 40, region: 'Nordeste'}, "GO": {x: 50, y: 50, region: 'Centro-Oeste'}, "DF": {x: 53, y: 48, region: 'Centro-Oeste'}, "MG": {x: 65, y: 60, region: 'Sudeste'}, 
    "ES": {x: 78, y: 62, region: 'Sudeste'}, "MS": {x: 35, y: 65, region: 'Centro-Oeste'}, "SP": {x: 60, y: 75, region: 'Sudeste'}, "RJ": {x: 72, y: 72, region: 'Sudeste'}, 
    "PR": {x: 55, y: 82, region: 'Sul'}, "SC": {x: 58, y: 88, region: 'Sul'}, "RS": {x: 50, y: 95, region: 'Sul'}
  };

  const [mapData, setMapData] = useState<MapStateData[]>([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredState, setHoveredState] = useState<MapStateData | null>(null);
  const [selectedState, setSelectedState] = useState<MapStateData | null>(null);
  const [viewMode, setViewMode] = useState<'revenue' | 'volume'>('revenue');

  // Initial Data Mocking
  useMemo(() => {
    const data = Object.keys(BRAZIL_COORDS).map(uf => ({
      uf,
      region: BRAZIL_COORDS[uf].region,
      x: BRAZIL_COORDS[uf].x,
      y: BRAZIL_COORDS[uf].y,
      count: Math.floor(Math.random() * 8) + 1, // 1 to 8 courses
      value: Math.floor(Math.random() * 80000) + 10000
    }));
    setMapData(data.sort((a,b) => b.value - a.value));
  }, []);

  // Calculate Map KPIs
  const totalRevenue = mapData.reduce((acc, curr) => acc + curr.value, 0);
  const coveredStates = mapData.filter(s => s.count > 0).length;
  const coveragePercent = (coveredStates / 27) * 100;
  const topState = mapData.length > 0 ? mapData[0] : null; // Already sorted by value in useMemo

  // Calculate Region Stats
  const regionStats = mapData.reduce((acc, curr) => {
     if (!acc[curr.region]) acc[curr.region] = 0;
     acc[curr.region] = (acc[curr.region] || 0) + curr.value;
     return acc;
  }, {} as Record<string, number>);
  
  const topRegion = Object.entries(regionStats).sort((a,b) => b[1] - a[1])[0] || ['N/A', 0];

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) setPan({ x: 0, y: 0 }); // Reset pan if zoomed out fully
      return newZoom;
    });
  };
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedState(null);
  };

  const handleStateClick = (state: MapStateData) => {
    if (selectedState?.uf === state.uf) {
      handleReset();
    } else {
      setSelectedState(state);
      setZoom(3);
      setPan({
        x: (50 - state.x) * 2,
        y: (50 - state.y) * 2
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Mapa de Presença CGP</h2>
        
        {/* View Mode Toggle */}
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
           <button 
             onClick={() => setViewMode('revenue')}
             className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'revenue' ? 'bg-pink-100 text-pink-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
              <DollarSign className="w-3.5 h-3.5" /> Faturamento
           </button>
           <button 
             onClick={() => setViewMode('volume')}
             className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${viewMode === 'volume' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
              <Layers className="w-3.5 h-3.5" /> Volume
           </button>
        </div>
      </div>

      {/* Strategic KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
               <DollarSign className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase">Faturamento Mapeado</p>
               <p className="text-xl font-black text-slate-800">R$ {(totalRevenue/1000000).toFixed(2)}M</p>
            </div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
               <MapPin className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase">Cobertura Nacional</p>
               <p className="text-xl font-black text-slate-800">{coveredStates}/27 <span className="text-xs font-normal text-slate-500">({coveragePercent.toFixed(0)}%)</span></p>
            </div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
               <Award className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase">Região Dominante</p>
               <p className="text-xl font-black text-slate-800">{topRegion[0]}</p>
               <p className="text-[10px] text-slate-500">R$ {topRegion[1].toLocaleString()}</p>
            </div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-pink-100 text-pink-600 rounded-lg">
               <Trophy className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase">Estado MVP</p>
               <p className="text-xl font-black text-slate-800">{topState?.uf}</p>
               <p className="text-[10px] text-slate-500">R$ {topState?.value.toLocaleString()}</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Interactive Map Container */}
         <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 relative overflow-hidden shadow-2xl h-[500px] flex items-center justify-center">
            
            {/* Map Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950 via-slate-900 to-slate-900 opacity-50"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:20px_20px]"></div>

            {/* Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
               <button onClick={handleZoomIn} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors" title="Zoom In">
                  <ZoomIn className="w-5 h-5" />
               </button>
               <button onClick={handleZoomOut} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors" title="Zoom Out">
                  <ZoomOut className="w-5 h-5" />
               </button>
               <button onClick={handleReset} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors" title="Reset View">
                  <Maximize className="w-5 h-5" />
               </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md p-3 rounded-lg border border-white/10 z-20 text-xs text-white">
               <div className="font-bold mb-2">{viewMode === 'revenue' ? 'Faturamento' : 'Qtd. Cursos'}</div>
               <div className="flex items-center gap-2 mb-1">
                  <span className={`w-3 h-3 rounded-full ${viewMode === 'revenue' ? 'bg-pink-500' : 'bg-indigo-400'}`}></span>
                  <span>Alto</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${viewMode === 'revenue' ? 'bg-indigo-500' : 'bg-slate-500'}`}></span>
                  <span>Baixo</span>
               </div>
            </div>

            {/* Map SVG */}
            <div 
              className="w-full h-full relative transition-transform duration-500 ease-in-out z-10"
              style={{ 
                transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                transformOrigin: 'center center'
              }}
            >
               <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                  <g className="opacity-10 stroke-white stroke-[0.2]">
                     {mapData.map((s, i) => i < mapData.length - 1 && (
                        <line key={`l-${i}`} x1={s.x} y1={s.y} x2={mapData[i+1].x} y2={mapData[i+1].y} />
                     ))}
                  </g>

                  {mapData.map((state) => {
                     // Dynamic Logic based on View Mode
                     const metric = viewMode === 'revenue' ? state.value : state.count;
                     const threshold = viewMode === 'revenue' ? 50000 : 4;
                     
                     // Bubble Size logic
                     const size = viewMode === 'revenue' 
                        ? Math.max(3, Math.min(state.value / 8000, 9)) 
                        : Math.max(3, Math.min(state.count * 1.5, 8));

                     const isHovered = hoveredState?.uf === state.uf;
                     const isSelected = selectedState?.uf === state.uf;
                     
                     // Color Logic
                     const intensity = metric > threshold 
                        ? (viewMode === 'revenue' ? 'fill-pink-500' : 'fill-indigo-400') 
                        : (viewMode === 'revenue' ? 'fill-indigo-500' : 'fill-slate-600');
                     
                     const glowColor = metric > threshold 
                        ? (viewMode === 'revenue' ? 'pink' : 'indigo') 
                        : (viewMode === 'revenue' ? 'indigo' : 'slate');

                     return (
                        <g 
                          key={state.uf} 
                          onClick={(e) => { e.stopPropagation(); handleStateClick(state); }}
                          onMouseEnter={() => setHoveredState(state)}
                          onMouseLeave={() => setHoveredState(null)}
                          className="cursor-pointer transition-all duration-300"
                        >
                           <circle 
                              cx={state.x} cy={state.y} r={size * 1.5} 
                              className={`fill-${glowColor}-500/30 blur-md transition-all duration-300 ${isHovered || isSelected ? 'opacity-100 r-[10]' : 'opacity-0'}`} 
                           />
                           <circle 
                              cx={state.x} cy={state.y} r={size} 
                              className={`${intensity} transition-all duration-300 ${isHovered ? 'brightness-125 scale-110' : ''}`}
                           />
                           <text 
                              x={state.x} y={state.y} 
                              dy={0.3} 
                              textAnchor="middle" 
                              fontSize={size / 1.5} 
                              className="fill-white font-bold pointer-events-none select-none"
                           >
                              {state.uf}
                           </text>
                        </g>
                     );
                  })}
               </svg>
            </div>

            {/* Smart Tooltip */}
            {(hoveredState || selectedState) && (
               <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-white/20 z-30 animate-fade-in min-w-[200px]">
                  {selectedState && (
                     <button onClick={handleReset} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                     </button>
                  )}
                  <div className="flex items-center mb-2">
                     <MapPin className="w-4 h-4 text-pink-500 mr-2" />
                     <h4 className="font-bold text-slate-800 text-lg">{(hoveredState || selectedState)?.uf}</h4>
                     <span className="ml-2 text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">{(hoveredState || selectedState)?.region}</span>
                  </div>
                  <div className="space-y-1">
                     <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Cursos Ativos:</span>
                        <span className="font-bold text-slate-800">{(hoveredState || selectedState)?.count}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Faturamento:</span>
                        <span className="font-bold text-green-600">R$ {(hoveredState || selectedState)?.value.toLocaleString()}</span>
                     </div>
                  </div>
               </div>
            )}
         </div>

         {/* State List */}
         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700 flex justify-between items-center">
               Ranking por Estado
               <span className="text-xs font-normal text-slate-400">Top Performance</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
               {mapData.map((item, idx) => (
                  <div 
                    key={item.uf} 
                    onClick={() => handleStateClick(item)}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                       selectedState?.uf === item.uf ? 'bg-pink-50 border border-pink-100' : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                     <div className="flex items-center">
                        <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold mr-3 ${idx < 3 ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-500'}`}>
                           {idx + 1}
                        </span>
                        <span className="font-bold text-slate-800">{item.uf}</span>
                     </div>
                     <div className="text-right">
                        <div className="text-sm font-bold text-slate-700">{item.count} Cursos</div>
                        <div className="text-xs text-slate-500">R$ {item.value.toLocaleString()}</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

// --- REPORTS ---
export const ReportsView: React.FC = () => {
  const reports = [
    { title: 'Relatório Geral de Vendas', date: 'Out 2026', size: '2.4 MB', type: 'XLSX' },
    { title: 'Performance Individual', date: 'Set 2026', size: '1.1 MB', type: 'PDF' },
    { title: 'Análise de Leads Perdidos', date: 'Out 2026', size: '0.8 MB', type: 'CSV' },
    { title: 'Previsão de Faturamento Q4', date: 'Nov 2026', size: '3.5 MB', type: 'PDF' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Central de Relatórios</h2>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
           <div className="flex gap-4">
              <div className="flex-1 relative">
                 <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm z-10 pointer-events-none">
                    Período:
                 </div>
                 <div className="relative">
                    <select className="w-full pl-20 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none shadow-sm cursor-pointer">
                       <option>Últimos 30 dias</option>
                       <option>Este Trimestre</option>
                       <option>Este Ano</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                 </div>
              </div>
              <button className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md">
                 Gerar Novo Relatório
              </button>
           </div>
        </div>
        
        <div className="p-6 grid gap-4">
           {reports.map((rep, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:shadow-md hover:border-pink-200 transition-all group bg-white">
                 <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm mr-4 ${
                       rep.type === 'XLSX' ? 'bg-green-100 text-green-700' : 
                       rep.type === 'PDF' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                       {rep.type}
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-800 group-hover:text-pink-600 transition-colors">{rep.title}</h4>
                       <p className="text-sm text-slate-500">Gerado em: {rep.date} • Tamanho: {rep.size}</p>
                    </div>
                 </div>
                 <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
                    <Download className="w-5 h-5" />
                 </button>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
};