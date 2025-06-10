import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    if (!loginName || !password || !email) {
      setMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    console.log('Login Data:', { loginName, password, email });
    setMessage('ล็อกอินสำเร็จ! (จำลอง) '+ loginName);
  };

  return (
    <>
      {/* Animated Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-orange-400 text-white p-4 z-50 space-y-6 shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Close Button */}
        <div className="flex justify-end">
          <button onClick={() => setIsOpen(false)} className="text-white focus:outline-none">
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="bg-yellow-500 text-black p-2 text-sm rounded">
            {message}
          </div>
        )}

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Pramool Service */}
          <div className="bg-orange-500 rounded-lg p-3">
            <h3 className="font-bold text-sm mb-2 bg-orange-600 -mx-3 -mt-3 px-3 py-1 rounded-t-lg">
              Pramool Service
            </h3>
            <div className="space-y-2 text-sm">
              <div>สมัครสมาชิก</div>
              <div>จัดเวอร์ชันลิงก์</div>
              <div>ลิงค์ชัด, ลิงค์เซ็ง, เวลา</div>
              <div className="text-orange-200">ขายสินค้า</div>
              <div>เปิดประมูลสินค้า</div>
              <div className="text-xs">(ซื้อขึ้นไปและลิขสิทธิ์อ่าน)</div>
              <div>ป็อยๆรอคำใหม่และหา</div>
              <div className="text-xs">(ก่อนเวลาเปิดสินค้าใจ)</div>
            </div>
          </div>

          {/* Login Section */}
          <div className="bg-gray-700 rounded-lg p-3 space-y-2">
            <div className="text-sm">
              <label className="block">Login Name:</label>
              <input
                type="text"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                className="w-full p-1 text-black text-xs rounded"
              />
            </div>
            <div className="text-sm">
              <label className="block">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-1 text-black text-xs rounded"
              />
            </div>
            <div className="text-sm">
              <label className="block">My E-mail:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-1 text-black text-xs rounded"
              />
            </div>
            <button
              onClick={handleLogin}
              className="bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded text-sm"
            >
              My Pramool
            </button>
          </div>

          {/* Search Section */}
          <div className="bg-gray-600 rounded-lg p-3">
            <div className="flex space-x-1">
              <input
                type="text"
                placeholder="ค้นหาสินค้า"
                className="flex-1 p-1 text-black text-xs rounded"
              />
              <button className="bg-gray-500 hover:bg-gray-400 px-2 py-1 rounded text-xs">
                Search
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <div>
              <h4 className="font-bold text-sm mb-2 text-orange-300">แนะนำ/เคลาไบ์</h4>
              <div className="text-xs space-y-1">
                <div>คำแนะนำสำหรับมือใหม่</div>
                <div>กระดานการซื้อขายระบบ</div>
                <div>การแจ้งขอความเห็นอกเท่า</div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-2 text-orange-300">สินค้า</h4>
              <div className="text-xs space-y-1">
                <div>รายการสินค้าทาง FDA</div>
                <div>เอกชวตราผ่านมือถือ</div>
                <div>ของ pramool.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Open Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 bg-orange-700 text-white p-2 rounded-full shadow-md hover:bg-orange-400"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      )}
    </>
  );
};

export default Sidebar;
