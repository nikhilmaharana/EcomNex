import { useState } from "react";

const ProductInfo = ({ product, onAddToCart }) => {
  const [selectedColor, setSelectedColor] = useState("Blue");
  const [selectedStorage, setSelectedStorage] = useState(product.storage[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [pincode, setPincode] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("Enter a pincode to check local delivery.");
  const [statusMessage, setStatusMessage] = useState("");

  const discount = Math.round(
    ((selectedStorage.originalPrice - selectedStorage.price) / selectedStorage.originalPrice) * 100,
  );

  const updateQuantity = (amount) => {
    setQuantity((current) => Math.min(5, Math.max(1, current + amount)));
  };

  const handleDeliveryCheck = (event) => {
    event.preventDefault();

    if (pincode.trim().length !== 6) {
      setDeliveryMessage("Please enter a valid 6 digit pincode.");
      return;
    }

    setDeliveryMessage(`Delivery to ${pincode} is available in 2-4 business days.`);
  };

  const handleAddToCart = () => {
    onAddToCart(quantity);
    setStatusMessage(`${quantity} x ${product.name} ${selectedStorage.label} in ${selectedColor} added to cart.`);
  };

  const handleBuyNow = () => {
    setStatusMessage(`Checkout ready for ${product.name} ${selectedStorage.label} in ${selectedColor}.`);
  };

  return (
    <aside className="product-info" id="purchase-panel" aria-labelledby="product-title">
      <div className="product-badges">
        <span>{product.stock}</span>
        <span>{product.brand}</span>
      </div>

      <h1 id="product-title">{product.name}</h1>

      <div className="rating-row" aria-label={`${product.rating} out of 5 rating`}>
        <strong>{product.rating}</strong>
        <span>★★★★★</span>
        <a href="#reviews">{product.reviewCount.toLocaleString()} reviews</a>
      </div>

      <p className="product-summary">{product.shortDescription}</p>

      <div className="price-block">
        <span className="price">₹{selectedStorage.price.toLocaleString("en-IN")}</span>
        <span className="mrp">₹{selectedStorage.originalPrice.toLocaleString("en-IN")}</span>
        <span className="discount">{discount}% off</span>
      </div>

      <div className="option-group" aria-label="Choose color">
        <span className="option-label">Color: {selectedColor}</span>
        <div className="choice-row">
          {product.colors.map((color) => (
            <button
              className={selectedColor === color.name ? "choice swatch-choice is-selected" : "choice swatch-choice"}
              type="button"
              key={color.name}
              onClick={() => setSelectedColor(color.name)}
              aria-pressed={selectedColor === color.name}
            >
              <span className="swatch" style={{ background: color.value }} />
              {color.name}
            </button>
          ))}
        </div>
      </div>

      <div className="option-group" aria-label="Choose storage">
        <span className="option-label">Storage: {selectedStorage.label}</span>
        <div className="choice-row">
          {product.storage.map((storage) => (
            <button
              className={selectedStorage.label === storage.label ? "choice storage-choice is-selected" : "choice storage-choice"}
              type="button"
              key={storage.label}
              onClick={() => setSelectedStorage(storage)}
              aria-pressed={selectedStorage.label === storage.label}
            >
              <strong>{storage.label}</strong>
              <span>₹{storage.price.toLocaleString("en-IN")}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="quantity-row" aria-label="Choose quantity">
        <span className="option-label">Quantity</span>
        <div className="quantity-control">
          <button type="button" onClick={() => updateQuantity(-1)} disabled={quantity === 1}>
            -
          </button>
          <output>{quantity}</output>
          <button type="button" onClick={() => updateQuantity(1)} disabled={quantity === 5}>
            +
          </button>
        </div>
      </div>

      <div className="purchase-actions">
        <button className="primary-action" type="button" onClick={handleAddToCart}>
          Add to Cart
        </button>
        <button className="secondary-action" type="button" onClick={handleBuyNow}>
          Buy Now
        </button>
      </div>

      <div className="utility-actions">
        <button
          className={isWishlisted ? "utility-action is-active" : "utility-action"}
          type="button"
          onClick={() => setIsWishlisted((value) => !value)}
          aria-pressed={isWishlisted}
        >
          {isWishlisted ? "Saved" : "Save"}
        </button>
        <button
          className={isCompared ? "utility-action is-active" : "utility-action"}
          type="button"
          onClick={() => setIsCompared((value) => !value)}
          aria-pressed={isCompared}
        >
          {isCompared ? "Comparing" : "Compare"}
        </button>
      </div>

      <div className="delivery-card">
        <span>Delivery estimate</span>
        <form onSubmit={handleDeliveryCheck}>
          <input
            value={pincode}
            onChange={(event) => setPincode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            placeholder="Enter pincode"
            aria-label="Delivery pincode"
          />
          <button type="submit">Check</button>
        </form>
        <strong>{deliveryMessage}</strong>
      </div>

      <p className="status-message" aria-live="polite">
        {statusMessage || `Selected: ${selectedColor}, ${selectedStorage.label}, quantity ${quantity}.`}
      </p>
    </aside>
  );
};

export default ProductInfo;
