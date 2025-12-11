export async function sendBookingConfirmation(userEmail: string, bookingData: any) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'bookings@yourusername.resend.dev',
        to: userEmail,
        subject: '✅ Booking Confirmed - ' + bookingData.facility,
        html: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: Arial, sans-serif;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #4CAF50;">🎉 Booking Confirmed!</h1>
                <p><strong>Facility:</strong> ${bookingData.facility}</p>
                <p><strong>Date:</strong> ${bookingData.date}</p>
                <p><strong>Time:</strong> ${bookingData.time}</p>
                <p><strong>Duration:</strong> ${bookingData.hours} hour(s)</p>
              </div>
            </body>
          </html>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Email error:', data);
      return { success: false, error: data };
    }

    console.log('✅ Email sent:', data);
    return { success: true, data };
    
  } catch (error: any) {
    console.error('❌ Email failed:', error);
    return { success: false, error: error.message };
  }
}