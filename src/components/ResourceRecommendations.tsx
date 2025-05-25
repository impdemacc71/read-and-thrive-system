
import { useMemo } from 'react';
import { useLibrary } from '@/contexts/library';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Resource } from '@/data/mockData';
import { Link } from 'react-router-dom';

interface ResourceRecommendationsProps {
  currentResourceId: string;
  limit?: number;
}

const ResourceRecommendations = ({ currentResourceId, limit = 5 }: ResourceRecommendationsProps) => {
  const { resources, transactions } = useLibrary();
  const { currentUser } = useAuth();

  const recommendations = useMemo(() => {
    if (!currentUser) return [];

    const currentResource = resources.find(r => r.id === currentResourceId);
    if (!currentResource) return [];

    // Get user's borrowing history
    const userTransactions = transactions.filter(t => t.userId === currentUser.id);
    const borrowedResourceIds = userTransactions.map(t => t.resourceId);
    const borrowedResources = resources.filter(r => borrowedResourceIds.includes(r.id));

    // Get user's preferred categories and types
    const categoryCount: Record<string, number> = {};
    const typeCount: Record<string, number> = {};
    
    borrowedResources.forEach(resource => {
      categoryCount[resource.category] = (categoryCount[resource.category] || 0) + 1;
      typeCount[resource.type] = (typeCount[resource.type] || 0) + 1;
    });

    // Score resources based on similarity
    const scoredResources = resources
      .filter(resource => 
        resource.id !== currentResourceId && 
        !borrowedResourceIds.includes(resource.id) &&
        resource.available
      )
      .map(resource => {
        let score = 0;
        
        // Same category as current resource
        if (resource.category === currentResource.category) score += 5;
        
        // Same type as current resource
        if (resource.type === currentResource.type) score += 3;
        
        // User's preferred categories
        if (categoryCount[resource.category]) {
          score += categoryCount[resource.category] * 2;
        }
        
        // User's preferred types
        if (typeCount[resource.type]) {
          score += typeCount[resource.type];
        }
        
        // Same author
        if (resource.author === currentResource.author) score += 4;
        
        // Keywords overlap
        const commonKeywords = resource.keywords.filter(keyword => 
          currentResource.keywords.includes(keyword)
        );
        score += commonKeywords.length;

        return { resource, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.resource);

    return scoredResources;
  }, [resources, transactions, currentUser, currentResourceId, limit]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((resource) => (
            <Link
              key={resource.id}
              to={`/book/${resource.id}`}
              className="block hover:bg-gray-50 p-3 rounded-lg transition-colors"
            >
              <div className="flex items-start space-x-3">
                <img 
                  src={resource.cover} 
                  alt={resource.title}
                  className="w-12 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{resource.title}</h4>
                  <p className="text-xs text-gray-600 truncate">{resource.author}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {resource.category}
                    </Badge>
                    {resource.digital && (
                      <Badge variant="outline" className="text-xs">
                        Digital
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceRecommendations;
