import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

const TutorialButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      onClick={() => navigate('/tutorial')}
      className="fixed bottom-6 right-6 z-50 gap-2 shadow-lg bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 hover:border-blue-300 transition-all duration-200"
    >
      <BookOpen className="h-4 w-4" />
      Tutorial
    </Button>
  );
};

export default TutorialButton;
