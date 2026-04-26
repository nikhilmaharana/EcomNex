import ReviewCard from "./ReviewCard";

const ReviewList = ({ reviews, rating, reviewCount }) => {
  return (
    <section className="product-section review-section" id="reviews" aria-labelledby="reviews-title">
      <div className="review-summary">
        <p className="section-kicker">Reviews</p>
        <h2 id="reviews-title">Loved by recent buyers</h2>
        <div className="rating-panel">
          <strong>{rating}</strong>
          <span>★★★★★</span>
          <small>{reviewCount.toLocaleString()} total reviews</small>
        </div>
      </div>

      <div className="review-grid">
        {reviews.map((rev) => (
          <ReviewCard key={`${rev.user}-${rev.comment}`} review={rev} />
        ))}
      </div>
    </section>
  );
};

export default ReviewList;
