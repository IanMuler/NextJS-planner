import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import styled from "styled-components";
import { theme } from "styles/theme";
import { popupCenter } from "utils/popupCenter";

const Container = styled.header<{ backgroundColor?: string }>`
  height: ${theme.height.header};
  display: flex;
  align-items: center;
  padding: 0 2rem;
  background-color: transparent;
`;

const Title = styled.h1`
  font-size: ${theme.font.size.sm.title};

  a {
    color: ${theme.colors.black};
    text-decoration: none;
  }
`;

const Nav = styled.nav`
  margin-left: auto;
  display: flex;
  align-items: center;
`;

const NavButton = styled.button`
  font-size: ${theme.font.size.sm.nav};
  color: ${theme.colors.blue};
  font-weight: bold;
  border: none;
  background-color: transparent;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const NavSpan = styled.span`
  font-size: ${theme.font.size.sm.nav};
  color: ${theme.colors.black};
`;

interface IComponentProps {
  children: string;
  backgroundColor?: string;
}

const Header = ({ children }: IComponentProps) => {
  const { data: session, status } = useSession();

  return (
    <Container>
      <Title>
        <Link href="/" passHref>
          {children}
        </Link>
      </Title>
      <Nav>
        {status === "unauthenticated" ? (
          <NavButton onClick={() => popupCenter("/login", "Login with Google")}>
            Login
          </NavButton>
        ) : (
          <>
            <NavSpan>Hi {session?.user?.name.split(" ")[0]} |&nbsp;</NavSpan>
            <NavButton onClick={() => signOut()}>Logout</NavButton>
          </>
        )}
      </Nav>
    </Container>
  );
};

export default Header;
