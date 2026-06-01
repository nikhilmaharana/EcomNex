const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const FALLBACK_PRODUCT_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23111827'/%3E%3Cpath d='M150 285l90-95 70 72 44-48 96 71z' fill='%23374151'/%3E%3Ccircle cx='390' cy='135' r='42' fill='%234b5563'/%3E%3Ctext x='300' y='345' text-anchor='middle' font-family='Arial' font-size='28' fill='%23d1d5db'%3EProduct image%3C/text%3E%3C/svg%3E";
const FALLBACK_PROFILE_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'%3E%3Crect width='256' height='256' rx='128' fill='%23111827'/%3E%3Ccircle cx='128' cy='92' r='44' fill='%236d28d9'/%3E%3Cpath d='M48 220c13-45 43-70 80-70s67 25 80 70' fill='%234f46e5'/%3E%3C/svg%3E";

export const apiUrl = (path) => `${API_BASE_URL}${path}`;

export const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    _id: user._id || user.id || null,
    id: user.id || user._id || null,
  };
};

export const getProductImage = (product) => {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0];
  }

  return product.image || FALLBACK_PRODUCT_IMAGE;
};

export const normalizeProduct = (product) => ({
  ...product,
  title: product.title || product.name || "Untitled product",
  description: product.description || product.about || "",
  sellerName:
    product.sellerName ||
    product.seller?.businessName ||
    product.seller?.name ||
    "Ecomnex Seller",
  reviewCount: product.reviewCount || product.reviews?.length || 0,
  images:
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image].filter(Boolean),
});

export const getCurrentUser = () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return normalizeUser(currentUser);
  } catch {
    return null;
  }
};

export const getCurrentUserId = () => {
  const user = getCurrentUser();
  return user?._id || user?.id || null;
};

export const saveCurrentUser = (user) => {
  const normalized = normalizeUser(user);
  if (!normalized) return null;

  const existingUser = getCurrentUser();
  if (!normalized.token && existingUser?.token) {
    normalized.token = existingUser.token;
  }

  localStorage.setItem("currentUser", JSON.stringify(normalized));
  return normalized;
};

export const clearCurrentUser = () => {
  localStorage.removeItem("currentUser");
};

export const getAuthHeaders = (contentType = "application/json") => {
  const user = getCurrentUser();
  const headers = {};
  if (contentType) headers["Content-Type"] = contentType;
  if (user?.token) headers["Authorization"] = `Bearer ${user.token}`;

  return headers;
};

export const getProfileImage = (user) => user?.image || FALLBACK_PROFILE_IMAGE;

export const readImageFile = (file, maxBytes = 2 * 1024 * 1024) =>
  new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      reject(new Error("Please upload a valid image file."));
      return;
    }

    if (file.size > maxBytes) {
      reject(new Error("Image must be smaller than 2 MB."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read the image file."));
    reader.readAsDataURL(file);
  });
