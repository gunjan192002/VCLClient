import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(1);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  const backendUrl = "https://api.virtualcyberlabs.com";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("Token");
        const userResponse = await fetch(`${backendUrl}/user`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        setUsername(userData.username);
        if (typeof userData.avatar === 'undefined') {
          userData.avatar = 1;
        }
        setAvatar(userData.avatar);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
  localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    const closeDropdownOnClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        isDropdownOpen
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', closeDropdownOnClickOutside);

    return () => {
      document.removeEventListener('mousedown', closeDropdownOnClickOutside);
    };
  }, [isDropdownOpen]);
  const avatarImagePath =`https://cyber-range-assets.s3.ap-south-1.amazonaws.com/avatars/${avatar}.png` ;
  return (
    <div
      className="flex justify-between items-center p-4"
      style={{
        background:
          'linear-gradient(315deg, #2234ae 0%, #191714 80%)',
        height: '55px',
      }}
    >
      <div className="text-xl font-bold text-white flex items-center">
        {/*Navigation*/}
      </div>
      <div className="flex items-center">
        {/* Notification icon */}
        <Link to="/temp">
          <FaBell className="text-2xl text-white m-3" />
        </Link>

        {/* Profile icon with dropdown */}
        <div className="relative" ref={dropdownRef}>
          <img
            src={avatarImagePath}
            alt="User Avatar"
            className="w-8 h-8 text-white cursor-pointer"
            onClick={toggleDropdown}
          />
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <Link
                  to={`/profile/${username}`}    
                  onClick={(event) => {
                    closeDropdown(); // Close the dropdown
                    window.location.href = `/profile/${username}`; // Reload the page
                }}
                  role="menuitem"
                  className=" block px-4 py-2 text-sm text-black hover:bg-gray-100 w-full text-left"
                >
                  My Profile
                </Link>
                <Link
                  to={`/settings/${username}`}
                  onClick={(event) => {
                    closeDropdown(); // Close the dropdown
                    window.location.href = `/settings/${username}`; // Reload the page
                }}
                  role="menuitem"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-100 w-full text-left"
                >
                  Settings
                </Link>
                <Link
                  to="/"
                  onClick={handleLogout}
                  role="menuitem"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Navbar;
