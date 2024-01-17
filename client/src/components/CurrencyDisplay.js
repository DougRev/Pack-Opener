import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import './CurrencyDisplay.css';

const CurrencyDisplay = () => {
    const [currency, setCurrency] = useState(0);

    useEffect(() => {
        // Replace with actual API call to fetch user's currency
        const fetchCurrency = async () => {
            try {
                const response = await fetch('/api/user/currency', {
                    headers: {
                        // Authentication headers if required
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setCurrency(data.currency);
                } else {
                    console.error('Failed to fetch currency');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchCurrency();
    }, []);

    return (
        <div className="currency-display">
            <FontAwesomeIcon icon={faCoins} />
            <span>{currency} Gold</span>
        </div>
    );
};

export default CurrencyDisplay;
