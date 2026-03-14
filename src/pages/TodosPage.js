import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '../components/DataTable';
import { fetchTodosRequest } from '../redux/todos/actions';

export default function TodosPage() {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.todos);
  const loading = useSelector((state) => state.todos.loading);
  const error = useSelector((state) => state.todos.error);

  useEffect(() => {
    dispatch(fetchTodosRequest());
  }, [dispatch]);

  return (
    <DataTable
      title="TODOS"
      data={todos}
      loading={loading}
      error={error}
    />
  );
}