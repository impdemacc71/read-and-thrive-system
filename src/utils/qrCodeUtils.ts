
import QRCode from 'qrcode';

export const generateQRCodeForResource = async (resourceId: string): Promise<string> => {
  try {
    // Generate QR code that links to the book details page
    const url = `${window.location.origin}/book/${resourceId}`;
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export const generateUniqueQRId = (): string => {
  // Generate a unique QR ID with timestamp and random string
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `QR${timestamp}${randomStr}`.toUpperCase();
};
