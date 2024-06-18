import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  comments: [],
  status: 'idle',
  error: null,
};

export const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setComments: (state, action) => {
      state.comments = action.payload;
      state.status = 'succeeded';
    },
    addComment: (state, action) => {
      state.comments.push(action.payload);
    },
    editComment: (state, action) => {
      const { id, updatedComment } = action.payload;
      const index = state.comments.findIndex(comment => comment.id === id);
      if (index !== -1) {
        state.comments[index] = { ...state.comments[index], ...updatedComment };
      }
    },
    deleteComment: (state, action) => {
      state.comments = state.comments.filter(comment => comment.id !== action.payload);
    },
    incrementLikes: (state, action) => {
      const { id } = action.payload;
      const index = state.comments.findIndex(comment => comment.id === id);
      if (index !== -1) {
        state.comments[index].likes += 1;
      }
    },
    decrementLikes: (state, action) => { 
      const { id } = action.payload;
      const index = state.comments.findIndex(comment => comment.id === id);
      if (index !== -1) {
        state.comments[index].likes -= 1;
      }
    },
    addReplyToCommentSuccess: (state, action) => {
      const { commentId, reply } = action.payload;
      const commentIndex = state.comments.findIndex(comment => comment.id === commentId);
      if (commentIndex !== -1) {
        state.comments[commentIndex].replies.push(reply);
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = 'failed';
    },
  },
});

export const fetchComments = () => async dispatch => {
  try {
    const response = await axios.get('http://localhost:4000/api/comments');
    dispatch(setComments(response.data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const addNewComment = (newComment) => async dispatch => {
  try {
    const response = await axios.post('http://localhost:4000/api/comments', newComment);
    dispatch(addComment(response.data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const updateExistingComment = (updatedComment) => async dispatch => {
  const { id } = updatedComment;
  try {
    const response = await axios.put(`http://localhost:4000/api/comments/${id}`, updatedComment);
    dispatch(editComment({ id, updatedComment: response.data }));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const deleteExistingComment = (id) => async dispatch => {
  try {
    await axios.delete(`http://localhost:4000/api/comments/${id}`);
    dispatch(deleteComment(id));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const incrementCommentLikes = (id) => async dispatch => {
  try {
    const response = await axios.put(`http://localhost:4000/api/comments/${id}/like`);
    dispatch(incrementLikes({ id }));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const decrementCommentLikes = (id) => async dispatch => { 
  try {
    const response = await axios.put(`http://localhost:4000/api/comments/${id}/dislike`);
    dispatch(decrementLikes({ id }));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const addReplyToComment = ({ id, content }) => async dispatch => {
  try {
    const response = await axios.post(`http://localhost:4000/api/comments/${id}/replies`, { content });
    dispatch(addReplyToCommentSuccess({ commentId: id, reply: response.data }));
    return response.data;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  }
};

export default commentSlice.reducer;
export const { setComments, addComment, editComment, deleteComment, incrementLikes, decrementLikes, setError, addReplyToCommentSuccess } = commentSlice.actions; // Add decrementLikes action
