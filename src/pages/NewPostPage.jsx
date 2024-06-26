import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CountrySelect from '../components/CountrySelect';
import Slider from '../components/PostComponent/Slider';
import Tags from '../components/Tags';
import { addPost, manageRealImages, manageTags } from '../redux/slices/postSlice';
import { getPresentTime } from '../util/date';
import supabase from '../util/supabase/supabaseClient';

const Container = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction};
  gap: 10px;
`;

const HiddenInput = styled.input`
  display: none;
`;

function NewPost() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.log.logInUser);
  const country = useSelector((state) => state.post.country);
  const selectedTags = useSelector((state) => state.post.tags);
  const [fileImages, setFileImages] = useState([]);
  const [realFiles, setRealFiles] = useState([]);
  const formRef = useRef([]);

  useEffect(() => {
    formRef.current[0].focus();
  }, []);
  const handleClick = () => {
    formRef.current[2].click();
  };

  const handleChange = (event) => {
    const files = Array.from(event.target.files);
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setFileImages(newPreviewUrls);
    setRealFiles(files);
  };

  const uploadImagesToSupabase = async (files, postId) => {
    try {
      const uploadPromises = await Promise.all(
        files.map(async (file, index) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${postId}-${index}.${fileExt}`;
          const { data, error } = await supabase.storage.from('postImages').upload(fileName, file);

          if (error) console.error('이미지 업로드 실패:', error);
          else console.log('이미지 성공:', data);

          return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/postImages/${fileName}`;
        })
      );
      return uploadPromises.map((url) => ({ url }));
    } catch (error) {
      console.error('이미지 업로드 중 오류 발생:', error);
    }
  };

  const handleSubmit = async () => {
    const id = crypto.randomUUID();
    if (confirm('업로드 하시겠습니까? 사진은 수정이 불가능합니다')) {
      try {
        const uploadedImageUrls = await uploadImagesToSupabase(realFiles, id);

        const postFormData = {
          id,
          postUserId: userId,
          postTitle: formRef.current[0].value,
          postContent: formRef.current[1].value,
          postDate: getPresentTime(),
          postLike: 0,
          imageURL: uploadedImageUrls,
          country: country
        };

        const tagsFormData = selectedTags.map(
          (tag) => ({
            id: crypto.randomUUID(),
            tagId: tag.id,
            postId: id
          }),
          []
        );
        const postError = {
          title: !formRef.current[0].value.trim().length,
          content: !formRef.current[1].value.trim().length,
          country: country == '',
          imageURL: !uploadedImageUrls.length,
          tags: !tagsFormData.length
        };
        if (postError.title || postError.content || postError.country || postError.imageURL || postError.tags) {
          alert('업로드에 문제가생겼어요 확인해주세요');
          return;
        }

        await supabase.from('POST').insert(postFormData);
        await supabase.from('TAGS').insert(tagsFormData);

        dispatch(addPost({ postFormData }));
        dispatch(manageTags({ tagsFormData }));
        dispatch(manageRealImages(postFormData));

        alert('데이터가 정상적으로 추가되었습니다');
        navigate('/');
      } catch (error) {
        console.error('에러 발생: ' + error.message);
      }
    }
  };

  return (
    <Container direction={'column'}>
      <Slider postImage={fileImages} />
      <input
        className="title-input"
        ref={(el) => (formRef.current[0] = el)}
        type="text"
        placeholder="제목을 입력해주세요"
      />
      <Container direction={'row'}>
        <CountrySelect />
        <Tags />
      </Container>
      <textarea
        className="content-box"
        ref={(el) => (formRef.current[1] = el)}
        type="text"
        placeholder="내용을 입력해주세요"
      ></textarea>
      <HiddenInput
        type="file"
        multiple
        accept="image/*"
        ref={(el) => (formRef.current[2] = el)}
        onChange={handleChange}
      />
      <button
        style={{
          borderRadius: '6px',
          cursor: 'pointer',
          width: '280px',
          height: '48px',
          fontWeight: '600px',
          color: 'var(--black-color)',
          fontSize: '14px',
          marginTop: '20px'
        }}
        onClick={handleClick}
      >
        사진 업로드
      </button>
      <button className="save-btn" onClick={handleSubmit}>
        저장
      </button>
    </Container>
  );
}

export default NewPost;
