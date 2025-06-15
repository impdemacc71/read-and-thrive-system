
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QrCode, Printer } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import { generateQRCodeForResource, generateUniqueQRId } from '@/utils/qrCodeUtils';
import { Resource } from '@/data/mockData';

interface QRCodePrintProps {
  resource: Resource & { qrId?: string };
}

const QRCodePrint = ({ resource }: QRCodePrintProps) => {
  const [qrCodeImage, setQrCodeImage] = useState<string>('');
  const [barcodeImage, setBarcodeImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [resourceQrId, setResourceQrId] = useState<string>((resource as any).qrId || '');

  useEffect(() => {
    if (isOpen) {
      // Generate QR ID if it doesn't exist
      if (!resourceQrId) {
        const newQrId = generateUniqueQRId();
        setResourceQrId(newQrId);
      }
      
      generateQRCodeForResource(resource.id)
        .then(setQrCodeImage)
        .catch(console.error);
      
      // Generate Barcode image
      const barcodeValue = (resource as any).barcode;
      if (barcodeValue) {
        try {
          const canvas = document.createElement('canvas');
          JsBarcode(canvas, barcodeValue, {
            format: 'CODE128',
            displayValue: true,
            fontSize: 18,
            margin: 10,
            height: 60,
            width: 2,
          });
          setBarcodeImage(canvas.toDataURL('image/png'));
        } catch (error) {
          console.error("Failed to generate barcode:", error);
          setBarcodeImage('');
        }
      } else {
        setBarcodeImage('');
      }
    }
  }, [isOpen, resource, resourceQrId]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const barcodeHtml = barcodeImage
      ? `<img src="${barcodeImage}" alt="Barcode" style="display: block; margin: 10px auto;" />`
      : `<p style="margin: 5px 0; font-size: 12px; font-weight: bold; font-family: monospace;">Barcode: ${(resource as any).barcode || 'N/A'}</p>`;

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
        <img src="${qrCodeImage}" alt="QR Code" style="width: 150px; height: 150px; margin: 10px auto; display: block;" />
        <p style="margin: 5px 0; font-size: 12px; font-weight: bold;">QR ID: ${resourceQrId}</p>
        ${barcodeHtml}
        <p style="margin: 5px 0; font-size: 10px; color: #666;">Scan to view resource details</p>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>QR & Barcode Labels - ${resource.title}</title>
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <QrCode className="h-4 w-4 mr-2" />
          QR/Barcode
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Print QR & Barcode Labels</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 text-center">
            {qrCodeImage && (
              <div className="p-2 border rounded-lg">
                <Label className="text-xs text-muted-foreground">QR Code</Label>
                <img 
                  src={qrCodeImage} 
                  alt="QR Code Preview" 
                  className="mx-auto bg-white p-1"
                  style={{ width: '150px', height: '150px' }}
                />
              </div>
            )}
            {barcodeImage && (
              <div className="p-2 border rounded-lg">
                <Label className="text-xs text-muted-foreground">Barcode</Label>
                <img 
                  src={barcodeImage} 
                  alt="Barcode Preview" 
                  className="mx-auto bg-white p-2"
                />
              </div>
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

          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Resource:</strong> {resource.title}</p>
            <p><strong>QR ID:</strong> {resourceQrId || 'Auto-generated'}</p>
            <p><strong>Barcode:</strong> <span className="font-mono">{(resource as any).barcode || 'N/A'}</span></p>
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
