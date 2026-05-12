import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Upload } from 'lucide-react';
import damageReportService from '../services/damageReportService';
import { cn } from '../lib/utils';

const DamageReportForm = ({ bookingId, equipmentId, reportType = 'post-rental', onSuccess }) => {
    const [formData, setFormData] = useState({
        description: '',
        severity: 'low',
        images_url: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const severityOptions = [
        { value: 'low', label: 'Minor (Cosmetic)', color: 'bg-blue-50 text-blue-600' },
        { value: 'medium', label: 'Moderate (Functional)', color: 'bg-yellow-50 text-yellow-600' },
        { value: 'high', label: 'Severe (Major Damage)', color: 'bg-orange-50 text-orange-600' },
        { value: 'critical', label: 'Critical (Non-functional)', color: 'bg-red-50 text-red-600' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.description.trim()) {
            setError('Please describe the damage or condition');
            return;
        }

        setLoading(true);
        try {
            await damageReportService.createDamageReport({
                booking_id: bookingId,
                equipment_id: equipmentId,
                report_type: reportType,
                description: formData.description,
                severity: formData.severity,
                images_url: formData.images_url
            });

            setSuccess('Damage report submitted successfully!');
            setFormData({ description: '', severity: 'low', images_url: '' });
            setTimeout(() => {
                onSuccess?.();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit damage report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-100 rounded-3xl p-8 space-y-6">
            <div>
                <h3 className="text-lg font-black text-gray-900 mb-2">
                    {reportType === 'pre-rental' ? 'Pre-Rental Inspection' : 'Post-Rental Condition Report'}
                </h3>
                <p className="text-sm text-gray-600">
                    {reportType === 'pre-rental'
                        ? 'Document the equipment condition before rental'
                        : 'Report any damage or issues after rental'}
                </p>
            </div>

            {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {success && (
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700">{success}</p>
                </div>
            )}

            {/* Severity Selection */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Damage Severity</label>
                <div className="grid grid-cols-2 gap-3">
                    {severityOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, severity: option.value })}
                            className={cn(
                                'p-3 rounded-xl border-2 transition-all text-sm font-bold',
                                formData.severity === option.value
                                    ? `${option.color} border-current`
                                    : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the condition or damage in detail..."
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-agro-500 focus:bg-white transition-all resize-none"
                />
            </div>

            {/* Image URL */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Image URL (Optional)</label>
                <div className="flex gap-2">
                    <input
                        type="url"
                        value={formData.images_url}
                        onChange={(e) => setFormData({ ...formData, images_url: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-agro-500 focus:bg-white transition-all"
                    />
                    <button
                        type="button"
                        className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        Upload
                    </button>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-agro-600 hover:bg-agro-700 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
                {loading ? 'Submitting...' : 'Submit Report'}
            </button>
        </form>
    );
};

export default DamageReportForm;
