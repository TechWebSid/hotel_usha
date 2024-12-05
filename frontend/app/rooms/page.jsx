"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await fetch("http://localhost:5000/api/rooms");
        if (!response.ok) throw new Error("Failed to fetch rooms");
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading rooms...</p>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">No rooms available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Rooms</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room._id}
            className={`bg-white shadow-md rounded-lg overflow-hidden ${
              !room.availability ? 'opacity-50' : ''
            }`}
          >
            <img
              src={room.images?.[0] || "https://via.placeholder.com/400x300"}
              alt={room.name || "Room Image"}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800">{room.name}</h2>
              <p className="text-gray-600">{room.description}</p>
              <p className="mt-2 text-indigo-600 font-bold">₹{room.price}/night</p>
              <p className={`mt-2 ${!room.availability ? 'text-red-600' : 'text-green-600'}`}>
                {room.availability ? 'Available' : 'Not Available'}
              </p>
              <Link href={`/rooms/${room._id}`}>
                <button
                  className={`mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition ${
                    !room.availability ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  disabled={!room.availability}
                >
                  View Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
