import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface ResourceReviewsProps {
  resourceId: string;
}

const ResourceReviews = ({ resourceId }: ResourceReviewsProps) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(`reviews-${resourceId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const saveReviews = (updatedReviews: Review[]) => {
    localStorage.setItem(`reviews-${resourceId}`, JSON.stringify(updatedReviews));
    setReviews(updatedReviews);
  };

  const handleSubmitReview = () => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (newRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating.",
        variant: "destructive",
      });
      return;
    }

    const existingReviewIndex = reviews.findIndex(r => r.userId === currentUser.id);
    const newReview: Review = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.full_name || "Anonymous User",
      rating: newRating,
      comment: newComment,
      date: new Date().toLocaleDateString()
    };

    let updatedReviews;
    if (existingReviewIndex >= 0) {
      updatedReviews = [...reviews];
      updatedReviews[existingReviewIndex] = newReview;
    } else {
      updatedReviews = [...reviews, newReview];
    }

    saveReviews(updatedReviews);
    setNewRating(0);
    setNewComment('');
    
    toast({
      title: "Review Submitted",
      description: "Thank you for your review!",
    });
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= (interactive ? (hoveredStar || newRating) : rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onStarClick?.(star)}
            onMouseEnter={() => interactive && setHoveredStar(star)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reviews & Ratings</span>
            <div className="flex items-center gap-2">
              {renderStars(averageRating)}
              <span className="text-sm text-gray-600">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentUser && (
            <div className="border-b pb-4 mb-4">
              <h4 className="font-medium mb-3">Write a Review</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  {renderStars(0, true, setNewRating)}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Comment (optional)</label>
                  <Textarea
                    placeholder="Share your thoughts about this resource..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={handleSubmitReview} size="sm">
                  Submit Review
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b last:border-b-0 pb-3 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-sm">{review.userName}</span>
                      <Badge variant="outline" className="text-xs">{review.date}</Badge>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourceReviews;
