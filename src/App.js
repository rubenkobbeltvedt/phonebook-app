import React, { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';
import HomePage from './components/HomePage';
import AddContactPage from './components/AddContactPage';
import './App.css';

function App() {
  const auth = useAuth();
  const accessToken = auth?.user?.access_token;

  useEffect(() => {
    if (auth.isAuthenticated) clearUrlParms();
  }, [auth.isAuthenticated]);

  const clearUrlParms = () => {
    window.history.replaceState({}, document.title, `${window.location.origin}${window.location.pathname}`);
  }

  return (
    <div className="container">
      {auth.activeNavigator === 'signinSilent' && <div>Signing you in...</div>}
      {auth.activeNavigator === 'signoutRedirect' && <div>Signing you out...</div>}
      {auth.isLoading && <p>Loading...</p>}
      {auth.error && <p>Oops... {auth.error.message}</p>}
      {auth.isAuthenticated && (
        <div className="App">
          <Router>
            <Routes>
              <Route exact path="/" element={<HomePage accessToken={accessToken} />} />
              <Route path="/add" element={<AddContactPage accessToken={accessToken} />} />
            </Routes>
          </Router>
          <button className="destructive-btn" onClick={() => auth.signoutRedirect()}>Log out</button>
        </div>
      )}
      {!auth.isAuthenticated && <button onClick={() => auth.signinRedirect()}>Log in</button>}
      <ToastContainer />
    </div>
  )
}

export default App;
