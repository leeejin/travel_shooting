import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import PostDetail from "../components/PostComponent/PostDetail";
import Slider from "../components/PostComponent/Slider";
import Travel from "../components/PostComponent/Travel";
import supabase from "../util/supabase/supabaseClient";
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
        console.log(data);
        setPostDetailDatas(data[0]);

        setPostImages(data[0].postImage.split(","));
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
    </Container>
  );
}

export default PostPage;