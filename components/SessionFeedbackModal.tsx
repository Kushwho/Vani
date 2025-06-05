'use client';

import React, { useState } from 'react';
import useAxiosContext from '@/hooks/custom/useAxiosContext';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PostSessionFeedback } from '@/lib/apis/sessions/session-apis';
import { SessionFeedbackRequest } from '@/types/sessions';

interface SessionFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  onFeedbackSubmitted?: () => void;
}

const SessionFeedbackModal: React.FC<SessionFeedbackModalProps> = ({
  isOpen,
  onClose,
  sessionId,
  onFeedbackSubmitted,
}) => {
  const [feedback, setFeedback] = useState<SessionFeedbackRequest>({
    type: 'positive',
    title: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const axios = useAxiosContext();

  const handleSubmit = async () => {
    if (!feedback.title.trim() || !feedback.content.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide both a title and content for your feedback.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await PostSessionFeedback({
        axios,
        sessionId,
        data: feedback,
        onSuccess: () => {
          toast({
            title: 'Thank you!',
            description: 'Your feedback has been submitted successfully.',
          });
          onFeedbackSubmitted?.();
          onClose();
          // Reset form
          setFeedback({
            type: 'positive',
            title: '',
            content: '',
          });
        },
        onError: (error) => {
          console.error('Error submitting feedback:', error);
          toast({
            title: 'Error',
            description: 'Failed to submit feedback. Please try again.',
            variant: 'destructive',
          });
        },
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Session Feedback</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="feedback-type">Feedback Type</Label>
            <RadioGroup
              value={feedback.type}
              onValueChange={(value) =>
                setFeedback((prev) => ({ ...prev, type: value as 'positive' | 'negative' | 'neutral' }))
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="positive" id="positive" />
                <Label htmlFor="positive">Positive</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="neutral" id="neutral" />
                <Label htmlFor="neutral">Neutral</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="negative" id="negative" />
                <Label htmlFor="negative">Negative</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback-title">Title</Label>
            <input
              id="feedback-title"
              type="text"
              placeholder="Brief summary of your feedback"
              value={feedback.title}
              onChange={(e) =>
                setFeedback((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback-content">Feedback</Label>
            <Textarea
              id="feedback-content"
              placeholder="Please share your detailed feedback about this session..."
              value={feedback.content}
              onChange={(e) =>
                setFeedback((prev) => ({ ...prev, content: e.target.value }))
              }
              rows={4}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !feedback.title.trim() || !feedback.content.trim()}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionFeedbackModal;
