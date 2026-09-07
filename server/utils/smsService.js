/**
 * SMS Service for sending real OTP / SMS messages.
 * Supports:
 * 1. Fast2SMS (Indian SMS Gateway - FAST2SMS_API_KEY in .env)
 * 2. 2Factor (Indian SMS Gateway - TWO_FACTOR_API_KEY in .env)
 * 3. Twilio (Global SMS Gateway - TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env)
 */

export const sendSMS = async (phoneNumber, otpCode) => {
  // Clean phone number: remove spaces, dashes, +91 prefix for Indian gateways
  const cleanPhone = phoneNumber.replace(/[\s\-\+]/g, '');
  const indianNumber = cleanPhone.startsWith('91') && cleanPhone.length === 12 
    ? cleanPhone.slice(2) 
    : cleanPhone;

  // 1. Fast2SMS (Indian SMS Gateway)
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variables_values: otpCode,
          route: 'otp',
          numbers: indianNumber,
        }),
      });
      const data = await response.json();
      if (data.return === true || data.status_code === 200) {
        console.log(`[Fast2SMS] SUCCESS: SMS delivered to ${indianNumber}`);
        return { success: true, provider: 'fast2sms', data };
      } else {
        console.warn(`[Fast2SMS Notice] API returned:`, data.message || data);
      }
    } catch (err) {
      console.error('[Fast2SMS Error]', err.message);
    }
  }

  // 2. 2Factor.in SMS Gateway
  if (process.env.TWO_FACTOR_API_KEY) {
    try {
      const url = `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/${indianNumber}/${otpCode}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.Status === 'Success') {
        console.log(`[2Factor] SUCCESS: SMS delivered to ${indianNumber}, Session: ${data.Details}`);
        return { success: true, provider: '2factor', data };
      } else {
        console.warn(`[2Factor Notice] API returned:`, data);
      }
    } catch (err) {
      console.error('[2Factor Error]', err.message);
    }
  }

  // 3. Twilio
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${indianNumber}`;
      const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
      const params = new URLSearchParams({
        To: formattedPhone,
        From: process.env.TWILIO_PHONE_NUMBER,
        Body: `Your Bharat News verification code is: ${otpCode}. Valid for 10 minutes.`,
      });

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });
      const data = await response.json();
      console.log(`[Twilio] Sent to ${formattedPhone}:`, data);
      return { success: true, provider: 'twilio', data };
    } catch (err) {
      console.error('[Twilio Error]', err.message);
    }
  }

  // Default: Log to server terminal console if no SMS API gateway keys are in .env
  console.log(`========================================`);
  console.log(`[SMS DISPATCHER] To: ${phoneNumber}`);
  console.log(`[SMS DISPATCHER] OTP Code: ${otpCode}`);
  console.log(`[SMS DISPATCHER] To deliver real SMS to mobile, add FAST2SMS_API_KEY or TWILIO credentials in server/.env`);
  console.log(`========================================`);
  return { success: true, provider: 'console_simulation' };
};
