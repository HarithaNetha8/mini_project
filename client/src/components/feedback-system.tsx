import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { AnalysisResult } from "@/lib/types";

interface FeedbackSystemProps {
  scanId: number;
  visible: boolean;
  onClose: () => void;
}

export default function FeedbackSystem({ scanId, visible, onClose }: FeedbackSystemProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  const queryClient = useQueryClient();

  const submitFeedbackMutation = useMutation({
    mutationFn: async ({ isCorrect, comment }: { isCorrect: boolean; comment?: string }) => {
      const response = await apiRequest("POST", "/api/feedback", {
        scanId,
        isCorrect,
        comment: comment || null,
      });
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/scans"] });
      
      // Auto-hide after success message
      setTimeout(() => {
        onClose();
      }, 3000);
    },
  });

  const handleFeedbackSelect = (isCorrect: boolean) => {
    setSelectedFeedback(isCorrect);
  };

  const handleSubmit = () => {
    if (selectedFeedback !== null) {
      submitFeedbackMutation.mutate({
        isCorrect: selectedFeedback,
        comment: comment.trim() || undefined,
      });
    }
  };

  if (!visible) return null;

  if (submitted) {
    return (
      <Card className="mt-8 border border-gray-200">
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank you for your feedback!</h3>
          <p className="text-gray-600">Your input helps us improve our detection accuracy.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Help us improve</h3>
        <p className="text-gray-600 mb-6">
          Was this detection result accurate? Your feedback helps us improve our detection algorithms.
        </p>

        <div className="space-y-4">
          <div className="flex space-x-4">
            <Button
              variant={selectedFeedback === true ? "default" : "outline"}
              className={`flex-1 py-3 transition-colors duration-200 ${
                selectedFeedback === true 
                  ? "bg-green-600 hover:bg-green-700 text-white border-green-600" 
                  : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
              }`}
              onClick={() => handleFeedbackSelect(true)}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              Correct Detection
            </Button>
            <Button
              variant={selectedFeedback === false ? "default" : "outline"}
              className={`flex-1 py-3 transition-colors duration-200 ${
                selectedFeedback === false 
                  ? "bg-red-600 hover:bg-red-700 text-white border-red-600" 
                  : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
              }`}
              onClick={() => handleFeedbackSelect(false)}
            >
              <ThumbsDown className="h-4 w-4 mr-2" />
              Incorrect Detection
            </Button>
          </div>

          <div>
            <Label htmlFor="feedback-comment" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Comments (Optional)
            </Label>
            <Textarea
              id="feedback-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Tell us more about your experience or any issues you encountered..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Skip
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={selectedFeedback === null || submitFeedbackMutation.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {submitFeedbackMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
