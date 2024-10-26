import './App.css';
import Counter from './components/Counter';

function App() {
  return (
    <div className="App">
      <Counter predefinedValue={1} />
    </div>
  );
}

export default App;
