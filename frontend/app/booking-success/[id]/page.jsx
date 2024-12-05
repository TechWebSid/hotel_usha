// app/booking-success/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function BookingSuccess() {
  const router = useRouter();
  const { id } = router.query;
  const [room, setRoom] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchRoomDetails() {
      try {
        const response = await fetch(`http://localhost:5000/api/rooms/${id}`);
        const data = await response.json();
        if (response.ok) {
          setRoom(data);
        }
      } catch (error) {
        console.error("Error fetching room details", error);
      }
    }

    fetchRoomDetails();
  }, [id]);

  if (!room) {
    return <p>Room details not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-600">Booking Successful!</h1>
      <p className="mt-4 text-lg">You have successfully booked the room: {room.name}</p>
      <p className="mt-4">Enjoy your stay at {room.name}!</p>
      <div className="mt-6">
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
