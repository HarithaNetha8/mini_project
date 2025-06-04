import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CloudUpload, X, Eye, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { AnalysisResult } from "@/lib/types";

interface ScreenshotAnalysisProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export default function ScreenshotAnalysis({ onAnalysisComplete }: ScreenshotAnalysisProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeScreenshotMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/analyze/screenshot', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Screenshot analysis failed');
      }
      
      return response.json() as Promise<AnalysisResult>;
    },
    onSuccess: (data) => {
      setResult(data);
      onAnalysisComplete(data);
    },
  });

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setResult(null);
  };

  const analyzeFile = () => {
    if (file) {
      analyzeScreenshotMutation.mutate(file);
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Screenshot Analysis</h2>
        <p className="text-gray-600">
          Upload a screenshot of a webpage to detect potential phishing attempts using computer vision and text analysis.
        </p>
      </div>

      {!file ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <CloudUpload className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">Drop your screenshot here</p>
              <p className="text-sm text-gray-500">or click to browse files</p>
            </div>
            <div className="flex text-sm text-gray-500 justify-center space-x-4">
              <span>PNG, JPG, JPEG up to 10MB</span>
            </div>
            <Button type="button" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Choose File
            </Button>
          </div>
          <input
            type="file"
            id="file-input"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) handleFileSelect(selectedFile);
            }}
          />
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Uploaded Screenshot</h3>
            <Button variant="ghost" size="sm" onClick={removeFile} className="text-gray-500 hover:text-red-500">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <Card className="border-2 border-gray-200 mb-4">
            <CardContent className="p-4">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Screenshot preview"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              )}
            </CardContent>
          </Card>
          
          <Button
            onClick={analyzeFile}
            disabled={analyzeScreenshotMutation.isPending}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {analyzeScreenshotMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Analyze Screenshot
              </>
            )}
          </Button>
        </div>
      )}

      {result && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 ${getVerdictBg(result.verdict)} rounded-full flex items-center justify-center`}>
                {getVerdictIcon(result.verdict)}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Screenshot Analysis Complete</h3>
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Detected Indicators</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {result.details.map((detail, index) => (
                        <li key={index} className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0" />
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
