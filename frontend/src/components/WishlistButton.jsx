import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import wishlistService from '../services/wishlistService';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

const WishlistButton = ({ equipmentId, className = '' }) => {
    const { user } = useAuth();
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            checkWishlist();
        }
    }, [equipmentId, user]);

    const checkWishlist = async () => {
        try {
            const data = await wishlistService.checkWishlist(equipmentId);
            setIsInWishlist(data.isInWishlist);
        } catch (err) {
            console.error('Error checking wishlist:', err);
        }
    };

    const handleToggleWishlist = async () => {
        if (!user) {
            alert('Please login to add to wishlist');
            return;
        }

        setLoading(true);
        try {
            if (isInWishlist) {
                await wishlistService.removeFromWishlist(equipmentId);
            } else {
                await wishlistService.addToWishlist(equipmentId);
            }
            setIsInWishlist(!isInWishlist);
        } catch (err) {
            console.error('Error toggling wishlist:', err);
            alert('Failed to update wishlist');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleWishlist}
            disabled={loading}
            className={cn(
                'p-3 rounded-full transition-all duration-300 flex items-center justify-center',
                isInWishlist
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                'disabled:opacity-60',
                className
            )}
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <Heart className={cn('w-5 h-5', isInWishlist && 'fill-current')} />
        </button>
    );
};

export default WishlistButton;
