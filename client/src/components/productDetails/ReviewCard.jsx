const ReviewCard = ({ review }) => {
  return (
    <article className="review-card">
      <div className="review-card-header">
        <div>
          <strong>{review.user}</strong>
          <span>{review.date}</span>
        </div>
        <span className="review-rating">{review.rating}.0</span>
      </div>
      <div className="stars" aria-label={`${review.rating} out of 5 stars`}>
        {"★".repeat(review.rating)}
      </div>
      <p>{review.comment}</p>
    </article>
  );
};

export default ReviewCard;
