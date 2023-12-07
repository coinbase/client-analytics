import {
  FC,
  useState,
  useCallback,
  useContext,
  useLayoutEffect,
  useEffect,
  useRef,
} from 'react';
import './App.css';
import {
  trackEvent,
  trackMetric,
  MetricType,
  initTrackPageview,
} from 'client-analytics';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';

function HomePage() {
  const [count, setCount] = useState(0);

  const onButtonClick = useCallback(() => {
    setCount((count) => count + 1);
    trackEvent({
      //required parameters
      action: 'click',
      component: 'button',
      name: 'increment',
      // optional metadata
      count: count + 1,
    });
    trackMetric({
      //required parameters
      metricName: 'button_click',
      metricType: MetricType.count,
      value: count + 1,
      // optional metadata
      tags: {
        extra: 'metadata',
      },
    });
  }, [count]);

  return (
    <>
      <div></div>
      <h1>Client Analytics example</h1>
      <div className="card">
        <button onClick={onButtonClick}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <Link to="/secondary">
          <button>
            Click here to Navigate to another page to test page view analytics{' '}
          </button>
        </Link>
      </div>
    </>
  );
}

function SecondaryPage() {
  const [count, setCount] = useState(0);

  const onButtonClick = useCallback(() => {
    setCount((count) => count + 1);
    trackEvent({
      //required parameters
      action: 'click',
      component: 'button',
      name: 'increment',
      // optional metadata
      count: count + 1,
    });
    trackMetric({
      //required parameters
      metricName: 'button_click',
      metricType: MetricType.count,
      value: count + 1,
      // optional metadata
      tags: {
        extra: 'metadata',
      },
    });
  }, [count]);
  return (
    <>
      <div></div>
      <h1>Client Analytics example </h1>
      <div className="card">
        <p>Secondary page</p>
        <button onClick={onButtonClick}>count is {count}</button>

        <Link to="/">
          <button>Click here to Navigate back to home page</button>
        </Link>
      </div>
    </>
  );
}

const routes = (
  <Route path="/">
    <Route index element={<HomePage />} />
    <Route path="/secondary" element={<SecondaryPage />} />
  </Route>
);

const useHistory = () => {
  const location = useLocation();
  const listeners = useRef<(() => void)[]>([]);

  const listen = useCallback(
    (callback: () => void) => {
      listeners.current.push(callback);
    },
    [listeners]
  );

  useEffect(() => {
    listeners.current.forEach((listen) => listen());
  }, [location]);

  return { listen };
};

function HistoryProvider() {
  const history = useHistory();
  useEffect(() => {
    initTrackPageview({
      browserHistory: history,
    });
  }, []);
  return <></>;
}

function App() {
  return (
    <BrowserRouter>
      <HistoryProvider />
      <Routes>{routes}</Routes>
    </BrowserRouter>
  );
}

export default App;
