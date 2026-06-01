import ReviewCard from "./ReviewCard";

const ReviewList = ({ reviews }) => {
  // handle empty or undefined
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-gray-400">
        No reviews yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl text-white font-semibold">
        Customer Reviews
      </h2>

      {reviews.map((rev, index) => (
        <ReviewCard key={index} review={rev} />
      ))}
    </div>
  );
};

export default ReviewList;