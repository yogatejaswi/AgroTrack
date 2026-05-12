import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, User, IndianRupee, AlertCircle, CheckCircle, XCircle, Truck, Phone, MessageSquare, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import equipmentService from '../services/equipmentService';
import bookingService from '../services/bookingService';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { formatDate } from '../utils/formatDate';
import { getEquipmentImage } from '../assets/images';
import HeroBanner from '../components/HeroBanner';
import ModernTable from '../components/ModernTable';
import { cn } from '../lib/utils';

const EquipmentTracking = () => {
    const { user } = useAuth();
    const [ownerEquipment, setOwnerEquipment] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [expandedBooking, setExpandedBooking] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError('');
                // Fetch owner's equipment
                const equipmentData = await equipmentService.getEquipmentByOwner(user.id);
                setOwnerEquipment(equipmentData);
                
                // Set first equipment as selected by default
                if (equipmentData.length > 0) {
                    setSelectedEquipmentId(equipmentData[0].id);
                }

                // Fetch all bookings
                const bookingsData = await bookingService.getBookings();
                setAllBookings(bookingsData || []);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.id]);

    // Filter bookings for selected equipment
    const equipmentBookings = allBookings.filter(b => b.equipment_id === selectedEquipmentId);
    const selectedEquipment = ownerEquipment.find(eq => eq.id === selectedEquipmentId);

    // Calculate stats
    const activeRentals = equipmentBookings.filter(b => b.status === 'confirmed').length;
    const pendingRequests = equipmentBookings.filter(b => b.status === 'pending').length;
    const totalEarnings = equipmentBookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + Number(b.total_cost || 0), 0);

    // Handle booking status update
    const handleStatusUpdate = async (bookingId, newStatus) => {
        setActionLoading(bookingId);
        try {
            await bookingService.updateBookingStatus(bookingId, newStatus);
            // Update local state
            setAllBookings(prev => prev.map(b => 
                b.id === bookingId ? { ...b, status: newStatus } : b
            ));
            setExpandedBooking(null);
        } catch (err) {
            console.error('Error updating booking:', err);
            alert('Failed to update booking status');
        } finally {
            setActionLoading(null);
        }
    };

    const columns = [
        {
            key: 'id',
            label: 'Booking ID',
            sortable: true,
            render: (item) => <span className="font-black text-[10px] text-gray-400 uppercase tracking-tighter">#{item.id}</span>
        },
        {
            key: 'user_name',
            label: 'Renter',
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-agro-50 flex items-center justify-center text-agro-600 font-bold text-xs">
                        {item.user_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{item.user_name}</p>
                        <p className="text-[10px] text-gray-400">{item.user_email}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'start_date',
            label: 'Rental Period',
            render: (item) => (
                <div className="text-[10px] font-bold text-gray-600 space-y-1">
                    <p className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-agro-600" />
                        {formatDate(item.start_date)}
                    </p>
                    <p className="text-gray-400">to {formatDate(item.end_date)}</p>
                </div>
            )
        },
        {
            key: 'total_cost',
            label: 'Amount',
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-1 font-black text-gray-900">
                    <IndianRupee className="w-4 h-4 text-agro-600" />
                    {item.total_cost}
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (item) => (
                <span className={cn(
                    "inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest gap-1",
                    item.status === 'confirmed' ? "bg-green-50 text-green-600" :
                        item.status === 'pending' ? "bg-orange-50 text-orange-600" :
                            item.status === 'rejected' ? "bg-red-50 text-red-600" :
                                "bg-gray-100 text-gray-500"
                )}>
                    {item.status === 'confirmed' && <CheckCircle className="w-3 h-3" />}
                    {item.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                    {item.status === 'rejected' && <XCircle className="w-3 h-3" />}
                    {item.status}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (item) => (
                <button
                    onClick={() => setExpandedBooking(expandedBooking === item.id ? null : item.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    {expandedBooking === item.id ? (
                        <EyeOff className="w-4 h-4 text-gray-600" />
                    ) : (
                        <Eye className="w-4 h-4 text-gray-600" />
                    )}
                </button>
            )
        }
    ];

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <SkeletonLoader type="card" count={1} />
        </div>
    );

    return (
        <div className="animate-in fade-in duration-700 pb-20">
            <HeroBanner
                title="Equipment Tracking"
                description="Monitor all bookings and rentals for your equipment in real-time."
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 pt-8">
                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <p className="text-sm font-bold text-red-700">{error}</p>
                    </div>
                )}

                {/* Equipment Selection */}
                {ownerEquipment.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-lg font-black text-gray-900 mb-6">Your Equipment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {ownerEquipment.map((eq) => (
                                <button
                                    key={eq.id}
                                    onClick={() => setSelectedEquipmentId(eq.id)}
                                    className={cn(
                                        "p-4 rounded-2xl border-2 transition-all text-left",
                                        selectedEquipmentId === eq.id
                                            ? "border-agro-600 bg-agro-50"
                                            : "border-gray-100 bg-white hover:border-agro-200"
                                    )}
                                >
                                    <div className="w-full h-24 rounded-xl overflow-hidden mb-3 bg-gray-100">
                                        <img
                                            src={getEquipmentImage(eq)}
                                            alt={eq.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-sm">{eq.name}</h4>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{eq.category}</p>
                                    <p className="text-xs font-bold text-agro-600 mt-2">₹{eq.price_per_day}/day</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                {selectedEquipment && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="card-premium p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">Active Rentals</p>
                                    <h3 className="text-3xl font-black text-gray-900">{activeRentals}</h3>
                                    <p className="text-xs text-gray-500 mt-2">{equipmentBookings.filter(b => b.status === 'confirmed').length} confirmed bookings</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-green-50 text-green-600 shadow-lg">
                                    <Truck className="w-6 h-6" />
                                </div>
                            </div>
                        </div>

                        <div className="card-premium p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">Pending Requests</p>
                                    <h3 className="text-3xl font-black text-gray-900">{pendingRequests}</h3>
                                    <p className="text-xs text-gray-500 mt-2">Awaiting your approval</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-orange-50 text-orange-600 shadow-lg">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                            </div>
                        </div>

                        <div className="card-premium p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">Total Earnings</p>
                                    <h3 className="text-3xl font-black text-gray-900">₹{totalEarnings.toLocaleString()}</h3>
                                    <p className="text-xs text-gray-500 mt-2">From confirmed bookings</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-agro-50 text-agro-600 shadow-lg">
                                    <IndianRupee className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bookings Table with Expandable Details */}
                {selectedEquipment && (
                    <div className="space-y-6">
                        <div className="card-premium p-8">
                            <h3 className="text-lg font-black text-gray-900 mb-6">Bookings for {selectedEquipment.name}</h3>
                            
                            {equipmentBookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium">No bookings yet for this equipment</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {equipmentBookings.map((booking) => (
                                        <div key={booking.id} className="border border-gray-100 rounded-2xl overflow-hidden hover:border-agro-200 transition-colors">
                                            {/* Booking Row */}
                                            <div className="p-6 bg-white">
                                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Booking ID</p>
                                                        <p className="font-black text-gray-900">#{booking.id}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Renter</p>
                                                        <p className="font-bold text-gray-900">{booking.user_name}</p>
                                                        <p className="text-xs text-gray-500">{booking.user_email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Period</p>
                                                        <p className="font-bold text-gray-900">{formatDate(booking.start_date)}</p>
                                                        <p className="text-xs text-gray-500">to {formatDate(booking.end_date)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                                                        <p className="font-black text-agro-600 text-lg">₹{booking.total_cost}</p>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className={cn(
                                                            "inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest gap-1",
                                                            booking.status === 'confirmed' ? "bg-green-50 text-green-600" :
                                                                booking.status === 'pending' ? "bg-orange-50 text-orange-600" :
                                                                    booking.status === 'rejected' ? "bg-red-50 text-red-600" :
                                                                        "bg-gray-100 text-gray-500"
                                                        )}>
                                                            {booking.status === 'confirmed' && <CheckCircle className="w-3 h-3" />}
                                                            {booking.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                                                            {booking.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                                            {booking.status}
                                                        </span>
                                                        <button
                                                            onClick={() => setExpandedBooking(expandedBooking === booking.id ? null : booking.id)}
                                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-4"
                                                        >
                                                            {expandedBooking === booking.id ? (
                                                                <EyeOff className="w-4 h-4 text-gray-600" />
                                                            ) : (
                                                                <Eye className="w-4 h-4 text-gray-600" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expanded Details */}
                                            {expandedBooking === booking.id && (
                                                <div className="border-t border-gray-100 bg-gray-50 p-6 space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <h4 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest">Renter Details</h4>
                                                            <div className="space-y-3">
                                                                <div className="flex items-center gap-2">
                                                                    <User className="w-4 h-4 text-agro-600" />
                                                                    <span className="text-sm text-gray-700">{booking.user_name}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <MessageSquare className="w-4 h-4 text-agro-600" />
                                                                    <span className="text-sm text-gray-700">{booking.user_email}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest">Booking Details</h4>
                                                            <div className="space-y-3">
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="w-4 h-4 text-agro-600" />
                                                                    <span className="text-sm text-gray-700">{formatDate(booking.start_date)} to {formatDate(booking.end_date)}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <IndianRupee className="w-4 h-4 text-agro-600" />
                                                                    <span className="text-sm font-bold text-gray-900">₹{booking.total_cost}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons for Pending Bookings */}
                                                    {booking.status === 'pending' && (
                                                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                                                            <button
                                                                onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                                                disabled={actionLoading === booking.id}
                                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60"
                                                            >
                                                                {actionLoading === booking.id ? 'Processing...' : 'Approve Booking'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                                                                disabled={actionLoading === booking.id}
                                                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60"
                                                            >
                                                                {actionLoading === booking.id ? 'Processing...' : 'Reject Booking'}
                                                            </button>
                                                        </div>
                                                    )}

                                                    {booking.status === 'confirmed' && (
                                                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                                                            <button
                                                                onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                                                disabled={actionLoading === booking.id}
                                                                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60"
                                                            >
                                                                {actionLoading === booking.id ? 'Processing...' : 'Cancel Rental'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {ownerEquipment.length === 0 && (
                    <div className="card-premium p-12 text-center">
                        <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-gray-600 mb-2">No Equipment Listed</h4>
                        <p className="text-gray-500 mb-6">You haven't listed any equipment yet. Start by adding your first equipment to track rentals.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EquipmentTracking;
