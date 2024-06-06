import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { deletePost } from '../../../redux/slices/postSlice';
import supabase from '../../../util/supabase/supabaseClient';

const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
`;
const BadgeBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
const Badge = styled.span`
  background-color: var(--lightgrey-color);
  border-radius: 20px;
  padding: 5px;
`;

const Font = styled.p`
  font-size: 25px;
  font-weight: bold;
`;
const Button = styled.button`
  padding: 8px;
  background-color: var(--yellow-color);
`;
function PostDetail({ postDetailData, postTags }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [postEmail, setPostEmail] = useState('');
  const userId = JSON.parse(sessionStorage.getItem('logInUser'));
  useEffect(() => {
    const fetchTagsData = async () => {
      const { data, error } = await supabase.from('POSTTAG').select('*');
      if (error) console.log('POSTTAG 테이블 못불러옴');
      else {
        const newTags = postTags.map((tag) => data.filter((d) => tag.tagId === d.id).map((d) => d.tagValue)).flat();
        console.log(newTags);
        setTags(newTags);
      }
    };

    fetchTagsData();
  }, [postTags]);
  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase.from('USER').select('*').eq('uuid', postDetailData.postUserId);
      if (error) console.log('user 테이블 못불러옴');
      else {
        console.log('user 불러옴 : ', data);
        setPostEmail(data[0].userId);
      }
    };
    fetchUserData();
  }, [postDetailData]);
  const handleDelete = () => {
    const fetchDeleteUserData = async () => {
      const { data, error } = await supabase.from('POST').delete().eq('id', postDetailData.id);
      const { error: tagError } = await supabase.from('TAGS').delete().eq('postId', postDetailData.id);

      if (error || tagError) alert('삭제하는데 에러발생했암');
      else {
        dispatch(deletePost(data));
        navigate('/');
      }
    };
    fetchDeleteUserData();
    deleteImagesFromSupabase();
  };
  const fetchImagesWithPostId = async () => {
    const postId = postDetailData.id;
    const { data, error } = await supabase.storage.from('postImages').list('', {
      search: `${postId}-`
    });

    if (error) {
      console.error('파일 조회 실패...', error);
      return [];
    }

    console.log('조회된 파일 목록:', data);
    return data.map((file) => file.name);
  };
  const deleteImagesFromSupabase = async (files) => {
    fetchImagesWithPostId();
    const postId = postDetailData.id;

    return Promise.all(
      files.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${postId}-${index}.${fileExt}`;
        const { data, error } = await supabase.storage.from('postImages').remove([fileName]);

        if (error) {
          console.error('이미지 삭제 실패...', error);
        } else console.log('이미지 삭제 성공...', data);

        return data;
      })
    );
  };
  const handleModify = () => {};
  return (
    <div>
      <div>
        <TitleBox>
          <Font>{postDetailData.postTitle}</Font>
          <BadgeBox>
            {userId == postDetailData.postUserId && (
              <>
                <Button onClick={handleModify}>수정</Button>
                <Button onClick={handleDelete}>삭제</Button>
              </>
            )}
          </BadgeBox>
        </TitleBox>
        <p>{postDetailData.postDate}</p>
        <p>{postDetailData.postContent}</p>
        <BadgeBox>
          {tags.map((tag, i) => (
            <Badge key={i}>#{tag}</Badge>
          ))}
        </BadgeBox>
      </div>
      <div>
        <h1>{postEmail.slice(0, postEmail.indexOf('@'))}</h1>
      </div>
    </div>
  );
}
export default PostDetail;
