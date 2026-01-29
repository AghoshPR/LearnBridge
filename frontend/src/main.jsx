import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './Store/store.js'
import { Provider } from "react-redux"
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "./components/ui/sonner";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";



const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>

      

      
      <BrowserRouter>

      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

        <Elements stripe={stripePromise}>
        
            <App />
            <Toaster position="top-right" />
        
        </Elements>
          

      </GoogleOAuthProvider>

      </BrowserRouter>
      

    </Provider>
  </StrictMode>,
)
