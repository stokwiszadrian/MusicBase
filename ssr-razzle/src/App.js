import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'
import './index.css';
import Home from './Home';
import Form from './Form';
import AlbumList from './AlbumList';
import AlbumDetails from './AlbumDetails';
import Main from './Main';
import NotAuthorized from './NotAuthorized';
import { useKeycloak } from '@react-keycloak/ssr';


function App( props ) {
    const { keycloak } = useKeycloak();
    if (keycloak.authenticated && typeof window !== 'undefined') {
      window.accessToken = keycloak.token;
    }


    let initialData
    if ( props.initialData ) {
      initialData = props.initialData
    } else {
      if (typeof window !== 'undefined') {
        initialData = window.__initialData__;
        delete window.__initialData__;
      }
    }

    
          return (
            <Routes>
              <Route path="/home" element={<Main initialData={initialData} />} >
                <Route index element={<Home />} />
                {keycloak.authenticated ? (
                  <>
                  <Route path="edit" element={<Form />} />
                  <Route path="add" element={<Form />} />
                  <Route path="entries" element={<AlbumList />} />
                  <Route path="entries/:id" element={<AlbumDetails />} />
                  </>
                ) : (
                  <>
                  <Route path="edit" element={<NotAuthorized />} />
                  <Route path="add" element={<NotAuthorized />} />
                  <Route path="entries" element={<NotAuthorized />} />
                  <Route path="entries/:id" element={<NotAuthorized />} />
                  </>
                )}
              </Route>
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
            );


}

export default App;
