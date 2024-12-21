import { BrowserRouter as Router} from 'react-router-dom';
import { useRoutes } from 'react-router-dom';
import './App.css';
import Video from './components/Video';
import Home from './components/Home';
import Credentials from './components/Credentials';


const AppRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/video/', element: <Credentials /> },
    { path:'/video/:room', element: <Video /> }
  ]);
  return routes;
};

function App() {
  return (
    <>
      <Router>
          <AppRoutes />
      </Router>
    </> 
  );
}

export default App;
