import PublicLayout from "@/components/layout/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <Card className="bg-background/50 border-border/50">
            <CardContent className="p-6 space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Agreement to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using ZiroKash, you agree to be bound by these Terms of Service and our Privacy Policy. 
                  If you disagree with any part of the terms, you may not access the service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Acceptable Use</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to use ZiroKash only for lawful purposes and in accordance with these Terms. You agree not to use 
                  the service for any illegal or unauthorized purpose, including but not limited to fraud, money laundering, 
                  or the sale of prohibited goods.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Account Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You are responsible for maintaining the security of your account and password. ZiroKash cannot and will not 
                  be liable for any loss or damage from your failure to comply with this security obligation.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall ZiroKash, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                  be liable for any indirect, incidental, special, consequential or punitive damages.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
