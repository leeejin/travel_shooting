import { useState } from "react";
import { useDispatch } from "react-redux";
import supabase from "../../../util/supabase/supabaseClient";
import Modal from "../../Modal";

function Signup() {
  const dispatch = useDispatch();
  const [signUpId, setSignUpId] = useState("");
  const [signUpPw, setSignUpPw] = useState("");
  const [signUpPwConfirm, setSignUpPwConfirm] = useState("");
  const [user, setUser] = useState(null);

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

    const { data, error } = await supabase.auth.signUp({
      email: signUpId,
      password: signUpPw,
    });
    console.log(data.user.id);
    console.log(error);

    await supabase
      .from("USER")
      .insert({ uuid: data.user.id, userId: signUpId });

    // const { data, error } = await supabase
    //   .from("USER") // 여기에서 'USER'은 테이블 이름입니다.
    //   .select("*")
    //   .eq("userId", signUpId)
    //   .eq("userPw", signUpPw);
    // console.log("login : ", { data, error });
    // setUser(data.user);
    dispatch(close());
  };

  return (
    <Modal>
      <div className="logo-div">
        <img
          src="src\styles\images\logo-icon.png"
          alt="logo"
          className="logo"
        />
        <img
          src="src\styles\images\logo-text.png"
          alt="logo"
          className="logo"
        />
      </div>
      <p className="login-p">회원가입</p>
      <form className="login-form">
        <input
          className="login-input"
          type="email"
          placeholder="이메일"
          value={signUpId}
          onChange={onChangesignUpId}
        />
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
        <button
          className="login-input-btn"
          type="submit"
          onClick={signUpNewUser}
        >
          회원가입
        </button>
      </form>
    </Modal>
  );
}
export default Signup;
