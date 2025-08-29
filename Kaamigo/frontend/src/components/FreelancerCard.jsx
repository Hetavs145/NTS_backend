import React from 'react';
import { FaEye, FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const FreelancerCard = ({ 
  freelancer, 
  onViewDetails, 
  variant = 'default',
  showProBadge = false 
}) => {
  const formatPrice = (price) => {
    if (price >= 1000) {
      return `₹${(price / 1000).toFixed(1)}K`;
    }
    return `₹${price}`;
  };

  const getCardClasses = () => {
    switch (variant) {
      case 'featured':
        return 'bg-gradient-to-br from-purple-50 to-orange-50 dark:from-purple-900 dark:to-orange-900 border-2 border-purple-200 dark:border-purple-600 p-4 rounded-xl shadow-md relative';
      case 'nearby':
        return 'bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700';
      default:
        return 'bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md';
    }
  };

  const getAvatarClasses = () => {
    switch (variant) {
      case 'featured':
        return 'h-24 bg-gradient-to-br from-purple-400 to-orange-400 rounded mb-2 flex items-center justify-center text-white font-bold text-2xl';
      case 'nearby':
        return 'w-12 h-12 bg-gradient-to-br from-purple-400 to-orange-400 rounded-full mr-3 flex items-center justify-center text-white font-bold text-lg';
      default:
        return 'h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded mb-2 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-2xl';
    }
  };

  if (variant === 'nearby') {
    return (
      <div className="flex items-center mb-4">
        <div className={getAvatarClasses()}>
          {freelancer.name.charAt(0)}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{freelancer.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{freelancer.role}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2">
            <FaStar className="text-yellow-400" /> {freelancer.rating} • {formatPrice(freelancer.price)}
          </p>
          <button 
            onClick={() => onViewDetails(freelancer)} 
            className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 mt-1"
          >
            <FaEye className="text-xs" /> View Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={getCardClasses()}>
      {showProBadge && (
        <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
          PRO
        </div>
      )}
      
      <div className={getAvatarClasses()}>
        {freelancer.name.charAt(0)}
      </div>
      
      <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-1">{freelancer.name}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
        {freelancer.role} • <FaMapMarkerAlt className="text-xs" /> {freelancer.city}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
        <FaStar className="text-yellow-400" /> {freelancer.rating} • {freelancer.reviews || 0} reviews • {formatPrice(freelancer.price)}
      </p>
      
      <button 
        onClick={() => onViewDetails(freelancer)} 
        className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 justify-center w-full mt-2"
      >
        <FaEye className="text-xs" /> View Details
      </button>
    </div>
  );
};

export default FreelancerCard;
