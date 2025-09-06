'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Link, MapPin, Eye, Calendar, QrCode, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedLink {
  id: string;
  originalUrl: string;
  trackingUrl: string;
  title: string;
  createdAt: string;
  clicks: number;
  expiresAt?: string;
}

interface LocationData {
  id: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  timestamp: string;
  userAgent: string;
  ip: string;
}

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [expiryDays, setExpiryDays] = useState('');
  const [generatedLink, setGeneratedLink] = useState<GeneratedLink | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentLinks, setRecentLinks] = useState<GeneratedLink[]>([
    {
      id: 'demo1',
      originalUrl: 'https://example.com',
      trackingUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/track/demo1`,
      title: 'Demo Link 1',
      createdAt: '2024-01-15T10:30:00Z',
      clicks: 23,
      expiresAt: '2024-02-15T10:30:00Z'
    },
    {
      id: 'demo2',
      originalUrl: 'https://google.com',
      trackingUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/track/demo2`,
      title: 'Demo Link 2',
      createdAt: '2024-01-14T15:45:00Z',
      clicks: 7
    }
  ]);

  const generateLink = async () => {
    if (!url) {
      toast.error('Please enter a URL to track');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const linkId = Math.random().toString(36).substring(2, 15);
      const trackingUrl = `${window.location.origin}/track/${linkId}`;
      
      const newLink: GeneratedLink = {
        id: linkId,
        originalUrl: url,
        trackingUrl,
        title: title || 'Untitled Link',
        createdAt: new Date().toISOString(),
        clicks: 0,
        expiresAt: expiryDays ? new Date(Date.now() + parseInt(expiryDays) * 24 * 60 * 60 * 1000).toISOString() : undefined
      };

      setGeneratedLink(newLink);
      setRecentLinks(prev => [newLink, ...prev.slice(0, 4)]);
      
      toast.success('Tracking link generated successfully!');
    } catch (error) {
      toast.error('Failed to generate tracking link');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              LinkTracker Pro
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Generate trackable links and monitor location data of visitors in real-time
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="generator" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="generator" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                Link Generator
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
            </TabsList>

            {/* Link Generator Tab */}
            <TabsContent value="generator" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Generator Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Link className="h-5 w-5" />
                      Create Tracking Link
                    </CardTitle>
                    <CardDescription>
                      Enter a URL to generate a trackable link that captures visitor location data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="url">Target URL *</Label>
                      <Input
                        id="url"
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="title">Link Title (Optional)</Label>
                      <Input
                        id="title"
                        placeholder="My Campaign Link"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry (Days)</Label>
                      <Input
                        id="expiry"
                        type="number"
                        placeholder="30"
                        value={expiryDays}
                        onChange={(e) => setExpiryDays(e.target.value)}
                      />
                    </div>

                    <Button 
                      onClick={generateLink} 
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? 'Generating...' : 'Generate Tracking Link'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Generated Link Display */}
                {generatedLink && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <QrCode className="h-5 w-5" />
                        Link Generated Successfully!
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Tracking URL</Label>
                        <div className="flex gap-2">
                          <Input 
                            value={generatedLink.trackingUrl} 
                            readOnly 
                            className="font-mono text-sm"
                          />
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyToClipboard(generatedLink.trackingUrl)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-xs text-gray-500">Original URL</Label>
                          <p className="truncate">{generatedLink.originalUrl}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Created</Label>
                          <p>{formatDate(generatedLink.createdAt)}</p>
                        </div>
                      </div>

                      <Alert>
                        <MapPin className="h-4 w-4" />
                        <AlertDescription>
                          This link will capture visitor location data with their consent before redirecting to the target URL.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Recent Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Links</CardTitle>
                  <CardDescription>Your recently generated tracking links</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentLinks.map((link) => (
                      <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{link.title}</h4>
                            <Badge variant="secondary">{link.clicks} clicks</Badge>
                          </div>
                          <p className="text-sm text-gray-500 truncate">{link.originalUrl}</p>
                          <p className="text-xs text-gray-400">Created {formatDate(link.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyToClipboard(link.trackingUrl)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(`/dashboard/${link.id}`, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Links</CardTitle>
                    <Link className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">+2 from last week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground">+15% from last week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unique Locations</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">89</div>
                    <p className="text-xs text-muted-foreground">Across 23 countries</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest location data from your tracking links</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { city: 'New York', country: 'USA', time: '2 minutes ago', link: 'Demo Link 1' },
                      { city: 'London', country: 'UK', time: '5 minutes ago', link: 'Demo Link 2' },
                      { city: 'Tokyo', country: 'Japan', time: '12 minutes ago', link: 'Demo Link 1' },
                      { city: 'Sydney', country: 'Australia', time: '18 minutes ago', link: 'Demo Link 1' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="font-medium">{activity.city}, {activity.country}</p>
                            <p className="text-sm text-gray-500">{activity.link}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{activity.time}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}