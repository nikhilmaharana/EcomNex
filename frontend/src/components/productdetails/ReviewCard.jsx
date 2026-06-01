const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl hover:scale-[1.02] transition">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-white">{review.name}</h3>
        <span className="text-yellow-400">⭐ {review.rating}</span>
      </div>

      <p className="text-gray-400 text-sm">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;