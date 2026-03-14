import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../components/DataTable";
import { fetchPostsRequest } from "../redux/posts/actions";

export default function PostsPage() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    dispatch(fetchPostsRequest());
  }, [dispatch]);

  return (
    <DataTable title="POSTS" data={posts} loading={loading} error={error} />
  );
}
