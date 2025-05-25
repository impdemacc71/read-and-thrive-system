
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Play, Pause, Volume2, Book, FileText, Music, Video, Clock } from 'lucide-react';
import { Resource } from '@/data/mockData';
import { useDigitalResourceTracker } from '@/hooks/useDigitalResourceTracker';

interface DigitalPlayerProps {
  resource: Resource;
}

const DigitalPlayer = ({ resource }: DigitalPlayerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { 
    isActive, 
    totalTime, 
    sessionTime, 
    startTracking, 
    stopTracking, 
    formatTime 
  } = useDigitalResourceTracker(resource.id);

  // Auto start tracking when dialog opens
  useEffect(() => {
    if (isOpen) {
      startTracking();
    } else {
      stopTracking();
    }
  }, [isOpen]);

  // Stop tracking when component unmounts
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  const getPlayerIcon = () => {
    switch (resource.type) {
      case 'ebook':
        return <FileText className="h-4 w-4" />;
      case 'audio':
        return <Music className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return <Play className="h-4 w-4" />;
    }
  };

  const getPlayerContent = () => {
    switch (resource.type) {
      case 'ebook':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg min-h-[500px] max-h-[600px] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4 text-center">{resource.title}</h3>
              <div className="prose max-w-none">
                {resource.url ? (
                  <div className="text-center">
                    <iframe
                      src={resource.url}
                      className="w-full h-96 border rounded"
                      title={resource.title}
                    />
                    <p className="mt-4 text-sm text-gray-600">
                      PDF Viewer - {resource.title}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="mb-4">This is a digital ebook reader. The content would be displayed here with proper pagination and reading features.</p>
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold mb-2">About this book:</h4>
                      <p className="mb-3">{resource.description}</p>
                      <p className="text-sm text-gray-600"><strong>Author:</strong> {resource.author}</p>
                      <p className="text-sm text-gray-600"><strong>Publisher:</strong> {resource.publisher}</p>
                      <p className="text-sm text-gray-600"><strong>Keywords:</strong> {resource.keywords.join(', ')}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded">
              <span className="text-sm text-gray-600">Page 1 of {resource.pages || 250}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Previous</Button>
                <Button size="sm" variant="outline">Next</Button>
                <Button size="sm" variant="outline">Bookmark</Button>
              </div>
            </div>
          </div>
        );
      
      case 'audio':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center mb-4">
                {resource.cover ? (
                  <img src={resource.cover} alt={resource.title} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Music className="h-24 w-24 text-white" />
                )}
              </div>
              <h3 className="text-xl font-semibold">{resource.title}</h3>
              <p className="text-gray-600 mb-2">{resource.author}</p>
              <p className="text-sm text-gray-500">{resource.publisher}</p>
            </div>
            
            {resource.url ? (
              <div className="space-y-4">
                <audio 
                  controls 
                  className="w-full"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={resource.url} type="audio/mpeg" />
                  <source src={resource.url} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
                <div className="text-center text-sm text-gray-600">
                  {resource.fileFormat && `Format: ${resource.fileFormat}`}
                </div>
              </div>
            ) : (
              <>
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
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button
                    size="lg"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="rounded-full w-16 h-16"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </>
            )}
          </div>
        );
      
      case 'video':
        return (
          <div className="space-y-4">
            {resource.url ? (
              <div className="space-y-4">
                <video 
                  controls 
                  className="w-full rounded-lg" 
                  style={{ maxHeight: '400px' }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={resource.url} type="video/mp4" />
                  <source src={resource.url} type="video/avi" />
                  Your browser does not support the video tag.
                </video>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{resource.title}</h3>
                  <p className="text-gray-600">{resource.author}</p>
                  {resource.fileFormat && (
                    <p className="text-sm text-gray-500">Format: {resource.fileFormat}</p>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg">Video Player</p>
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
              </>
            )}
          </div>
        );
      
      default:
        return (
          <div className="text-center p-8">
            <Book className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p>Digital content viewer for {resource.type}</p>
            <p className="text-sm text-gray-500 mt-2">{resource.description}</p>
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
          {getPlayerIcon()}
          <span className="ml-2">
            {resource.type === 'ebook' ? 'Read Now' : 
             resource.type === 'audio' ? 'Listen Now' : 
             resource.type === 'video' ? 'Watch Now' : 'Play Now'}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              {resource.title}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Session: {formatTime(sessionTime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Total: {formatTime(totalTime)}</span>
              </div>
              {isActive && (
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {getPlayerContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DigitalPlayer;
