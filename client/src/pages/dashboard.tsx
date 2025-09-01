import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Settings } from "lucide-react";
import StatsCards from "@/components/stats-cards";
import UrlDetection from "@/components/url-detection";
import ScreenshotAnalysis from "@/components/screenshot-analysis";
import ScanHistory from "@/components/scan-history";
import FeedbackSystem from "@/components/feedback-system";
import type { AnalysisResult } from "@/lib/types";

export default function Dashboard() {
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [currentScanId, setCurrentScanId] = useState<number | null>(null);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setCurrentScanId(result.scanId);
    setFeedbackVisible(true);
  };

  const closeFeedback = () => {
    setFeedbackVisible(false);
    setCurrentScanId(null);

const Dashboard = () => {
  return null;  
};

  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">PhishGuard</h1>
                <p className="text-xs text-gray-500">Advanced Phishing Detection</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards />

        {/* Detection Interface */}
        <Card className="shadow-sm border border-gray-200 overflow-hidden">
          <Tabs defaultValue="url" className="w-full">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <TabsList className="h-auto p-0 bg-transparent">
                <div className="flex space-x-8 px-6">
                  <TabsTrigger
                    value="url"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 py-4 px-1 text-sm font-medium data-[state=active]:text-blue-600 data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 border-b-2 border-transparent"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    URL Detection
                  </TabsTrigger>
                  <TabsTrigger
                    value="screenshot"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 py-4 px-1 text-sm font-medium data-[state=active]:text-blue-600 data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 border-b-2 border-transparent"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    Screenshot Analysis
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 py-4 px-1 text-sm font-medium data-[state=active]:text-blue-600 data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700 border-b-2 border-transparent"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Scan History
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>

            {/* Tab Content */}
            <CardContent className="p-6">
              <TabsContent value="url" className="mt-0">
                <UrlDetection onAnalysisComplete={handleAnalysisComplete} />
              </TabsContent>

              <TabsContent value="screenshot" className="mt-0">
                <ScreenshotAnalysis onAnalysisComplete={handleAnalysisComplete} />
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <ScanHistory />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Feedback Section */}
        {currentScanId && (
          <FeedbackSystem
            scanId={currentScanId}
            visible={feedbackVisible}
            onClose={closeFeedback}
          />
        )}
      </main>
    </div>
  );
}
