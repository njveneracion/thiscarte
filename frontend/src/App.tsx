import Hero from "./pages/Hero";
import Fruits from "./components/Fruits";

function App() {
  return (
    <>
      {/* <Hero /> */}
      <Fruits name="TITE" color="Red" isRipe={true} qty={10} />
      <Fruits name="Banana" color="Yellow" isRipe={false} qty={5} />
    </>
  );
}

export default App;
