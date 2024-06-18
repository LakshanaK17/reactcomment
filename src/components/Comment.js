import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Avatar, Typography, IconButton, Button, TextField } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown'; // Import the dislike icon
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateExistingComment, deleteExistingComment, incrementCommentLikes, decrementCommentLikes, addReplyToComment } from '../features/comments/commentsSlice'; // Import decrement action

const Comment = ({ comment }) => {
  const dispatch = useDispatch();
  const isDefaultUser = comment.username === 'Peter Parker';
  const [editMode, setEditMode] = useState(false);
  const [editedMessage, setEditedMessage] = useState(comment.message);
  const [replyMode, setReplyMode] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const replies = useSelector(state => state.comments.comments.find(c => c.id === comment.id)?.replies || []);

  useEffect(() => {
    setEditedMessage(comment.message);
  }, [comment]);

  const handleEdit = async () => {
    try {
      const updatedComment = { ...comment, message: editedMessage };
      await dispatch(updateExistingComment(updatedComment));
      setEditMode(false);
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteExistingComment(comment.id));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLike = async () => {
    try {
      await dispatch(incrementCommentLikes(comment.id));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDislike = async () => {
    try {
      await dispatch(decrementCommentLikes(comment.id));
    } catch (error) {
      console.error('Error disliking comment:', error);
    }
  };

  const handleReply = async () => {
    try {
      
      await dispatch(addReplyToComment({ commentId: comment.id, content: replyContent }));

      
      setReplyContent('');
      setReplyMode(false);
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };

  return (
    <Box display="flex" alignItems="flex-start" p={2} borderBottom={1} borderColor="grey.300">
      <Avatar src={comment.profileImage} alt="Profile" sx={{ width: 40, height: 40 }} />
      <Box ml={2} flex={1}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Typography variant="subtitle2" fontWeight="bold" color="textPrimary" mr={1}>
              {comment.username}
            </Typography>
            <Typography variant="caption" color="textSecondary" mr={1}>
              {comment.timeAgo}
            </Typography>
            <Box ml="auto">
              {!isDefaultUser && (
                <Button
                  variant="text"
                  size="small"
                  color="primary"
                  onClick={() => setReplyMode(true)}
                  sx={{ color: '#7D33FF' }}
                >
                  <ReplyIcon fontSize="small" style={{ marginRight: '0.5rem', color: '#7D33FF' }} />
                  Reply
                </Button>
              )}
            </Box>
          </Box>

          <Box display="flex" alignItems="center">
            {isDefaultUser && (
              <Box>
                <IconButton size="small" color="secondary" sx={{ color: '#C60802' }} onClick={handleDelete}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <Button variant="text" size="small" color="primary" sx={{ color: '#C60802' }} onClick={handleDelete}>
                  Delete
                </Button>
                <IconButton size="small" color="primary" sx={{ color: '#7D33FF' }} onClick={() => setEditMode(true)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <Button variant="text" size="small" color="primary" sx={{ color: '#7D33FF' }} onClick={() => setEditMode(true)}>
                  Edit
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Box mt={1}>
          {editMode ? (
            <TextField
              multiline
              fullWidth
              variant="outlined"
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
            />
          ) : (
            <Typography variant="body2" color="textSecondary">
              {editedMessage}
            </Typography>
          )}
        </Box>

        <Box ml="auto" display="flex" alignItems="center">
          <IconButton size="small" color="default" onClick={handleLike}>
            <ThumbUpIcon fontSize="small" sx={{ color: '#14C602' }} />
          </IconButton>
          <Typography variant="caption" color="textSecondary" ml={0.5} sx={{ color: '#14C602' }}>
            {comment.likes}
          </Typography>
          <IconButton size="small" color="default" onClick={handleDislike}> 
            <ThumbDownIcon fontSize="small" sx={{ color: '#C60802' }} />
          </IconButton>
        </Box>

        {replies.map(reply => (
          <Box key={reply.id} mt={1}>
            <Typography variant="body2" color="textSecondary">
              {reply.content}
            </Typography>
          </Box>
        ))}

        {replyMode && (
          <Box mt={1} display="flex" alignItems="center">
            <TextField
              multiline
              fullWidth
              variant="outlined"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleReply}
              style={{ marginLeft: '1rem' }}
            >
              Reply
            </Button>
          </Box>
        )}

        {editMode && (
          <Box mt={1} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" size="small" onClick={handleEdit}>
              Save
            </Button>
            <Button variant="outlined" size="small" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Comment;
