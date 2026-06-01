import { useState } from "react";
import { apiUrl } from "../lib/api";
import Footer from "../Footer";
import Navbar from "./Navbar";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill all fields before sending your message.");
      return;
    }

    try {
      const res = await fetch(apiUrl("/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to send message");

      setStatus(data.message || "Message sent successfully.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err.message || "Unable to send message at this time.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-linear-to-br from-[#050507] via-[#0b0b1a] to-[#0a0a14] text-gray-200 font-sans h-180 mt-15">

        {/* HERO */}
        <div className="bg-linear-to-r from-purple-900 to-indigo-950 text-white text-center py-16 px-5">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-2 text-gray-200">We’d love to hear from you 💬</p>
        </div>

        {/* CONTAINER */}
        <div className="flex flex-wrap justify-center gap-10 py-12 px-5">

          {/* LEFT INFO */}
          <div className="bg-[#0b0b1a] p-8 rounded-2xl shadow-lg shadow-purple-900/30 w-75 backdrop-blur-md">
            <h2 className="text-2xl font-semibold text-purple-400 mb-3">
              Get in Touch
            </h2>
            <p className="text-gray-400 mb-2">
              Email: nikhilmaharana10@gmail.com
            </p>
            <p className="text-gray-400">
              Phone: +91 99389 56809
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[320px]">

            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="p-3 rounded-lg bg-[#0d0d18] border border-purple-700 text-white outline-none focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.4)]"
            />

            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="p-3 rounded-lg bg-[#0d0d18] border border-purple-700 text-white outline-none focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.4)]"
            />

            <textarea
              placeholder="Your Message"
              rows="5"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="p-3 rounded-lg bg-[#0d0d18] border border-purple-700 text-white outline-none focus:border-purple-500 focus:shadow-[0_0_10px_rgba(168,85,247,0.4)]"
            />

            {status && <p className="text-green-400 text-sm">{status}</p>}
            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              className="py-3 rounded-full bg-linear-to-r from-purple-700 to-indigo-700 text-white text-lg hover:scale-105 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
