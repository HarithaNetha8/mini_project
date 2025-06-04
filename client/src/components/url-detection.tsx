import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Globe, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { AnalysisResult } from "@/lib/types";

interface UrlDetectionProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export default function UrlDetection({ onAnalysisComplete }: UrlDetectionProps) {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeUrlMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/analyze/url", { url });
      return response.json() as Promise<AnalysisResult>;
    },
    onSuccess: (data) => {
      setResult(data);
      onAnalysisComplete(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      analyzeUrlMutation.mutate(url.trim());
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "safe":
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case "phishing":
        return <AlertCircle className="h-8 w-8 text-red-600" />;
      case "suspicious":
        return <AlertTriangle className="h-8 w-8 text-orange-600" />;
      default:
        return <AlertTriangle className="h-8 w-8 text-gray-600" />;
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "safe":
        return "text-green-600";
      case "phishing":
        return "text-red-600";
      case "suspicious":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const getVerdictBg = (verdict: string) => {
    switch (verdict) {
      case "safe":
        return "bg-green-100";
      case "phishing":
        return "bg-red-100";
      case "suspicious":
        return "bg-orange-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">URL Phishing Detection</h2>
        <p className="text-gray-600">
          Enter a URL to analyze for potential phishing threats using advanced heuristics and machine learning.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
            Website URL
          </Label>
          <div className="relative">
            <Input
              type="text"
              id="url-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="block w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="https://example.com or www.vanessajanemaldonado.com//wp-content/wp.secure.php"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <Globe className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">Supports both full URLs and domain names</p>
        </div>

        <Button
          type="submit"
          disabled={analyzeUrlMutation.isPending}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium text-sm transition-colors duration-200"
        >
          {analyzeUrlMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Analyze URL
            </>
          )}
        </Button>
      </form>

      {result && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 ${getVerdictBg(result.verdict)} rounded-full flex items-center justify-center`}>
                {getVerdictIcon(result.verdict)}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis Complete</h3>
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className={`text-2xl font-semibold ${getVerdictColor(result.verdict)} uppercase`}>
                        {result.verdict}
                      </div>
                      <div className="text-sm text-gray-500">Verdict</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-semibold text-gray-900">{result.confidence}%</div>
                      <div className="text-sm text-gray-500">Confidence</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-semibold text-gray-900">{result.analysisTime.toFixed(1)}s</div>
                      <div className="text-sm text-gray-500">Analysis Time</div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Detection Details</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {result.details.map((detail, index) => (
                        <li key={index} className="flex items-center">
                          {result.verdict === "safe" ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0" />
                          )}
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
