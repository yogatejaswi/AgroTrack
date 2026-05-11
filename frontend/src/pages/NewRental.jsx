import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import equipmentService from '../services/equipmentService';
import HeroBanner from '../components/HeroBanner';

const NewRental = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        category: 'Tractors',
        price_per_day: '',
        location: '',
        description: '',
        image_url: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const categories = [
        'Tractors', 'Harvesters', 'Plough', 'Seed Drill', 
        'Irrigation', 'Rotavator', 'Sprayer', 'Cultivator', 'Thresher'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.name || !formData.price_per_day || !formData.location) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            await equipmentService.createEquipment({
                ...formData,
                price_per_day: parseFloat(formData.price_per_day),
                availability_status: 'available'
            });
            setSuccess('Equipment listed successfully!');
            setFormData({
                name: '',
                category: 'Tractors',
                price_per_day: '',
                location: '',
                description: '',
                image_url: ''
            });
            setTimeout(() => navigate('/marketplace'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to list equipment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-700">
            <HeroBanner
                title="List Your Equipment"
                description="Share your agricultural equipment with farmers and earn rental income"
                actions={[]}
            />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Equipment Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Equipment Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., John Deere Tractor"
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-agro-500 focus:bg-white transition-all"
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium focus:outline-none focus:border-agro-500 focus:bg-white transition-all"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price Per Day */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Price Per Day (₹) *</label>
                            <input
                                type="number"
                                name="price_per_day"
                                value={formData.price_per_day}
                                onChange={handleChange}
                                placeholder="e.g., 1500"
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-agro-500 focus:bg-white transition-all"
                                required
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Location *</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g., Bangalore, Karnataka"
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-agro-500 focus:bg-white transition-all"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your equipment, condition, features, etc."
                                rows="4"
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-agro-500 focus:bg-white transition-all resize-none"
                            />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
                            <input
                                type="url"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-agro-500 focus:bg-white transition-all"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-600 text-sm font-medium">
                                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <span>{success}</span>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-agro-600 hover:bg-agro-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-agro-200 active:scale-[0.98] disabled:opacity-60"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" /> List Equipment
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/marketplace')}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 rounded-2xl transition-all duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewRental;
