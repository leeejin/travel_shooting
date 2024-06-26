import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { close } from '../../../redux/slices/modalSlice';
import LogoIcon from '../../../styles/images/logo-icon.png';
import LogoText from '../../../styles/images/logo-text.png';
import supabase from '../../../util/supabase/supabaseClient';
import Modal from '../../LogModal';

function Signup() {
  const dispatch = useDispatch();
  const [signUpId, setSignUpId] = useState('');
  const [signUpPw, setSignUpPw] = useState('');
  const [signUpPwConfirm, setSignUpPwConfirm] = useState('');

  const onChangesignUpId = (e) => {
    setSignUpId(e.target.value);
  };
  const onChangesignUpPw = (e) => {
    setSignUpPw(e.target.value);
  };
  const onChangesignUpPwConfirm = (e) => {
    setSignUpPwConfirm(e.target.value);
  };

  const signUpNewUser = async (e) => {
    e.preventDefault();

    const { data } = await supabase.auth.signUp({
      email: signUpId,
      password: signUpPw
    });

    await supabase.from('USER').insert({
      uuid: data.user.id,
      userId: signUpId,
      userImageURL: 'https://skwkufggbhgnltheimss.supabase.co/storage/v1/object/public/avatars/default-profile.jpg'
    });
    dispatch(close());
  };

  return (
    <Modal>
      <div style={{ marginTop: '60px' }}>
        <div className="logo-div">
          <img src={LogoIcon} alt="logo" className="logo-icon" />
        </div>
        <div className="logo-div">
          <img src={LogoText} alt="logo" className="logo-text" />
        </div>
      </div>
      <p className="login-p">회원가입</p>
      <form className="login-form">
        <input className="login-input" type="email" placeholder="이메일" value={signUpId} onChange={onChangesignUpId} />
        <input
          className="login-input"
          type="password"
          placeholder="비밀번호"
          value={signUpPw}
          onChange={onChangesignUpPw}
        />
        <input
          className="login-input"
          type="password"
          placeholder="비밀번호 확인"
          value={signUpPwConfirm}
          onChange={onChangesignUpPwConfirm}
        />
        <button className="login-input-btn" type="submit" onClick={signUpNewUser}>
          회원가입
        </button>
      </form>
    </Modal>
  );
}
export default Signup;
