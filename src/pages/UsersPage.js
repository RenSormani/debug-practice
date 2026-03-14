import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '../components/DataTable';
import { fetchUsersRequest } from '../redux/users/actions';

export default function UsersPage() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const loading = useSelector((state) => state.users.loading);
  const error = useSelector((state) => state.users.error);

  useEffect(() => {
    dispatch(fetchUsersRequest());
  }, [dispatch]);

  return (
    <DataTable
      title="USERS"
      data={users}
      loading={loading}
      error={error}
    />
  );
}