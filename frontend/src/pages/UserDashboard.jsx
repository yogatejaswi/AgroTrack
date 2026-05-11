import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, IndianRupee, Tractor, ArrowRight, ShieldCheck, AlertCircle, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { isEquipmentManager } from '../utils/roles';
import bookingService from '../services/bookingService';
import equipmentService from '../services/equipmentService';
import Loader from '../components/Loader';
import agricultureImage from '../assets/images/agriculture.png';
import HeroBanner from '../components/HeroBanner';
import StatsCard from '../components/StatsCard';
import { getEquipmentImage } from '../assets/images';

const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [ownerEquipment, setOwnerEquipment] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookingsData = await bookingService.getUserBookings(user.id);
                setBookings(bookingsData);

                // Fetch owner's equipment if they're an equipment manager
                if (isEquipmentManager(user)) {
                    const equipmentData = await equipmentService.getEquipmentByOwner(user.id);
                    setOwnerEquipment(equipmentData);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.id]);

    const canManageEquipment = isEquipmentManager(user);
    const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
    const activeCount = bookings.filter(b => b.status === 'confirmed').length;
    const totalSpent = bookings.reduce((sum, b) => sum + Number(b.total_cost || 0), 0);

    if (loading) return <Loader fullPage />;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {canManageEquipment && (
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Owner Dashboard</h2>
                        <p className="text-gray-500 font-medium">Add machinery, manage listings, and monitor rentals.</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/equipment-management?new=1')}
                        className="bg-agro-600 hover:bg-agro-700 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-agro-100 flex items-center justify-center gap-2"
                    >
                        <Tractor className="w-5 h-5" /> Add Equipment
                    </button>
                </div>
            )}

            {/* Hero Section */}
            <HeroBanner
                title="Empowering Modern Agriculture"
                description="AgroTrack connects you with the best farming equipment. Seamlessly book, manage, and track your agricultural assets in one place."
                image={agricultureImage}
                actions={[
                    {
                        label: 'Browse Equipment',
                        onClick: () => navigate('/marketplace'),
                        primary: true,
                        icon: Tractor
                    },
                    {
                        label: 'My Bookings',
                        onClick: () => navigate('/my-bookings'),
                        icon: ArrowRight
                    }
                ]}
            />

            {/* New Rental Button */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/new-rental')}
                    className="bg-agro-600 hover:bg-agro-700 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-agro-100 flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> New Rental
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatsCard
                    title="Total Bookings"
                    value={activeBookings.length}
                    icon={Package}
                    color="purple"
                    trend={{ value: 12, isUp: true }}
                    onClick={() => navigate('/my-bookings')}
                />
                <StatsCard
                    title="Active Rentals"
                    value={activeCount}
                    icon={Clock}
                    color="blue"
                    trend={{ value: 8, isUp: true }}
                    onClick={() => navigate('/my-bookings')}
                />
                <StatsCard
                    title="Total Spent"
                    value={`₹${totalSpent.toLocaleString()}`}
                    icon={IndianRupee}
                    color="agro"
                    trend={{ value: 5, isUp: false }}
                    onClick={() => navigate('/my-bookings')}
                />
            </div>

            {/* Owner Equipment Section */}
            {canManageEquipment && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Your Equipment Fleet</h3>
                            <p className="text-gray-500 font-medium text-sm mt-1">Manage your listed equipment and monitor bookings</p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/equipment-management')}
                            className="text-agro-600 hover:text-agro-700 font-bold text-sm transition-colors"
                        >
                            View All →
                        </button>
                    </div>

                    {ownerEquipment.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ownerEquipment.slice(0, 3).map((eq) => (
                                <div key={eq.id} className="card-premium p-6 hover:shadow-xl transition-all cursor-pointer" onClick={() => navigate(`/equipment/${eq.id}`)}>
                                    <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-gray-100">
                                        <img
                                            src={getEquipmentImage(eq)}
                                            alt={eq.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-black text-gray-900 text-lg italic">{eq.name}</h4>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{eq.category}</p>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                            <span className="text-sm font-bold text-gray-600">₹{eq.price_per_day}/day</span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                                eq.availability_status === 'available' || eq.availability_status === 1
                                                    ? 'bg-green-50 text-green-600'
                                                    : 'bg-red-50 text-red-600'
                                            }`}>
                                                {eq.availability_status === 'available' || eq.availability_status === 1 ? 'Available' : 'Deployed'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card-premium p-12 text-center">
                            <Tractor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h4 className="text-lg font-bold text-gray-600 mb-2">No Equipment Listed Yet</h4>
                            <p className="text-gray-500 mb-6">Start earning by listing your agricultural equipment</p>
                            <button
                                onClick={() => navigate('/new-rental')}
                                className="bg-agro-600 hover:bg-agro-700 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-agro-100 inline-flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" /> List Your First Equipment
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Recent Activity / Next Steps can go here */}
            <div className="grid grid-cols-1 lg:grid-cols-1 lg:gap-8">
                <div className="card-premium p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 font-['Outfit']">Quick Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-agro-50 border border-agro-100 flex items-start">
                            <div className="p-2 bg-white rounded-xl mr-4 shadow-sm">
                                <ShieldCheck className="w-5 h-5 text-agro-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-agro-900 text-sm mb-1">Secure Transactions</h4>
                                <p className="text-xs text-agro-700 font-medium">All equipment rentals are backed by our secure payment and insurance system.</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start">
                            <div className="p-2 bg-white rounded-xl mr-4 shadow-sm">
                                <AlertCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm mb-1">Timely Returns</h4>
                                <p className="text-xs text-blue-700 font-medium">Return equipment on time to maintain a perfect rating and unlock exclusive discounts.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
