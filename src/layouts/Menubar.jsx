import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { logOut } from "../redux/slices/logSlice";
import { open } from "../redux/slices/modalSlice";
import Logo from "../styles/images/logo.png";
import supabase from "../util/supabase/supabaseClient";
const MenuContainer = styled.div`
  height: 80px;
  background-color: var(--lightgrey-color);
`;
const MenuInnerContainer = styled.div`
  width: 80%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const Button = styled.button`
  padding: 6px;
  border-radius: 4px;
  border: 1px solid ${(props) => props.bordercolor};
  background-color: ${(props) => props.bgcolor};
  color: ${(props) => props.color};
  width: 100px;
  font-size: 14px;
`;
const ButtonBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;
function Menubar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userId = JSON.parse(localStorage.getItem("logInUser"));

  const goMyPage = () => {
    navigate(`/mypage/${userId}`);
  };
  const handleSignup = () => {
    dispatch(open("signup"));
  };
  const handleLogIn = () => {
    dispatch(open("login"));
  };
  const handleLogOut = () => {
    const signOut = async () => {
      const { data, error } = await supabase.auth.signOut();
      if (error) console.error(error);
      else {
        dispatch(logOut());
        localStorage.removeItem("logInUser");
        alert("로그아웃되었습니다");
      }
    };
    signOut();
  };
  return (
    <MenuContainer>
      <MenuInnerContainer>
        <div>
          <Link to="/">
            <img src={Logo} />
          </Link>
        </div>
        <ButtonBox>
          {userId ? (
            <>
              <Button
                bgcolor={"var(--white-color)"}
                color={"var(--golden-color)"}
                bordercolor={"var(--golden-color)"}
                onClick={handleLogOut}
              >
                Log Out
              </Button>
              <Button
                bgcolor={"var(--golden-color)"}
                color={"var(--white-color)"}
                bordercolor={"var(--golden-color)"}
                onClick={goMyPage}
              >
                MY PAGE
              </Button>
            </>
          ) : (
            <>
              <Button
                bgcolor={"var(--white-color)"}
                color={"var(--golden-color)"}
                bordercolor={"var(--golden-color)"}
                onClick={handleLogIn}
              >
                Log In
              </Button>
              <Button
                bgcolor={"var(--golden-color)"}
                color={"var(--white-color)"}
                bordercolor={"var(--golden-color)"}
                onClick={handleSignup}
              >
                Sign up
              </Button>
            </>
          )}
        </ButtonBox>
      </MenuInnerContainer>
    </MenuContainer>
  );
}

export default Menubar;
