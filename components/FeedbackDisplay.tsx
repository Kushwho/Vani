import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {  Info, ThumbsUp, ThumbsDown, Lightbulb } from "lucide-react";

interface FeedbackSection {
  title: string;
  content: string;
  type: "positive" | "negative" | "neutral";
}

interface Feedback {
  sections: FeedbackSection[];
  recommendations?: string[];
}

interface FeedbackDisplayProps {
  feedback: Feedback;
}

export function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "positive":
        return "default";
      case "negative":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Feedback Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Feedback Sections */}
        <div className="space-y-4">
          {feedback.sections.map((section, index) => (
            <Alert key={index} variant={getAlertVariant(section.type)}>
              <div className="flex items-start gap-3">
                {getIcon(section.type)}
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{section.title}</h3>
                  <AlertDescription>{section.content}</AlertDescription>
                </div>
              </div>
            </Alert>
          ))}
        </div>

        {/* Recommendations Section */}
        {feedback.recommendations && feedback.recommendations.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Recommendations
            </h3>
            <div className="space-y-2">
              {feedback.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2 bg-yellow-50 p-3 rounded-lg">
                  <span className="text-yellow-500">•</span>
                  <p className="text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 