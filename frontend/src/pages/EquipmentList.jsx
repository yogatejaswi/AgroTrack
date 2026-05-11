import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X, ChevronDown, CheckSquare, IndianRupee, Tag, CheckCircle } from 'lucide-react';
import equipmentService from '../services/equipmentService';
import EquipmentCard from '../components/EquipmentCard';
import { SkeletonLoader } from '../components/SkeletonLoader';
import HeroBanner from '../components/HeroBanner';
import { cn } from '../lib/utils';

const CATEGORIES = ['Tractors', 'Harvesters', 'Plough', 'Seed Drill', 'Irrigation', 'Rotavator', 'Sprayer', 'Cultivator', 'Thresher'];
const PRICE_RANGES = [
    { id: 'all', label: 'Any Price' },
    { id: 'low', label: 'Under ₹1,000', min: 0, max: 999 },
    { id: 'mid', label: '₹1,000 - ₹2,500', min: 1000, max: 2500 },
    { id: 'high', label: 'Above ₹2,500', min: 2501, max: 99999 }
];

const CATEGORY_ALIASES = {
    tractor: 'Tractors',
    tractors: 'Tractors',
    harvester: 'Harvesters',
    harvesters: 'Harvesters',
    plough: 'Plough',
    'seed drill': 'Seed Drill',
    seeder: 'Seed Drill',
    irrigation: 'Irrigation',
    rotavator: 'Rotavator',
    sprayer: 'Sprayer',
    cultivator: 'Cultivator',
    thresher: 'Thresher'
};

const normalizeCategory = (category = '') => {
    if (!category) return '';
    const key = category.toString().trim().toLowerCase();
    return CATEGORY_ALIASES[key] || category;
};

const EquipmentList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [selectedCategories, setSelectedCategories] = useState(
        searchParams.get('cat') ? [searchParams.get('cat')] : []
    );
    const [priceRange, setPriceRange] = useState('all');
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        setLoading(true);
        try {
            const data = await equipmentService.getEquipment('');
            setEquipment(data);
        } catch (err) {
            console.error('Error fetching equipment:', err);
        } finally {
            setTimeout(() => setLoading(false), 800);
        }
    };

    const toggleCategory = (cat) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategories([]);
        setPriceRange('all');
        setOnlyAvailable(false);
        setSearchParams({});
    };

    const filteredEquipment = (equipment || []).filter(item => {
        const matchesSearch = item?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
            item?.category?.toLowerCase()?.includes(searchQuery.toLowerCase());
        const normalizedItemCategory = normalizeCategory(item?.category);
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(normalizedItemCategory);
        const price = Number(item?.price_per_day || 0);
        let matchesPrice = true;
        if (priceRange !== 'all') {
            const range = PRICE_RANGES.find(r => r.id === priceRange);
            matchesPrice = price >= range.min && price <= range.max;
        }
        const matchesAvailability = !onlyAvailable || item.availability_status === 'available' || item.availability_status === 1;
        return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
    });

    return (
        <div className="animate-in fade-in duration-700 pb-20 bg-gray-50 min-h-screen">
            <HeroBanner
                title="Agricultural Marketplace"
                description={`Unlock productivity with ${equipment.length} verified heavy machines and tools available for instant rental.`}
                actions={[]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Search & Filter Bar */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 group w-full md:w-auto">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-agro-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search equipment..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-premium pl-16 py-4 bg-white shadow-md w-full"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden btn-secondary py-4 px-6 w-full md:w-auto"
                        >
                            <SlidersHorizontal className="w-5 h-5 mr-2" /> Filters
                        </button>
                    </div>

                    {/* Active Filters Display */}
                    {(searchQuery || selectedCategories.length > 0 || priceRange !== 'all') && (
                        <div className="flex flex-wrap gap-2 items-center">
                            {searchQuery && (
                                <span className="badge-premium bg-agro-100 text-agro-700">Search: {searchQuery}</span>
                            )}
                            {selectedCategories.map(cat => (
                                <span key={cat} className="badge-premium bg-blue-100 text-blue-700">{cat}</span>
                            ))}
                            {priceRange !== 'all' && (
                                <span className="badge-premium bg-purple-100 text-purple-700">
                                    {PRICE_RANGES.find(r => r.id === priceRange)?.label}
                                </span>
                            )}
                            <button
                                onClick={clearFilters}
                                className="text-xs font-bold text-agro-600 hover:text-agro-700 ml-2"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className={cn(
                        "lg:w-72 shrink-0 space-y-6 lg:block",
                        showFilters ? "block" : "hidden"
                    )}>
                        <div className="card-premium-static p-6 bg-white sticky top-24 rounded-2xl shadow-md">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 italic">
                                    <Filter className="w-5 h-5 text-agro-600" /> Filters
                                </h2>
                                {(searchQuery || selectedCategories.length > 0 || priceRange !== 'all' || onlyAvailable) && (
                                    <button onClick={clearFilters} className="text-xs font-black uppercase tracking-widest text-agro-600 hover:text-agro-700 transition-colors">
                                        Reset
                                    </button>
                                )}
                            </div>

                            {/* Categories */}
                            <div className="mb-8">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Categories</h3>
                                <div className="space-y-3">
                                    {CATEGORIES.map(cat => (
                                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => toggleCategory(cat)}
                                                className="peer sr-only"
                                            />
                                            <div className="w-5 h-5 rounded-lg border-2 border-gray-200 peer-checked:bg-agro-600 peer-checked:border-agro-600 transition-all flex items-center justify-center">
                                                <CheckCircle className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-8">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Price Range</h3>
                                <div className="space-y-3">
                                    {PRICE_RANGES.map(range => (
                                        <label key={range.id} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="priceRange"
                                                checked={priceRange === range.id}
                                                onChange={() => setPriceRange(range.id)}
                                                className="w-4 h-4 text-agro-600 border-gray-200 focus:ring-agro-500"
                                            />
                                            <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{range.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Marketplace Grid */}
                    <main className="flex-1 space-y-6">
                        {/* Results Count */}
                        <div className="flex items-center justify-between px-2">
                            <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">
                                <span className="text-gray-900 text-lg">{filteredEquipment.length}</span> Equipment Available
                            </p>
                        </div>

                        {/* Grid */}
                        {loading ? (
                            <SkeletonLoader type="card" count={6} />
                        ) : filteredEquipment.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredEquipment.map((item) => (
                                    <EquipmentCard key={item.id} equipment={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="card-premium bg-white p-16 text-center space-y-6 rounded-2xl">
                                <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto">
                                    <Search className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 italic">No Equipment Found</h3>
                                <p className="text-gray-500 max-w-sm mx-auto font-medium">
                                    Try adjusting your filters or search terms to find what you're looking for.
                                </p>
                                <button onClick={clearFilters} className="btn-primary mx-auto">
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default EquipmentList;
