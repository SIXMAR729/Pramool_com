import React from 'react';

const MainContent = () => {
  return (
    <div className="flex-1 p-4 space-y-6">
      {/* Audio Player */}
      <div className="bg-gray-800 text-white p-4 rounded-lg flex items-center space-x-4">
        <div className="relative">
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-300">ขายประกันฝั่งเครื่องมือ</div>
          <div className="flex items-center space-x-2 mt-2">
            <div className="bg-gray-600 h-1 flex-1 rounded">
              <div className="bg-orange-500 h-1 w-1/4 rounded"></div>
            </div>
            <span className="text-xs">0:00 / 5:43</span>
          </div>
        </div>
      </div>

      {/* What's New Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">What's new</h2>
        
        <div className="space-y-4">
          <div className="text-center text-red-600 font-medium">
            ปนาโดแง่งเดือมาต ถ้าขีอยิ่นขี่ไปเลอมกับขีอให้ปัดประขายแนงิ่งให้ทาง
          </div>
          
          <div className="text-center text-red-600">
            เน็น
          </div>
          
          <div className="text-center text-red-600">
            ข็จาปิพ สอนประกาศให้นอกรอบ ควรระงังสินค้านอกรอบ
          </div>
          
          <div className="border-l-4 border-red-500 pl-4">
            <div className="flex items-center space-x-2">
              <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                NEW
              </span>
              <span className="text-sm text-gray-700">
                13/2/55 ห้ามขาย CD/DVD ทุกชนิดที่ไม่ใช้สินค้าถูกสิทธิ์, 
                ห้ามลงสินค้าขายพ่นเดี่ยวกับเกมส์ 2 รายการ, ห้ามลงห้องหาวยอัพ 
                หาก้งเน็น
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Auction Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-bold text-gray-800 mb-3">Featured Auctions</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-3 p-2 border border-gray-200 rounded">
                <div className="w-12 h-12 bg-gray-300 rounded"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">สินค้าประมูล #{item}</div>
                  <div className="text-xs text-gray-600">เริ่มต้น ฿100</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-600">฿250</div>
                  <div className="text-xs text-gray-500">2 ชั่วโมง</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-bold text-gray-800 mb-3">Recent Posts</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-2 border border-gray-200 rounded">
                <div className="text-sm font-medium">กระทู้ #{item}</div>
                <div className="text-xs text-gray-600 mt-1">
                  โพสต์โดย: สมาชิก{item} | 2 ชั่วโมงที่แล้ว
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;