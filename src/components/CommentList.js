import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Comment from './Comment';
import { fetchComments } from '../features/comments/commentsSlice';

const CommentList = () => {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comments.comments);
  const commentStatus = useSelector((state) => state.comments.status);

  useEffect(() => {
    if (commentStatus === 'idle') {
      dispatch(fetchComments());
    }
  }, [commentStatus, dispatch]);

  return (
    <div className="bg-white shadow rounded-lg">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;
