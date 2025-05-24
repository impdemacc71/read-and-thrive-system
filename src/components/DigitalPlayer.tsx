
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Play, Pause, Volume2, Book } from 'lucide-react';
import { Resource } from '@/data/mockData';

interface DigitalPlayerProps {
  resource: Resource;
}

const DigitalPlayer = ({ resource }: DigitalPlayerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const getPlayerContent = () => {
    switch (resource.type) {
      case 'ebook':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg min-h-[400px]">
              <h3 className="text-lg font-semibold mb-4">{resource.title}</h3>
              <div className="prose">
                <p>This is a digital ebook reader. In a real implementation, this would show the actual ebook content with pagination, bookmarks, and reading features.</p>
                <p className="mt-4"><strong>Description:</strong> {resource.description}</p>
                <p className="mt-2"><strong>Keywords:</strong> {resource.keywords.join(', ')}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Page 1 of 250</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Previous</Button>
                <Button size="sm" variant="outline">Next</Button>
              </div>
            </div>
          </div>
        );
      
      case 'audio':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <img src={resource.cover} alt={resource.title} className="w-48 h-48 mx-auto rounded-lg" />
              <h3 className="text-lg font-semibold mt-4">{resource.title}</h3>
              <p className="text-gray-600">{resource.author}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">0:00</span>
                <span className="text-sm">45:30</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-1/4"></div>
              </div>
            </div>
            
            <div className="flex justify-center items-center gap-4">
              <Button
                size="lg"
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded-full w-16 h-16"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        );
      
      case 'video':
        return (
          <div className="space-y-4">
            <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="h-16 w-16 mx-auto mb-4" />
                <p>Video Player</p>
                <p className="text-sm opacity-75">Click to play {resource.title}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">0:00</span>
                <span className="text-sm">1:23:45</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full w-1/3"></div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center p-8">
            <Book className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p>Digital content viewer for {resource.type}</p>
          </div>
        );
    }
  };

  if (!resource.digital) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          <Play className="h-4 w-4 mr-2" />
          Play/Read Now
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            {resource.title}
          </DialogTitle>
        </DialogHeader>
        {getPlayerContent()}
      </DialogContent>
    </Dialog>
  );
};

export default DigitalPlayer;
