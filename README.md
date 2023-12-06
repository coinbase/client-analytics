# Client Analytics

With this Open Source Analytics Library, we want to provide all developers with the ability to move to an auto-instrumented event world where we can count on data being produced with standardized fields.

For a deeper look into the Library, please visit our documentation.

## Installation

You can install Client Analytics package using yarn (or npm):

```bash
yarn add client-analytics
```

## Features

- **User Event Tracking**: Easily track user interactions such as clicks, form submissions, page views, and custom events. Gain insights into how users are engaging with your application.

- **Performance Metrics**: Monitor key performance metrics such as page load times, resource timings, and network latency. Identify bottlenecks and areas for optimization.

- **Web Vitals Monitoring**: Specifically designed to help you track and analyze Core Web Vitals, including Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS).

- **Customizable Configuration**: Configure the Client Analytics package to suit your application's specific tracking and reporting needs. Customize event types, tracked metrics, and reporting destinations.

- **Data Privacy**: The library does not track any user information by default. you can choose to enable session tracking to associate events with a specific user session.

- **Intuitive API**: Client Analytics offers a user-friendly API that integrates seamlessly into your application codebase. No complex setup required.

## Examples

### Init Example

```typescript
init({
  platform: 'web',
  projectName: 'analytics-example',
});
```

## Usage

The Client analytics library provides multiple features. You can use all of them or only the ones you need.

- TrackEvent is used to track user interactions such as clicks, form submissions, page views, and custom events.
- TrackMetric is used to monitor key performance metrics such as page load times, resource timings, and network latency.
- TrackPageView is used to track page views.
- InitTrackPageView is used to automatically track page view events.

### InitTrackPageView Example

```typescript
const history = createBrowserHistory();

initTrackPageview({
  browserHistory: history,
});
```

### trackEvent Example

```typescript
trackEvent({
  //required parameters
  action: 'click',
  component: 'button',
  name: 'increment',
  // optional metadata
  count: count + 1,
});
```

### trackMetric Example

```typescript
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
```

## Customization

The Client Analytics library is composed of multiple modules that can be used independently. You can customize the library to suit your application's specific tracking and reporting needs.
This is the list of modules that you can customize:

```typescript
export type Storage = {
  networkLayer: NetworkLayer;
  metricScheduler: Scheduler<Metric>;
  eventScheduler: Scheduler<Event>;
  location: Location;
  identity: Identity;
  device: Device;
};
```

In order to customize the library, you need to create a custom storage object and pass it to the init function.
An example of cusotmization can be found in our [tests](./src/storage/storage.test.ts).

```typescript
import { init } from 'client-analytics';
import { injectComponents } from './init';

// this will override the network layer
const overrides = {
  createNetworkLayer: () => {
    return {
      sendEvents: (events) => {
        // here you can send the events to your backend
        // or any other service
        console.log('sendEvents', events);
      },
      sendMetrics: (metrics) => {
        // here you can send the metrics to your backend
        // or any other service
        console.log('sendMetrics', metrics);
      },
    };
  },
};

init(
  {
    platform: 'web',
    projectName: 'analytics-example',
  },
  overrides
);

// or if you like closures
const cusotmInit = injectComponents(overrides);
cusotmInit({
  platform: 'web',
  projectName: 'analytics-example',
});

// both options are equivalent
```

## Contributing

We welcome contributions from the community! If you encounter any issues or have suggestions for improvements, please open an issue on our GitHub repository.

## License

This project is licensed under the MIT License.
