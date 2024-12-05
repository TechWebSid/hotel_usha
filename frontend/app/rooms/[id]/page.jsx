"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function RoomDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchRoomDetails() {
      try {
        const response = await fetch(`http://localhost:5000/api/rooms/${id}`);
        if (!response.ok) throw new Error("Room not found");
        const data = await response.json();
        setRoom(data);
      } catch (err) {
        setError(err.message || "Error fetching room details");
      } finally {
        setLoading(false);
      }
    }

    fetchRoomDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading room details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Room not found</p>
      </div>
    );
  }

  const handleBookNow = () => {
    if (room.availability) {
      router.push(`/payment/${id}`);
    } else {
      alert("This room is not available for booking.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2 mb-6 lg:mb-0">
          <img
            src={room.images?.[0] || "https://via.placeholder.com/500x400"}
            alt={room.name || "Room Image"}
            className="w-full h-72 object-cover rounded-lg"
          />
        </div>
        <div className="lg:w-1/2 lg:pl-8">
          <h1 className="text-3xl font-bold text-gray-800">{room.name}</h1>
          <p className="text-gray-600 mt-2">{room.description}</p>
          <p className="mt-4 text-indigo-600 font-bold">₹{room.price}/night</p>
          <p className={`mt-4 ${!room.availability ? 'text-red-600' : 'text-green-600'}`}>
            {room.availability ? 'Room Available' : 'Room Not Available'}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center">
            <Link href="/rooms">
              <button className="text-indigo-600 hover:underline">
                Back to Rooms
              </button>
            </Link>
            <button
              className={`sm:ml-4 mt-4 sm:mt-0 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${!room.availability ? 'cursor-not-allowed opacity-50' : ''}`}
              onClick={handleBookNow}
              disabled={!room.availability}
            >
              {room.availability ? 'Book Now' : 'Not Available'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
