import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import CommentList from './components/CommentList';
import CommentForm from './components/CommentForm';

const App = () => {
  return (
    <Provider store={store}>
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-gray-50">
        <CommentList />
        <CommentForm />
      </div>
    </Provider>
  );
};

export default App;
