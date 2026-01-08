import PublicLayout from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <Card className="bg-background/50 border-border/50">
            <CardContent className="p-6 space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  ZiroKash ("we", "our", or "us") respects your privacy and is committed to protecting your personal data. 
                  This privacy policy will inform you as to how we look after your personal data when you visit our website 
                  or use our services and tell you about your privacy rights.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Data We Collect</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Identity Data (name, username, etc.)</li>
                  <li>Contact Data (email address, telephone numbers)</li>
                  <li>Financial Data (payment card details, transaction history)</li>
                  <li>Technical Data (IP address, browser type)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. How We Use Your Data</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We will only use your personal data when the law allows us to. Most commonly, we will use your personal data 
                  to provide our services, process payments, and improve our platform security.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We have put in place appropriate security measures to prevent your personal data from being accidentally lost, 
                  used or accessed in an unauthorized way, altered or disclosed.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
