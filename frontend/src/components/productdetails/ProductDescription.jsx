const ProductDescription = ({ description }) => {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl text-gray-300">
      <h2 className="text-xl font-semibold text-white mb-3">
        Product Details
      </h2>
      <p className="leading-relaxed">{description}</p>
    </div>
  );
};

export default ProductDescription;