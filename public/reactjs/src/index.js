import React, { useEffect, Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "assets/theme/theme.js";
// plugins styles from node_modules
import "react-perfect-scrollbar/dist/css/styles.css";
import "@fullcalendar/common/main.min.css";
import "@fullcalendar/daygrid/main.min.css";
import "quill/dist/quill.core.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
// plugins styles downloaded
import "assets/plugins/nucleo/css/nucleo.css";
// core styles
import "assets/scss/argon-dashboard-pro-material-ui.scss?v1.0.0";
import AdminLayout from "layouts/Admin.js";
import RtlLayout from "layouts/RTL.js";
import AuthLayout from "layouts/Auth.js";
import Index from "views/Index.js";
import Login from "views/login.js";
import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware } from "redux";
import { logger } from "redux-logger";
import { Provider } from "react-redux";
import reducer from "./reducers";
import rootSaga from "./sagas";
import setAuthToken from "util/setAuthToken";
import { storedList } from "util/localstorage";
import ReactGA from "react-ga4";
import { ErrorBoundary } from "@sentry/react";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

import "./index.css"

const user = storedList("user");

if (process.env.REACT_APP_DSN_KEY) {
  Sentry.setUser({ email: user?.email });
  Sentry.init({
    dsn: process.env.REACT_APP_DSN_KEY,
    environment: process.env.REACT_APP_ENVIRONMENT,
    integrations: [new Integrations.BrowserTracing(), new Sentry.Replay()],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
    beforeSend(event) {
      // Add user information to session replay events
      event.user = {
        id: user?._id,
        email: user?.email,
      };
      return event;
    },
  });
}

const TRACKING_ID = process.env.REACT_APP_GA_CODE;

if (TRACKING_ID) {
  ReactGA.initialize(TRACKING_ID);
}

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware, logger));
sagaMiddleware.run(rootSaga);
const token = storedList("token");
if (token) setAuthToken(token);

axios.interceptors.request.use((request) => {
  return request;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    //If we receive Forbidden in response from api then clear the user from localstorage and logout the user.
    let condition = error.response.data.message
      ? error.response.data.message.indexOf("Forbidden") > -1
      : false;
    if (condition) {
      Promise.reject(error);
      localStorage.clear();
      window.location.href = "/login";
    } else {
      return Promise.reject(error);
    }
  }
);

const App = () => {
  useEffect(() => {
    if (TRACKING_ID) {
      ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    }
  }, [TRACKING_ID]);
  return (
    <ErrorBoundary fallback={"An error has occurred on elaap UI system"}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Provider store={store}>
          <BrowserRouter>
            <Switch>
              <Route path="/index" render={(props) => <Index {...props} />} />
              <Route
                path="/admin"
                render={(props) => <AdminLayout {...props} />}
              />
              <Route path="/rtl" render={(props) => <RtlLayout {...props} />} />
              <Route
                path="/auth"
                render={(props) => <AuthLayout {...props} />}
              />
              <Route path="/login" render={(props) => <Login {...props} />} />
              <Redirect from="*" to="/login" />
            </Switch >
          </BrowserRouter >
        </Provider >
      </ThemeProvider >
    </ErrorBoundary >
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
