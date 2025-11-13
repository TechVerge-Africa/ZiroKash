import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  HelpCircle,
  Search,
  Book,
  Video,
  FileText,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");

  const faqItems = [
    {
      question: "How do I verify my account?",
      answer: "To verify your account, go to Settings > Verification and upload your ID document and take a selfie. Verification usually takes 24-48 hours.",
      category: "Account"
    },
    {
      question: "What are the transfer limits?",
      answer: "Daily transfer limits depend on your verification level: Basic ($100), Verified ($1,000), Premium ($10,000).",
      category: "Transfers"
    },
    {
      question: "How do I enable two-factor authentication?",
      answer: "Go to Security Settings and toggle on 2FA. You can use SMS or an authenticator app for additional security.",
      category: "Security"
    },
    {
      question: "What fees apply to transactions?",
      answer: "Local transfers are free. International transfers have a 1% fee (minimum $2). Currency exchange has a 0.5% spread.",
      category: "Fees"
    },
    {
      question: "How do I recover my forgotten PIN?",
      answer: "Go to Security Settings > Reset PIN. You'll need to verify your identity via email or SMS to set a new PIN.",
      category: "Security"
    }
  ];

  const supportTickets = [
    {
      id: "TKT001",
      subject: "Unable to complete KYC verification",
      status: "Open",
      priority: "High",
      created: "2024-01-20",
      lastUpdate: "2024-01-20"
    },
    {
      id: "TKT002",
      subject: "Transaction not reflected in wallet",
      status: "In Progress",
      priority: "Medium",
      created: "2024-01-18",
      lastUpdate: "2024-01-19"
    },
    {
      id: "TKT003",
      subject: "Request for higher transfer limits",
      status: "Resolved",
      priority: "Low",
      created: "2024-01-15",
      lastUpdate: "2024-01-16"
    }
  ];

  const filteredFAQ = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const submitTicket = () => {
    if (ticketSubject && ticketMessage) {
      alert("Support ticket submitted successfully!");
      setTicketSubject("");
      setTicketMessage("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground mt-2">
          Get help with your ZiroKash account and find answers to common questions
        </p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Chat with our support team in real-time
            </p>
            <Badge variant="default">Online</Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Phone className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Phone Support</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Call us for immediate assistance
            </p>
            <p className="font-mono text-sm">+234 800 ZIROKASH</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Send us an email for detailed help
            </p>
            <p className="text-sm">support@zirokash.com</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5" />
                <span>Frequently Asked Questions</span>
              </CardTitle>
              <CardDescription>
                Find quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search FAQ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-4">
                {filteredFAQ.map((item, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{item.question}</h3>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>My Support Tickets</CardTitle>
              <CardDescription>
                Track your support requests and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{ticket.subject}</h3>
                        <p className="text-sm text-muted-foreground">
                          Ticket ID: {ticket.id} • Created: {ticket.created}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge 
                          variant={
                            ticket.status === "Resolved" ? "default" :
                            ticket.status === "In Progress" ? "secondary" : 
                            "destructive"
                          }
                        >
                          {ticket.status}
                        </Badge>
                        <Badge variant="outline">{ticket.priority}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {ticket.lastUpdate}
                    </p>
                  </div>
                ))}
                <Button className="w-full">View All Tickets</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Book className="h-5 w-5" />
                  <span>User Guides</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>Getting Started with ZiroKash</span>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>How to Send Money</span>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>Setting Up Security Features</span>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>Understanding Fees and Limits</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Video className="h-5 w-5" />
                  <span>Video Tutorials</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <Video className="h-4 w-4 text-primary" />
                  <span>Account Setup Walkthrough</span>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <Video className="h-4 w-4 text-primary" />
                  <span>KYC Verification Process</span>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <Video className="h-4 w-4 text-primary" />
                  <span>Making Your First Transfer</span>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <Video className="h-4 w-4 text-primary" />
                  <span>Mobile App Features</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Request</CardTitle>
              <CardDescription>
                Can't find what you're looking for? Send us a message and we'll help you out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Please provide as much detail as possible about your issue..."
                  rows={5}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">
                  We typically respond within 24 hours
                </span>
              </div>
              <Button onClick={submitTicket} className="w-full">
                Submit Support Request
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Support Hours</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Live Chat</span>
                <span>24/7</span>
              </div>
              <div className="flex justify-between">
                <span>Phone Support</span>
                <span>8AM - 10PM (WAT)</span>
              </div>
              <div className="flex justify-between">
                <span>Email Support</span>
                <span>24/7 (24hr response)</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}