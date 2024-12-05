"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";

export default function PaymentPage() {
  const { id } = useParams(); // Get room ID
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/rooms/${id}`);
        const data = await response.json();
        setRoom(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching room:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchRoom();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading room details...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Room not found.</p>
      </div>
    );
  }

  const handlePayment = () => {
    const options = {
      key: "rzp_test_KyJVvNWUBa5r0B", // Replace with your Razorpay key
      amount: room.price * 100, // Price in paise (1 INR = 100 paise)
      currency: "INR",
      name: room.name,
      description: room.description,
      image: room.image || "https://via.placeholder.com/400x300",
      handler: function (response) {
        // After successful payment, send data to backend
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
  
        fetch("http://localhost:5000/api/razorpay/capture-payment", { // Use your payment capture route here
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            signature: razorpay_signature,
            roomId: room._id, // Pass the room ID
            checkInDate: room.checkInDate,  // Pass check-in date
            checkOutDate: room.checkOutDate, // Pass check-out date
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Booking confirmed:", data);
            alert("Payment successful! Your booking is confirmed.");
            router.push("/success"); // Redirect to success page
  
            // Re-fetch room data to show updated availability
            fetch(`http://localhost:5000/api/rooms/${room._id}`)
              .then((res) => res.json())
              .then((updatedRoomData) => {
                setRoom(updatedRoomData); // Update room state with new availability
              });
          })
          .catch((error) => {
            console.error("Error processing booking:", error);
            alert("Error processing payment.");
          });
      },
      prefill: {
        name: "", // Pre-fill user details if available
        email: "",
        contact: "",
      },
      theme: {
        color: "#F37254",
      },
    };
  
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };
  

  return (
    <div className="container mx-auto px-4 py-8">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Booking Room</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <img
          src={room.image || "https://via.placeholder.com/400x300"}
          alt={room.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800">{room.name}</h2>
          <p className="text-gray-600">{room.description}</p>
          <p className="mt-2 text-indigo-600 font-bold">₹{room.price}/night</p>
          <button
            onClick={handlePayment}
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
