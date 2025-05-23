import React from 'react';

const RightSidebar = () => {
  return (
    <div className="w-64 p-4 space-y-6">
      {/* Auction Query */}
      <div className="bg-blue-100 rounded-lg p-3">
        <h3 className="font-bold text-blue-800 text-sm mb-2 bg-blue-200 -mx-3 -mt-3 px-3 py-1 rounded-t-lg">
          Auction Query
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-1">
            <span>สินค้าประมูลชิ้นเด็ด</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="bg-green-500 text-white px-1 rounded text-xs">NEW</span>
            <span>สินค้าเข้าประมูลร้อย</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="bg-red-500 text-white px-1 rounded text-xs">HOT</span>
            <span>สินค้าแนะนำจากค่าน</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>สินค้าโกอปประมูล</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>สินค้ามือทอง</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>🎭</span>
            <span>สินค้าประมูลชิ้นนิด</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>💰</span>
            <span>ตงแนะนำประมูลได่เป่</span>
          </div>
        </div>
      </div>

      {/* Banner Ad */}
      <div className="bg-red-500 text-white rounded-lg p-4 text-center">
        <div className="font-bold text-sm mb-1">แบนเนอร์โฆษณา</div>
        <div className="text-xl font-bold">5,000/เดือน</div>
        <div className="text-sm">(125x125)</div>
        <div className="text-xs mt-2">กดสั่งตลาดเล็กมิด</div>
      </div>

      {/* PRAGSTAK.COM */}
      <div className="bg-gray-100 rounded-lg p-3">
        <div className="text-sm font-bold text-center">
          PRAGSTAK.COM
        </div>
      </div>

      {/* Additional Sections */}
      <div className="space-y-3">
        <div className="bg-yellow-100 rounded p-2">
          <div className="text-xs font-medium text-yellow-800">เนื้อหาพิเศษ</div>
        </div>
        
        <div className="bg-green-100 rounded p-2">
          <div className="text-xs font-medium text-green-800">ข่าวสารล่าสุด</div>
        </div>
        
        <div className="bg-purple-100 rounded p-2">
          <div className="text-xs font-medium text-purple-800">สมาชิกแนะนำ</div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;