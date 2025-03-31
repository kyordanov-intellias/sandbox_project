import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import './CommentActions.styles.css';

interface CommentActionsProps {
  isAuthor: boolean;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function CommentActions({ isAuthor, isAdmin, onEdit, onDelete }: CommentActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthor && !isAdmin) return null;

  return (
    <div className="comment-actions" ref={menuRef}>
      <button 
        className="comment-actions-button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <MoreHorizontal size={20} />
      </button>
      
      {isOpen && (
        <div className="comment-actions-menu">
          <button 
            className="comment-actions-menu-item"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
              setIsOpen(false);
            }}
          >
            Edit
          </button>
          <button 
            className="comment-actions-menu-item delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              setIsOpen(false);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}