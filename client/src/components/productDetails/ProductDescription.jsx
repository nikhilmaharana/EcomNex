const ProductDescription = ({ description, highlights, specs }) => {
  return (
    <section className="product-section product-details-grid" id="details" aria-labelledby="details-title">
      <div className="section-copy">
        <p className="section-kicker">Details</p>
        <h2 id="details-title">Designed for a premium shopping experience</h2>
        <p>{description}</p>
      </div>

      <div className="detail-card">
        <h3>Highlights</h3>
        <ul className="highlight-list">
          {highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="detail-card spec-card">
        <h3>Specifications</h3>
        <dl>
          {specs.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default ProductDescription;
