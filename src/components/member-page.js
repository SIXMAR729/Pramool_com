// member-page.js
import React from 'react';

const MemberPage = () => {
  // Mock Data for the Member Page UI
  const memberData = {
    userName: 'Primer Doe',
    membershipLevel: 'Premium Member',
    memberSince: 'January 1, 2025',
    totalPoints: 1250,
    coursesCompleted: 8,
    upcomingEvents: 3,
    recentActivities: [
      { id: 1, type: 'Buy Robot', description: 'Buy Robot"', date: 'May 28, 2025' },
      { id: 2, type: 'Event Registration', description: 'Signed up for "Webinar: Future of AI"', date: 'May 25, 2025' },
      { id: 3, type: 'Profile Update', description: 'Updated contact information', date: 'May 20, 2025' },
      { id: 4, type: 'Points Earned', description: 'Earned 50 points from daily login', date: 'May 19, 2025' },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-10 lg:p-12">
      {/* Header Section */}
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
          Welcome Back, {memberData.userName}!
        </h1>
        <p className="text-xl md:text-2xl opacity-90">
          Your Member Dashboard
        </p>
      </header>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Summary Card */}
        <div className="md:col-span-1 bg-orange-600 rounded-lg shadow-xl p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-orange-400 flex items-center justify-center text-5xl font-bold mb-4 border-4 border-white">
            JD {/* Placeholder for Avatar initials */}
          </div>
          <h2 className="text-2xl font-semibold mb-2">{memberData.userName}</h2>
          <p className="text-lg opacity-90 mb-1">{memberData.membershipLevel}</p>
          <p className="text-sm opacity-80">Member Since: {memberData.memberSince}</p>
        </div>

        {/* Quick Stats Section */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-orange-600 rounded-lg shadow-xl p-6 text-center">
            <p className="text-5xl font-bold mb-2">{memberData.totalPoints}</p>
            <p className="text-lg opacity-90">Total Points</p>
          </div>
          <div className="bg-orange-600 rounded-lg shadow-xl p-6 text-center">
            <p className="text-5xl font-bold mb-2">{memberData.coursesCompleted}</p>
            <p className="text-lg opacity-90">Courses Completed</p>
          </div>
          <div className="bg-orange-600 rounded-lg shadow-xl p-6 text-center">
            <p className="text-5xl font-bold mb-2">{memberData.upcomingEvents}</p>
            <p className="text-lg opacity-90">Upcoming Events</p>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="mt-10 bg-orange-600 rounded-lg shadow-xl p-6">
        <h2 className="text-3xl font-bold mb-6">Recent Activities</h2>
        <ul className="space-y-4">
          {memberData.recentActivities.map(activity => (
            <li key={activity.id} className="border-b border-orange-500 pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-semibold">{activity.type}</p>
                  <p className="text-md opacity-90">{activity.description}</p>
                </div>
                <p className="text-sm opacity-70">{activity.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer or Call to Action (Optional) */}
      <footer className="mt-10 text-center opacity-80 text-lg">
        <p>Explore more in your member portal!</p>
        <button className="mt-4 px-6 py-3 bg-white text-orange-500 font-bold rounded-lg hover:bg-orange-100 transition duration-300">
          Go to Settings
        </button>
      </footer>
    </div>
  );
};

export default MemberPage;