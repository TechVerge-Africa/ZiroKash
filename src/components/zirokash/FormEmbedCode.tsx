import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Code, Link as LinkIcon } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FormEmbedCodeProps {
  formId: string;
}

export default function FormEmbedCode({ formId }: FormEmbedCodeProps) {
  const baseUrl = window.location.origin;
  const formUrl = `${baseUrl}/pay/${formId}`;
  
  const embedCode = `<iframe src="${formUrl}" width="100%" height="800" frameborder="0"></iframe>`;
  
  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Pay via: ${formUrl}`)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Pay via: ${formUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(formUrl)}`
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="link">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="link">Link</TabsTrigger>
          <TabsTrigger value="embed">Embed</TabsTrigger>
          <TabsTrigger value="qr">QR Code</TabsTrigger>
        </TabsList>

        <TabsContent value="link" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Payment Link
              </CardTitle>
              <CardDescription>Share this link to receive payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border rounded-md bg-muted"
                />
                <Button onClick={() => copyToClipboard(formUrl, 'Link')}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(shareLinks.whatsapp, '_blank')}
                >
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(shareLinks.twitter, '_blank')}
                >
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(shareLinks.facebook, '_blank')}
                >
                  Facebook
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="embed">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Embed Code
              </CardTitle>
              <CardDescription>Add this code to your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <pre className="flex-1 p-3 bg-muted rounded-md overflow-x-auto text-sm">
                  <code>{embedCode}</code>
                </pre>
                <Button onClick={() => copyToClipboard(embedCode, 'Embed code')}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr">
          <Card>
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
              <CardDescription>Scan to pay</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG value={formUrl} size={200} />
              </div>
              <Button onClick={() => {
                const svg = document.querySelector('svg');
                if (svg) {
                  const svgData = new XMLSerializer().serializeToString(svg);
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  const img = new Image();
                  img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx?.drawImage(img, 0, 0);
                    const pngFile = canvas.toDataURL('image/png');
                    const downloadLink = document.createElement('a');
                    downloadLink.download = 'qr-code.png';
                    downloadLink.href = pngFile;
                    downloadLink.click();
                  };
                  img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                }
              }}>
                Download QR Code
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}