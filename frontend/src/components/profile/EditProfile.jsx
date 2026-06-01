import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import Footer from "../../Footer";
import Navbar from "../Navbar";
import { apiUrl, getProfileImage, readImageFile, saveCurrentUser, getAuthHeaders } from "../../lib/api";


const EditProfile = () => {

  const { user, setUser } = useContext(UserContext);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    try {
      const image = await readImageFile(e.target.files?.[0]);
      if (image) setUser({ ...user, image });
      setMessage("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleSave = async () => {
    if (!user?._id) {
      setMessage("Please login again before saving your profile.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const res = await fetch(apiUrl(`/auth/users/${user._id}`), {
        method: "PATCH",
        headers: getAuthHeaders("application/json"),
        body: JSON.stringify({
          name: user.name,
          businessName: user.businessName,
          email: user.email,
          phone: user.phone,
          location: user.location,
          address: user.address,
          image: user.image,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Profile update failed");

      const saved = saveCurrentUser({ ...data.user, token: user.token });
      if (saved) setUser(saved);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-linear-to-br from-[#050507] via-[#0b0b1a] to-[#0a0a14] text-white px-4 py-20">

      <h1 className="text-4xl font-bold text-center text-purple-400 mb-10">
        Edit Profile
      </h1>

      <div className="max-w-3xl mx-auto bg-[#0b0b1a] border border-purple-900/20 rounded-3xl p-8 shadow-xl shadow-purple-900/20">

        {/* IMAGE */}
        <div className="flex justify-center mb-8">

          <img
            src={getProfileImage(user)}
            alt={user?.name ? `${user.name} profile image` : "Profile image"}
            className="w-32 h-32 rounded-full border-4 border-purple-700 object-cover"
          />

        </div>
        
        <div className="mb-6">

  <label className="text-purple-400 block mb-2">
    Profile Image
  </label>

  <label className="block w-full cursor-pointer bg-[#111122] border border-purple-900/20 rounded-xl p-4 outline-none hover:border-purple-500 transition">
    <span className="text-gray-300">
      {user.image ? "Change uploaded image" : "Upload profile image"}
    </span>
    <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
  </label>

</div>

        {/* FORM */}
        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="text-purple-400 block mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full bg-[#111122] border border-purple-900/20 rounded-xl p-4 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-purple-400 block mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full bg-[#111122] border border-purple-900/20 rounded-xl p-4 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-purple-400 block mb-2">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="w-full bg-[#111122] border border-purple-900/20 rounded-xl p-4 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-purple-400 block mb-2">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={user.location}
              onChange={handleChange}
              className="w-full bg-[#111122] border border-purple-900/20 rounded-xl p-4 outline-none focus:border-purple-500"
            />
          </div>

        </div>

        {/* ADDRESS */}
        <div className="mt-6">

          <label className="text-purple-400 block mb-2">
            Address
          </label>

          <textarea
            rows="4"
            name="address"
            value={user.address}
            onChange={handleChange}
            className="w-full bg-[#111122] border border-purple-900/20 rounded-xl p-4 outline-none focus:border-purple-500"
          />

        </div>

        {/* BUTTON */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-8 bg-linear-to-r from-purple-700 to-indigo-700 py-4 rounded-2xl hover:opacity-90 transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-purple-200">{message}</p>
        )}

      </div>
    </div>
    <Footer/>
    </>
  );
};

export default EditProfile;
