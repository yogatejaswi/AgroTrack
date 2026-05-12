import React, { useState, useEffect } from 'react';
import { Heart, MapPin, IndianRupee, ArrowRight, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import wishlistService from '../services/wishlistService';
import { SkeletonLoader } from '../components/SkeletonLoader';
import HeroBanner from '../components/HeroBanner';
import { getEquipmentImage } from '../assets/images';

const Wishlist = () => {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState(null);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const data = await wishlistService.getUserWishlist();
            setWishlist(data);
        } catch (err) {
            console.error('Error fetching wishlist:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (equipmentId) => {
        setRemoving(equipmentId);
        try {
            await wishlistService.removeFromWishlist(equipmentId);
            setWishlist(prev => prev.filter(item => item.id !== equipmentId));
        } catch (err) {
            console.error('Error removing from wishlist:', err);
        } finally {
            setRemoving(null);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <SkeletonLoader type="card" count={3} />
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700 pb-20">
            <HeroBanner
                title="My Wishlist"
                description="Your saved equipment for future rentals"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 pt-8">
                {wishlist.length === 0 ? (
                    <div className="card-premium p-12 text-center">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-gray-600 mb-2">Your Wishlist is Empty</h4>
                        <p className="text-gray-500 mb-6">Start adding equipment to your wishlist for quick access later.</p>
                        <button
                            onClick={() => navigate('/marketplace')}
                            className="inline-flex items-center gap-2 bg-agro-600 hover:bg-agro-700 text-white font-bold py-3 px-6 rounded-2xl transition-all"
                        >
                            Browse Equipment
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-gray-900">
                                {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'} Saved
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishlist.map((equipment) => (
                                <div
                                    key={equipment.id}
                                    className="card-premium overflow-hidden hover:shadow-xl transition-all group"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden bg-gray-100">
                                        <img
                                            src={getEquipmentImage(equipment)}
                                            alt={equipment.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <button
                                            onClick={() => handleRemove(equipment.id)}
                                            disabled={removing === equipment.id}
                                            className="absolute top-4 right-4 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all disabled:opacity-60"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <span className="inline-block px-3 py-1 bg-agro-50 text-agro-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-2">
                                                {equipment.category}
                                            </span>
                                            <h3 className="text-lg font-black text-gray-900 line-clamp-2">
                                                {equipment.name}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MapPin className="w-4 h-4 text-agro-600" />
                                            <span className="text-sm font-bold">{equipment.location}</span>
                                        </div>

                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-black text-agro-600">
                                                ₹{equipment.price_per_day}
                                            </span>
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                / day
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/equipment/${equipment.id}`)}
                                            className="w-full bg-agro-600 hover:bg-agro-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                        >
                                            View Details
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
