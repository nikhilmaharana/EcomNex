import { Link } from "react-router-dom";
import { FaBoxOpen, FaCreditCard, FaHeadset, FaTruck } from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "../Footer";

const helpTopics = [
  {
    icon: <FaBoxOpen />,
    title: "Orders",
    text: "Review your orders, checkout details, and product status from your account.",
  },
  {
    icon: <FaTruck />,
    title: "Shipping",
    text: "Delivery fees and address details are confirmed before placing every order.",
  },
  {
    icon: <FaCreditCard />,
    title: "Payments",
    text: "Cash on delivery and saved checkout details are handled through the order page.",
  },
  {
    icon: <FaHeadset />,
    title: "Support",
    text: "Need help with a product, seller, or account? Send us a message directly.",
  },
];

const HelpCenter = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050816] px-4 py-24 text-white">
        <section className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
              Support
            </p>
            <h1 className="mt-2 text-4xl font-bold text-white">Help Center</h1>
            <p className="mt-3 max-w-2xl text-gray-400">
              Find quick help for shopping, seller accounts, checkout, and profile issues.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {helpTopics.map((topic) => (
              <article
                key={topic.title}
                className="rounded-xl border border-white/10 bg-[#111827] p-5"
              >
                <div className="mb-4 text-3xl text-purple-300">{topic.icon}</div>
                <h2 className="text-lg font-semibold">{topic.title}</h2>
                <p className="mt-2 text-sm leading-6 text-gray-400">{topic.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-purple-400/20 bg-purple-500/10 p-6">
            <h2 className="text-2xl font-semibold text-purple-200">Still stuck?</h2>
            <p className="mt-2 text-gray-300">
              Contact the EcomNex team and include your account email and order ID if you have one.
            </p>
            <Link
              to="/contact"
              className="mt-5 inline-block rounded-lg bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-500"
            >
              Contact Support
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HelpCenter;
