import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import PostDetail from "../components/PostComponent/PostDetail";
import Slider from "../components/PostComponent/Slider";
import Travel from "../components/PostComponent/Travel";
import { loadPost } from "../redux/slices/postSlice";
import supabase from "../util/supabase/supabaseClient";
import Comments from "../components/PostComponent/Comment/Comments";
const Container = styled.div`
  display: grid;
  grid-template-rows: 700px 1fr;
  grid-template-columns: 1.5fr 1fr;
  grid-template-areas: "slider" "post travel";
  gap: 25px;

  div:nth-child(1) {
    grid-column: 1/3;
  }
`;

function PostPage() {
  const dispatch = useDispatch();
  const [postDetailDatas, setPostDetailDatas] = useState({});
  const [postImages, setPostImages] = useState([]);
  const [postTags, setPostTags] = useState([]);
  const { postId } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("POST")
        .select("*")
        .eq("id", postId);
      if (error) {
        console.error(error);
      } else {
        console.log(data[0]);
        setPostDetailDatas(data[0]);
        const urls = JSON.parse(data[0].imageURL).map((image) => image.url, []);
        setPostImages(urls);
        dispatch(loadPost(data[0]));
      }
    };
    const tagFetchData = async () => {
      const { data, error } = await supabase
        .from("TAGS")
        .select("*")
        .eq("postId", postId);
      if (error) console.error(error);
      else {
        console.log(data);
        setPostTags(data);
      }
    };

    fetchData();
    tagFetchData();
  }, [postId]);
  return (
    <Container>
      <Slider postImage={postImages} />
      <PostDetail postDetailData={postDetailDatas} postTags={postTags} />
      <Travel />
      <Comments />
    </Container>
  );
}

export default PostPage;
