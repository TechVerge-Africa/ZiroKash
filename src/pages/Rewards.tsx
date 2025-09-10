import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gift, 
  Users, 
  Trophy, 
  Star, 
  Share2, 
  Copy,
  Medal,
  Target,
  Zap
} from "lucide-react";

export default function Rewards() {
  const [referralCode] = useState("ZIRO2024USER");
  const [inviteEmail, setInviteEmail] = useState("");

  const currentUser = {
    points: 2450,
    tier: "Gold",
    referrals: 5,
    nextTierPoints: 3000
  };

  const leaderboard = [
    { rank: 1, name: "Sarah Johnson", points: 15840, tier: "Diamond" },
    { rank: 2, name: "Mike Chen", points: 12350, tier: "Platinum" },
    { rank: 3, name: "Alex Rodriguez", points: 9870, tier: "Gold" },
    { rank: 4, name: "Emily Davis", points: 8450, tier: "Gold" },
    { rank: 5, name: "You", points: 2450, tier: "Gold" },
    { rank: 6, name: "David Wilson", points: 2200, tier: "Silver" },
    { rank: 7, name: "Lisa Brown", points: 1980, tier: "Silver" }
  ];

  const rewards = [
    {
      id: 1,
      name: "5% Cashback",
      points: 500,
      description: "Get 5% cashback on your next transaction",
      category: "Cashback"
    },
    {
      id: 2,
      name: "Free Transfer",
      points: 200,
      description: "One free international transfer",
      category: "Transfer"
    },
    {
      id: 3,
      name: "Premium Support",
      points: 1000,
      description: "24/7 premium customer support for 30 days",
      category: "Support"
    },
    {
      id: 4,
      name: "$10 Bonus",
      points: 1500,
      description: "Get $10 added to your wallet",
      category: "Bonus"
    },
    {
      id: 5,
      name: "Investment Bonus",
      points: 2000,
      description: "10% bonus on your next investment",
      category: "Investment"
    }
  ];

  const recentActivity = [
    {
      action: "Referred a friend",
      points: "+500",
      date: "2024-01-20",
      type: "earned"
    },
    {
      action: "Redeemed Free Transfer",
      points: "-200",
      date: "2024-01-19",
      type: "redeemed"
    },
    {
      action: "Monthly transaction bonus",
      points: "+300",
      date: "2024-01-18",
      type: "earned"
    }
  ];

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    // Add toast notification
  };

  const sendInvite = () => {
    if (inviteEmail) {
      // Send invite logic
      alert(`Invite sent to ${inviteEmail}`);
      setInviteEmail("");
    }
  };

  const progressToNextTier = ((currentUser.points / currentUser.nextTierPoints) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rewards & Loyalty</h1>
        <p className="text-muted-foreground mt-2">
          Earn points, refer friends, and unlock exclusive rewards
        </p>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold text-primary">{currentUser.points.toLocaleString()}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Tier</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{currentUser.tier}</p>
                  <Badge variant="default">
                    <Medal className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Referrals</p>
                <p className="text-2xl font-bold">{currentUser.referrals}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Next Tier */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Progress to Platinum Tier</span>
          </CardTitle>
          <CardDescription>
            Earn {currentUser.nextTierPoints - currentUser.points} more points to unlock Platinum benefits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressToNextTier} className="mb-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{currentUser.points} points</span>
            <span>{currentUser.nextTierPoints} points</span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="rewards" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rewards">Rewards Store</TabsTrigger>
          <TabsTrigger value="referral">Referral Program</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="rewards">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Rewards</CardTitle>
                <CardDescription>
                  Redeem your points for exclusive benefits and bonuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rewards.map((reward) => (
                    <div key={reward.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{reward.name}</h3>
                          <Badge variant="outline" className="mt-1">{reward.category}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">{reward.points}</div>
                          <div className="text-xs text-muted-foreground">points</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                      <Button 
                        className="w-full" 
                        variant={currentUser.points >= reward.points ? "default" : "secondary"}
                        disabled={currentUser.points < reward.points}
                      >
                        {currentUser.points >= reward.points ? "Redeem" : "Insufficient Points"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                      <div className={`font-semibold ${
                        activity.type === "earned" ? "text-green-500" : "text-red-500"
                      }`}>
                        {activity.points}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="referral">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gift className="h-5 w-5" />
                  <span>Referral Program</span>
                </CardTitle>
                <CardDescription>
                  Earn 500 points for every friend you refer to ZiroKash
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="referralCode">Your Referral Code</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="referralCode"
                      value={referralCode}
                      readOnly
                      className="font-mono"
                    />
                    <Button onClick={copyReferralCode} variant="outline">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="inviteEmail">Invite by Email</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="inviteEmail"
                      type="email"
                      placeholder="friend@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                    <Button onClick={sendInvite}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    How It Works
                  </h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Share your referral code with friends</li>
                    <li>• They sign up and complete KYC verification</li>
                    <li>• Both of you earn 500 points instantly!</li>
                    <li>• No limit on referrals - invite as many as you want</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Monthly Leaderboard</span>
              </CardTitle>
              <CardDescription>
                See how you rank against other ZiroKash users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((user) => (
                  <div 
                    key={user.rank} 
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      user.name === "You" ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        user.rank === 1 ? "bg-yellow-500 text-white" :
                        user.rank === 2 ? "bg-gray-400 text-white" :
                        user.rank === 3 ? "bg-orange-500 text-white" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {user.rank}
                      </div>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <Badge variant="outline">{user.tier}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{user.points.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}