
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QrCode, Printer } from 'lucide-react';
import { generateQRCodeForResource } from '@/utils/qrCodeUtils';
import { Resource } from '@/data/mockData';

interface QRCodePrintProps {
  resource: Resource & { qrId?: string };
}

const QRCodePrint = ({ resource }: QRCodePrintProps) => {
  const [qrCodeImage, setQrCodeImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && (resource as any).qrId) {
      generateQRCodeForResource(resource.id)
        .then(setQrCodeImage)
        .catch(console.error);
    }
  }, [isOpen, resource.id, (resource as any).qrId]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = Array.from({ length: quantity }, (_, index) => `
      <div style="
        page-break-after: ${index < quantity - 1 ? 'always' : 'auto'};
        padding: 20px;
        text-align: center;
        font-family: Arial, sans-serif;
        width: 300px;
        margin: 0 auto;
        border: 2px solid #000;
        margin-bottom: 20px;
      ">
        <h3 style="margin: 10px 0; font-size: 16px;">${resource.title}</h3>
        <p style="margin: 5px 0; font-size: 12px; color: #666;">by ${resource.author}</p>
        <img src="${qrCodeImage}" alt="QR Code" style="width: 150px; height: 150px; margin: 10px 0;" />
        <p style="margin: 5px 0; font-size: 12px; font-weight: bold;">QR ID: ${(resource as any).qrId}</p>
        <p style="margin: 5px 0; font-size: 10px; color: #666;">Scan to view book details</p>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code Labels - ${resource.title}</title>
          <style>
            body { margin: 0; padding: 20px; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  if (!(resource as any).qrId) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <QrCode className="h-4 w-4 mr-2" />
          Print QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Print QR Code Labels</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            {qrCodeImage && (
              <img 
                src={qrCodeImage} 
                alt="QR Code Preview" 
                className="mx-auto border rounded"
                style={{ width: '200px', height: '200px' }}
              />
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Number of labels to print</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max="50"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>

          <div className="text-sm text-gray-600">
            <p><strong>Book:</strong> {resource.title}</p>
            <p><strong>QR ID:</strong> {(resource as any).qrId}</p>
          </div>

          <Button onClick={handlePrint} className="w-full">
            <Printer className="h-4 w-4 mr-2" />
            Print {quantity} Label{quantity > 1 ? 's' : ''}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodePrint;
