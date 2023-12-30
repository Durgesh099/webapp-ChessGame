import { Container } from "@mui/material";
import Game from "./components/Game";

export default function App() {
  const ContainerStyle = {
    "margin-left":"0px",
    "padding": "0px"
  }
  return (
    <Container style={ContainerStyle}>
      <Game />
    </Container>
  );
}