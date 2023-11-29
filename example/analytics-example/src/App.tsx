import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { trackEvent, trackMetric, MetricType } from 'open-analytics';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() => {
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
          }}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;