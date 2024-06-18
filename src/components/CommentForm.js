import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addNewComment, updateExistingComment } from '../features/comments/commentsSlice';
import { Grid, TextField, Button, Avatar } from '@mui/material';
import AvatarImage from '../assets/user.png';

const CommentForm = ({ commentToEdit }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const defaultUsername = 'Peter Parker';

  useEffect(() => {
    if (commentToEdit) {
      reset({ message: commentToEdit.message });
    } else {
      reset();
    }
  }, [commentToEdit, reset]);

  const onSubmit = data => {
    if (commentToEdit) {
      dispatch(updateExistingComment(commentToEdit.id, { message: data.message }));
    } else {
      dispatch(addNewComment({ username: defaultUsername, message: data.message, profileImage: AvatarImage }));
    }
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 border-t border-gray-200">
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar src={AvatarImage} alt="Avatar" />
        </Grid>
        <Grid item xs={8}>
          <TextField
            {...register('message', { required: true })}
            variant="outlined"
            fullWidth
            placeholder="Add a comment..."
            error={!!errors.message}
            helperText={errors.message ? 'This field is required' : ''}
          />
        </Grid>
        <Grid item xs={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ bgcolor: '#7D33FF' }}>
            {commentToEdit ? 'Update' : 'Send'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CommentForm;
