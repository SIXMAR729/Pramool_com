import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


const CreateDiscussion = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('pda'); // Default category
    const [hasPic, setHasPic] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { token } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`http://localhost:3001/api/discussions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title, category, has_pic: hasPic }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create discussion');
            }

            navigate('/discuss'); // Redirect back to the discussions list
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-gray-800">Create New Discussion</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Topic Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full p-2 mt-1 border rounded"
                            placeholder="Enter the title of your topic"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-2 mt-1 border rounded bg-white"
                        >
                            <option value="pda">PDA</option>
                            <option value="gam_ts">Game TS</option>
                            <option value="spo">Sports</option>
                            <option value="etc">Etc.</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="hasPic"
                            checked={hasPic}
                            onChange={(e) => setHasPic(e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor="hasPic" className="ml-2 block text-sm text-gray-900">
                            Topic includes a picture (PIC)
                        </label>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <Link to="/discuss" className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600">
                            Cancel
                        </Link>
                        <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Create Topic
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateDiscussion;
