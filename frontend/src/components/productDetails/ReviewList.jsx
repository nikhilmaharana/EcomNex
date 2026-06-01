import ReviewCard from "./ReviewCard";
import { useState, useContext } from "react";
import { apiUrl, normalizeProduct } from "../../lib/api";
import { UserContext } from "../../context/UserContext";

const ReviewList = ({ product, onProductUpdated }) => {
  const { user } = useContext(UserContext);
  const reviews = product?.reviews || [];
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id || user.role !== "buyer") {
      setMessage("Login as a buyer to add a review.");
      return;
    }

    if (!comment.trim()) {
      setMessage("Write a short review first.");
      return;
    }

    try {
      const res = await fetch(apiUrl(`/products/${product._id}/reviews`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name || "Buyer",
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add review");

      onProductUpdated(normalizeProduct(data));
      setComment("");
      setRating(5);
      setMessage("Review added");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl text-white font-semibold">
          Customer Reviews
        </h2>

        <span className="text-sm text-yellow-300">
          ⭐ {product?.rating || 0} from {reviews.length} reviews
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-white outline-none"
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} Star{value > 1 ? "s" : ""}
              </option>
            ))}
          </select>

          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your product experience"
            className="flex-1 bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-white outline-none"
          />

          <button className="bg-purple-600 px-4 py-2 rounded-lg text-white hover:bg-purple-700 transition">
            Add Review
          </button>
        </div>

        {message && <p className="text-sm text-cyan-300">{message}</p>}
      </form>

      {reviews.length === 0 && (
        <div className="text-gray-400">
          No reviews yet.
        </div>
      )}

      {reviews.map((rev, index) => (
        <ReviewCard key={index} review={rev} />
      ))}
    </div>
  );
};

export default ReviewList;
