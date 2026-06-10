import nodemailer from 'nodemailer';

// @POST /api/contact
export const sendMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ message: 'Ad, e-posta ve mesaj zorunludur' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from:    `"Çanta Dolusu İletişim" <${process.env.EMAIL_USER}>`,
      to:      process.env.EMAIL_TO,
      subject: `[İletişim Formu] ${subject || 'Yeni Mesaj'} - ${name}`,
      html: `
        <h2>Yeni İletişim Formu Mesajı</h2>
        <p><b>Ad Soyad:</b> ${name}</p>
        <p><b>E-posta:</b> ${email}</p>
        <p><b>Telefon:</b> ${phone || '-'}</p>
        <p><b>Konu:</b> ${subject || '-'}</p>
        <hr/>
        <p><b>Mesaj:</b></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `
    });

    // Kullanıcıya otomatik yanıt
    await transporter.sendMail({
      from:    `"Çanta Dolusu" <${process.env.EMAIL_USER}>`,
      to:      email,
      subject: 'Mesajınızı Aldık – Çanta Dolusu',
      html: `
        <p>Merhaba ${name},</p>
        <p>Mesajınız tarafımıza ulaştı. En kısa sürede size dönüş yapacağız.</p>
        <br/>
        <p>Saygılarımızla,<br/>Çanta Dolusu Ekibi</p>
      `
    });

    res.json({ message: 'Mesajınız başarıyla gönderildi' });
  } catch (err) {
    console.error('Mail hatası:', err);
    res.status(500).json({ message: 'Mesaj gönderilemedi, lütfen tekrar deneyin' });
  }
};
