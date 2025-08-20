const express = require("express");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const router = express.Router();
const { Buffer } = require("buffer");

router.post("/send-ticket-email", async (req, res) => {
  const { ticket, showDetails } = req.body;

  try {
    if (!ticket || !showDetails) {
      return res.status(400).json({ success: false, message: "Missing ticket or show details" });
    }

    if (!ticket.email) {
      return res.status(400).json({ success: false, message: "No recipient email found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const generatePDFBuffer = () => {
      return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];

        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        doc.on("error", reject);

        doc.rect(10, 10, 575, 770).stroke();

        doc.fontSize(22).fillColor("#ed974c").text("Event Ticket", { align: "center" });
        doc.moveDown();

        doc.fillColor("black").fontSize(12);
        doc.text(`Booking ID: ${ticket._id}`);
        doc.text(`Show: ${showDetails.name}`);
        doc.text(`Place: ${showDetails.place}`);
        doc.text(`Hall: ${showDetails.hall}`);
        doc.text(`Date: ${showDetails.date}`);
        doc.text(`Time: ${showDetails.time}`);
        doc.text(`Total Paid: ₹${ticket.totalAmount}`);
        doc.moveDown();

        doc.font("Helvetica-Bold").text("Ticket Holders:");
        doc.font("Helvetica");
        ticket.ticketHolders?.forEach((holder, idx) => {
          doc.text(`${idx + 1}. ${holder}`);
        });
        doc.moveDown();

        doc.font("Helvetica-Bold").text("Contact Info:");
        doc.font("Helvetica");
        doc.text(`Email: ${ticket.email}`);
        doc.text(`Mobile: ${ticket.mobile}`);

        doc.end();
      });
    };

    const pdfBuffer = await generatePDFBuffer();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ed974c;">🎟️ Your Ticket Confirmation</h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 10px;">
          <p><b>Booking ID:</b> ${ticket._id}</p>
          <p><b>Show:</b> ${showDetails.name}</p>
          <p><b>Place:</b> ${showDetails.place}</p>
          <p><b>Hall:</b> ${showDetails.hall}</p>
          <p><b>Date:</b> ${showDetails.date}</p>
          <p><b>Time:</b> ${showDetails.time}</p>
          <p><b>Total Paid:</b> ₹${ticket.totalAmount}</p>

          <h3 style="color: #ed974c;">👥 Ticket Holders</h3>
          <ul>
            ${ticket.ticketHolders.map((h) => `<li>${h}</li>`).join("")}
          </ul>

          <p>📧 <b>Email:</b> ${ticket.email}</p>
          <p>📱 <b>Mobile:</b> ${ticket.mobile}</p>

          <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 5px;">
            <p style="margin: 0;">Thank you for booking with EventEase! 🎉</p>
          </div>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"EventEase" <${process.env.EMAIL_USER}>`,
      to: ticket.email,
      subject: `🎟️ Your EventEase Ticket - ${showDetails.name}`,
      html: htmlContent,
      attachments: [
        {
          filename: `Ticket_${ticket._id}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    res.json({ success: true, message: "Email with PDF sent!", messageId: info.messageId });
  } catch (err) {
    console.error("❌ Email error:", err);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

module.exports = router;
