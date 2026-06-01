import nodemailer from "nodemailer";

const getTransporter = () => {
  const {
    EMAIL_SERVICE,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
  } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    return null;
  }

  if (EMAIL_SERVICE) {
    return nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }

  if (!EMAIL_HOST || !EMAIL_PORT) {
      return null;
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: Number(EMAIL_PORT) === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
};

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email and message are required",
      });
    }

    const transporter = getTransporter();
    const contactEmail = process.env.CONTACT_EMAIL || "nikhilmaharana10@gmail.com";

    if (!transporter) {
      console.warn(
        "Email transporter not configured. Skipping actual send and returning success response."
      );
      return res.json({
        message:
          "Your message was received. Email delivery is disabled in this environment.",
      });
    }

    await transporter.sendMail({
      from: `${name} <${email}>`,
      to: contactEmail,
      subject: `Contact request from ${name}`,
      text: `${message}\n\nFrom: ${name} <${email}>`,
      html: `
        <p>${message}</p>
        <hr />
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
      `,
    });

    res.json({ message: "Your message was sent successfully." });
  } catch (err) {
    console.error("Contact email error:", err);
    res.status(500).json({
      message:
        err.message || "Unable to send message. Please try again later.",
    });
  }
};
