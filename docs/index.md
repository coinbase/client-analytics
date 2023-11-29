![coinbase-logo-image](./img/CB-logo.png)

# Open Analytics

With this Open Source Analytics Library, we want to provide all developers with the ability to move to an auto-instrumented event world where we can count on data being produced with standardized fields.

For a deeper look into the Library, please visit our [documentation](./documentation.html).

# Installation

You can install the Open Analytics package using npm:

```bash
yarn add open-analytics
```

## Features

- **User Event Tracking**: Easily track user interactions such as clicks, form submissions, page views, and custom events. Gain insights into how users are engaging with your application.

- **Performance Metrics**: Monitor key performance metrics such as page load times, resource timings, and network latency. Identify bottlenecks and areas for optimization.

- **Web Vitals Monitoring**: Specifically designed to help you track and analyze Core Web Vitals, including Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS).

- **Customizable Configuration**: Configure the Open Analytics package to suit your application's specific tracking and reporting needs. Customize event types, tracked metrics, and reporting destinations.

- **Data Privacy**: The library does not track any user information by default. you can choose to enable session tracking to associate events with a specific user session.

- **Intuitive API**: Open Analytics offers a user-friendly API that integrates seamlessly into your application codebase. No complex setup required.

## Examples

Init Example

```typescript
init({
  platform: 'web',
  projectName: 'analytics-example',
});
```

InitTrackPageView Example

```typescript
const history = createBrowserHistory();

initTrackPageview({
  browserHistory: history,
});
```

trackEvent Example

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

trackMetric Example

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

## Contributing

We welcome contributions from the community! If you encounter any issues or have suggestions for improvements, please open an issue on our GitHub repository.

## License

This project is licensed under the MIT License.
