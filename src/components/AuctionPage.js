import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


// New Countdown Component
const AuctionCountdown = ({ endTime }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(endTime) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Clear the timer when the component unmounts to prevent memory leaks
        return () => clearTimeout(timer);
    }); // No dependency array, so it runs every second

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval] && interval !== 'seconds' && interval !== 'minutes') { // Don't show 0d or 0h
            return;
        }
        timerComponents.push(
            <span key={interval}>
                {timeLeft[interval]}{interval.charAt(0)}{' '}
            </span>
        );
    });

    return (
        <div className="bg-gray-200 rounded-full p-2 text-center text-sm font-semibold text-gray-700">
             Time Left: {timerComponents.length ? timerComponents : <span>Auction Ended</span>}
        </div>
    );
};


const AuctionPage = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/auctions`);
                if (!response.ok) {
                    throw new Error('Failed to fetch auctions');
                }
                const data = await response.json();
                setAuctions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []);

    if (loading) return <div className="text-center p-10">Loading auctions...</div>;
    if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Live Auctions</h1>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {auctions.map(auction => (
                        <div key={auction.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                            <img src={auction.image_url} alt={auction.title} className="w-full h-56 object-cover" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found'; }}/>
                            <div className="p-4 flex flex-col flex-grow">
                                <h2 className="text-xl font-bold text-gray-800 mb-2 flex-grow">{auction.title}</h2>
                                <p className="text-sm text-gray-600 mb-4">Seller: <span className="font-semibold">{auction.seller}</span></p>
                                
                                <div className="mt-auto">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-xs text-gray-500">Current Bid:</p>
                                        <p className="text-xl font-bold text-green-600">฿{Number(auction.current_price).toLocaleString()}</p>
                                    </div>
                                    {/* Use the new dynamic countdown component */}
                                    <AuctionCountdown endTime={auction.end_time} />
                                    <Link to={`/auction/${auction.id}`} className="block w-full text-center bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 mt-4 transition-colors">
                                        Place Bid
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AuctionPage;
